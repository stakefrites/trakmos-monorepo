import mongoose from 'mongoose';

import { UserModel} from '~/utils/db/models';
import {hashPasword, compare} from "~/server/libs/bcrypt";
mongoose.connect(process.env.MONGO_DB_URI || 'mongodb+srv://localhost:27017').then(() => console.log('connected'));

export default defineEventHandler(async(event) => {
    const body = await useBody(event);
    const {user} = body;
    const {username, password} = user;
    const account = await UserModel.findOne({username});
    if (!account) {
        const hash = await hashPasword(password);
        const created = await UserModel.create({username: user.username, password: hash});
        return {
            user: created._id
        }
    } else {
        const isAuth = await compare(user.password, account.password);
        if (!isAuth) {
            return {
                error: 'Invalid password'
            }
        }
        else {
            return {
                user: account._id
            }
        }
    }


})
