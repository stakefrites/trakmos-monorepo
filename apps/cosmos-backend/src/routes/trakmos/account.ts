import express from "express";

import { AccountHandler } from "@stakefrites/trakmosjs";
import { DatabaseHandler } from "../../db/controller";

import { IAccountConfig } from "@stakefrites/trakmos-types";

interface ICreateAccount {
  accounts: IAccountConfig[];
  networks: string[];
  userId: string;
  currency: string;
}

const router = express.Router();
const db = new DatabaseHandler();

router.post("/", async (req, res) => {
  const config: ICreateAccount = req.body.config;
  const found = await db.getAccount(config.userId);
  if (found) {
    res.json({
      status: "error",
      message: "An account already exists",
    });
  } else {
    const portfolio = await AccountHandler.Create(
      config.accounts,
      config.networks,
      config.userId,
      config.currency
    );
    const all = portfolio.serialize();
    const created = await db.createAccount(all);
    res.json({
      status: "success",
      account: created._id,
    });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const found = await db.getAccount(userId);
  if (!found) {
    res.json({
      status: "error",
      message: "Not found!",
    });
  } else {
    res.json({
      status: "success",
      account: found,
    });
  }
});

export default router;
