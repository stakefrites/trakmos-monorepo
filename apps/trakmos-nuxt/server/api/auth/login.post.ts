import mongoose from 'mongoose';

import { UserModel} from '~/utils/db/models';
import { compare} from "~/server/libs/bcrypt";
mongoose.connect(process.env.MONGO_DB_URI || 'mongodb+srv://localhost:27017').then(() => console.log('connected'));

export default defineEventHandler(async(event) => {
    const body = await useBody(event);
    const {user} = body;
    const {username} = user;
    const account = await UserModel.findOne({username});
    if (!account) {
        return {
            error: "User not found"
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
