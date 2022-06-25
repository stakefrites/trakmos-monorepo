import mongoose from 'mongoose'
import { TokenModel } from '~/server/db/models'

mongoose
  .connect(process.env.MONGO_DB_URI || 'mongodb+srv://localhost:27017')
  .then(() => console.log('connected'))
export default defineEventHandler(() => {
  return TokenModel.find()
})
