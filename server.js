const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const routes = require("./routes/routes");

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/api/v1", routes);

const url = process.env.port;
app.listen(url, () => {
  console.log(`🚀 Server running on port ${url}`);
});
