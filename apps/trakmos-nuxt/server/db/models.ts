import mongoose from 'mongoose'

import { IAccount, IToken, IUser } from '@stakefrites/trakmos-types'
import {
  tokenSchema,
  userSchema,
  accountSchema
} from '@stakefrites/trakmos-schemas'

export const TokenModel = mongoose.model<IToken>('Token', tokenSchema)
export const UserModel = mongoose.model<IUser>('User', userSchema)
export const AccountModel = mongoose.model<IAccount>('Account', accountSchema)
