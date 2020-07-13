import pkg from 'mongoose';
const { Schema, model } = pkg;
import { StockSchema } from './Stock.js'

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  portfolio: [ String ],

}, { timestamps: true });

const User = model('user', UserSchema);

export default User;