import mongoose from 'mongoose';
import { AccountModel } from '~/utils/db/models';
import {AccountHandler} from "~/server/libs/wallet";

mongoose.connect(process.env.MONGO_DB_URI || 'mongodb+srv://localhost:27017').then(() => console.log('connected'));
export default defineEventHandler(async(event) => {
    const body = await useBody(event);
    const config = body.config;
    const id = body.id;
    try {
        const found = await AccountModel.findOne({userId: id});
        if (found) {
            return {
                error: 'An account with this ID already exists'
            }
        }
        const portfolio = await AccountHandler.Create(config.accounts, config.networks, config.userId, config.currency);
        const all = portfolio.serialize();
        const created = await AccountModel.create(all);
        return {
            account: created._id
        }
    } catch (e) {
        return {
            error: 'The ID specified is invalid'
        }
    }

})
