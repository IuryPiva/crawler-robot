const express = require("express");
const app = express();

const { searchRooms } = require("./crawler");

app.use(express.json());

app.post("/buscar", async (req, res) => {
  const { checkin, checkout } = req.body;

  try {
    res.json(await searchRooms({ checkin, checkout }));
  } catch (error) {
    res.status(404).send({ error: true, message: error });
  }
});

module.exports = app;
