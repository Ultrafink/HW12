// db/index.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export let db = null;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // автоматически берёт из строки подключения
    console.log("✅ Успешно подключено к MongoDB");
  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error);
    process.exit(1);
  }
}
