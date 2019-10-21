const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests

const app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

app.post("/buscar", async (req, res) => {
  const { checkin, checkout } = req.body;

  try {
    res.json(await searchRooms({ checkin, checkout }));
  } catch (error) {
    res.status(404).send({ error: true, message: error });
  }
});

module.exports = app;
 