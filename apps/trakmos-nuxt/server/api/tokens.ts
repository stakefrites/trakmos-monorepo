import mongoose from 'mongoose';
import { TokenModel } from '~/utils/db/models';

mongoose.connect(process.env.MONGO_DB_URI || 'mongodb+srv://localhost:27017').then(() => console.log('connected'));
export default defineEventHandler(async() => {
    return TokenModel.find();
})
