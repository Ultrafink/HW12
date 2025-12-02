
import express from "express";
import dotenv from "dotenv";
import { connectDB, db } from "./db/index.js";
import { ObjectId } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());


await connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// 
// маршруты 
// 

//ПОСТ
app.post("/products", async (req, res) => {
  try {
    const product = req.body;
    const result = await db.collection("products").insertOne(product);

    res.status(201).json({
      message: "Продукт создан",
      productId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ГЕТ (всё)
app.get("/products", async (req, res) => {
  try {
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ГЕТ
app.get("/products/:id", async (req, res) => {
  try {
    const product = await db.collection("products").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!product) {
      return res.status(404).json({ error: "Продукт не найден" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ПУТ
app.put("/products/:id", async (req, res) => {
  try {
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Продукт не найден" });
    }

    res.json({ message: "Продукт обновлён" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ДЕЛИТ
app.delete("/products/:id", async (req, res) => {
  try {
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Продукт не найден" });
    }

    res.json({ message: "Продукт удалён" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
