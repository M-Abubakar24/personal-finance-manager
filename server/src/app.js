const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Personal Finance Manager API is running 🚀",
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
app.use(
  "/api/transactions",
  require("./routes/transactionRoutes")
);