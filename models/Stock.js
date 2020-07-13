import { Schema, model } from 'mongoose';

const StockSchema = new Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

const Stock = model('stock', StockSchema);

export default Stock;