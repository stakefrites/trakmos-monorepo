import express from "express";

import { DatabaseHandler } from "../db/controller";

const router = express.Router();

const db = new DatabaseHandler();

router.use("/", async (req, res) => {
  const allTokens = await db.getAllTokens();
  res.json(allTokens);
});

export default router;
