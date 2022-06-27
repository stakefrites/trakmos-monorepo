import mongoose from 'mongoose'

// @TODO: Update schema after adding the helper function that gets the normalized data
export const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  tokens: mongoose.Schema.Types.Mixed,
  portfolios: mongoose.Schema.Types.Mixed,
  accounts: mongoose.Schema.Types.Mixed,
  currency: String
})

export const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true }
})

export const tokenSchema = new mongoose.Schema({
  coingeckoId: {
    type: String
  },
  base: { type: String, unique: true, require: true },
  name: { type: String },
  symbol: String,
  units: {
    type: mongoose.Schema.Types.Mixed
  },
  network: String,
  image: String,
  price: {
    usd: Number,
    cad: Number,
    eur: Number
  }
})
