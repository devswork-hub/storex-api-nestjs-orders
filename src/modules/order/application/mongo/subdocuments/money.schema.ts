import { Schema } from 'mongoose';

export const MoneySchema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
});
