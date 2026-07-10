const Budget = require("../models/Budget");

// Get Budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id,
    });

    res.json(budgets);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Add Budget
exports.addBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;

    const budget = await Budget.create({
      category,
      amount,
      user: req.user._id,
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(
      req.params.id
    );

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    await budget.deleteOne();

    res.json({
      message: "Budget deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};