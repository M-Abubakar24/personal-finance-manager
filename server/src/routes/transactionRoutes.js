const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

router.post("/", auth, addTransaction);
router.get("/", auth, getTransactions);
router.get("/summary", auth, getSummary);
router.put("/:id", auth, updateTransaction);



router.delete("/:id", auth, deleteTransaction);

module.exports = router;