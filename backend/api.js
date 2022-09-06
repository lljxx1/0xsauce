require("dotenv").config();

const express = require("express");
const compression = require("compression");
const cors = require("cors");
const { ModelHandler } = require("sequelize-handlers");
const bodyParser = require("body-parser");
const app = express();
const { Asset } = require("./schema");
const { getProof } = require("./handlers/proof");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(cors());
app.use(compression());
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/api/getProof", getProof);

app.get("*", async (req, res) => {
  res.send("Hello");
});

module.exports = {
  app,
};
