const express = require('express');
const router = express.Router();
const axios = require('axios');
const PersonalExpense = require('../models/PersonalExpense');
const { protect } = require('../middleware/auth');

// Helper to get category from ML service or Smart Fallback
const getCategoryFromML = async (title) => {
  try {
    const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
    const response = await axios.post(`${ML_URL}/categorize`, { title }, { timeout: 2000 });
    // If the ML service successfully returns a specific category, use it
    if (response.data.category && response.data.category !== 'General') {
      return response.data.category;
    }
    throw new Error('Fallback to local heuristics');
  } catch (error) {
    // Smart Fallback if ML is down or returned General
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('uber') || lowerTitle.includes('taxi') || lowerTitle.includes('flight') || lowerTitle.includes('train')) return 'Transport';
    if (lowerTitle.includes('pizza') || lowerTitle.includes('burger') || lowerTitle.includes('restaurant') || lowerTitle.includes('cafe')) return 'Food';
    if (lowerTitle.includes('movie') || lowerTitle.includes('cinema') || lowerTitle.includes('netflix') || lowerTitle.includes('spotify')) return 'Entertainment';
    if (lowerTitle.includes('rent') || lowerTitle.includes('electricity') || lowerTitle.includes('water') || lowerTitle.includes('internet')) return 'Utilities';
    if (lowerTitle.includes('zara') || lowerTitle.includes('hm') || lowerTitle.includes('clothes') || lowerTitle.includes('shoes')) return 'Shopping';
    
    return 'General';
  }
};

// @route   GET /api/personal/expenses
// @desc    Get all personal expenses for a user
// @access  Private
router.get('/expenses', protect, async (req, res) => {
  try {
    const expenses = await PersonalExpense.find({ user: req.user._id }).sort('-date');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/personal/expenses
// @desc    Add a personal expense
// @access  Private
router.post('/expenses', protect, async (req, res) => {
  try {
    const { title, amount, date, note } = req.body;

    const category = await getCategoryFromML(title);

    const expense = await PersonalExpense.create({
      title,
      amount,
      category,
      date: date || Date.now(),
      note,
      user: req.user._id,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/personal/expenses/:id
// @desc    Delete a personal expense
// @access  Private
router.delete('/expenses/:id', protect, async (req, res) => {
  try {
    const expense = await PersonalExpense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
