import {IAccountConfig} from "~/types/wallet";

export interface ICreateAccount {
    accounts: IAccountConfig[];
    networks: string[];
    userId: string;
    currency: string;
}