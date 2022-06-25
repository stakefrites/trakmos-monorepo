import nodeCron from "node-cron";
import * as dotenv from "dotenv";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require("cronitor")(process.env.CRONITOR_API_KEY, {
  environment: process.env.NODE_ENV,
});

cron.wraps(nodeCron);

import { DatabaseHandler } from "../db/controller";
import { CosmosDirectory } from "@stakefrites/cosmos-directory";
import { Price } from "../utils/Price";
import { AccountHandler, mapAsync, sleep } from "@stakefrites/trakmosjs";
import { IToken } from "@stakefrites/trakmos-types";

const db = new DatabaseHandler();
const directory = new CosmosDirectory();
const priceApi = new Price();

const addTokenData = async (networkName: string) => {
  const token = await directory.getTokenData(networkName);
  const tokens: IToken[] = token.assets.map((t: any) => {
    return {
      network: token.chain_name,
      base: t.base,
      name: t.name,
      symbol: t.symbol,
      units: t.denom_units,
      image: t.logo_URIs.png ? t.logo_URIs.png : t.logo_URIs.svg,
      coingeckoId: t.coingecko_id || false,
    };
  });

  const saved = mapAsync(tokens, async (t: IToken) => {
    db.addToken(t);
  });
};

const refreshTrakmosAccounts = async () => {
  const accounts = await db.getAllAccounts();
  await mapAsync(accounts, async (account: any) => {
    console.log(`refreshing ${account._id}`);
    const handler = await AccountHandler.Load(account, account.userId);
    await handler.refresh();
    const data = handler.serialize();
    await db.updateAccount(account._id.toString(), data);
  });
};

const refreshPrices = async () => {
  const tokens = await db.getAllTokens();
  console.log("refreshing prices");
  await mapAsync(tokens, async (token: any) => {
    if (token.coingeckoId) {
      await sleep(1.2);
      const prices = await priceApi.getPrice(token.coingeckoId);
      const data = {
        price: prices[token.coingeckoId],
      };
      await db.updatePrice(token._id.toString(), data);
    }
  });
  return "ok for prices";
};

const refreshTokenData = async () => {
  const chains = await directory.getChains();
  const chainNames = Object.keys(chains);
  await mapAsync(chainNames, async (name: any) => {
    await sleep(1);
    await addTokenData(name);
  });
};

export const refreshTrakmosAccountsJob = cron.schedule(
  "Refresh Trakmos Accounts",
  "0 * * * *",
  refreshTrakmosAccounts
);
export const refreshPricesJob = cron.schedule(
  "Refresh Prices",
  "*/15 * * * *",
  refreshPrices
);
export const refreshTokenDataJob = cron.schedule(
  "Refresh Token Data",
  "0 0 * * 0",
  refreshTokenData
);
//export const refreshTokenDataJob = cron.schedule("0 * * * *", refreshTokenData);
