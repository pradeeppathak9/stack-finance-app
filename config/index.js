import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb+srv://stackuser:stackuser123@stack-finance-cluster.klkuv.mongodb.net";
const MONGO_DB_NAME = "stackfinance";
const JWT_SECRET = "thisismyjwtsecret";

export default {
  PORT: process.env.PORT | 9999,
  MONGO_URI: MONGO_URI,
  MONGO_DB_NAME: MONGO_DB_NAME,
  JWT_SECRET: JWT_SECRET
};