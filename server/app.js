const express = require("express");
const app = express();
const cors = require("cors");
const firebase = require('./firebase')
const port = 3005;

app.use(cors());
app.use(express.json());

app.use("/CurrencyPairs", require("./controllers/CurrencyPairs"));

app.listen(port, () => console.log(`Listening on port ${port}`))
