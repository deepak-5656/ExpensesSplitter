const express = require('express');
const router = express.Router();
const axios = require('axios');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const Settlement = require('../models/Settlement');
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

// @route   GET /api/expenses/group/:id
// @desc    Get all expenses for a group
// @access  Private
router.get('/group/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const expenses = await Expense.find({ group: req.params.id })
      .populate('paidBy', 'name')
      .populate('splitAmong.user', 'name')
      .sort('-createdAt');
      
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/expenses
// @desc    Add an expense to a group
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, paidBy, splitAmong, splitType, groupId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    // Auto-categorize using ML
    const category = await getCategoryFromML(title);

    const expense = await Expense.create({
      title,
      amount,
      paidBy: paidBy || req.user._id,
      splitAmong,
      splitType,
      category,
      group: groupId,
    });

    // Add expense to group
    group.expenses.push(expense._id);
    await group.save();

    // Populate for the response
    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name')
      .populate('splitAmong.user', 'name');

    // Emit real-time event
    req.io.to(groupId.toString()).emit('expense:added', populatedExpense);

    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/expenses/:id/settle
// @desc    Settle an expense or create a settlement between users
// @access  Private
router.patch('/:id/settle', protect, async (req, res) => {
  try {
    // We can either settle a specific expense, or create a general settlement
    // Here we'll implement a general settlement creation logic
    const { toUserId, amount, groupId } = req.body;

    const settlement = await Settlement.create({
      from: req.user._id,
      to: toUserId,
      amount,
      group: groupId,
      settled: true,
      settledAt: Date.now()
    });

    // You might also want to mark specific expenses as settled
    // For simplicity, we just add the settlement record which acts as a payment
    
    req.io.to(groupId.toString()).emit('expense:settled', settlement);

    res.json(settlement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Only allow deletion if user added it (paidBy)
    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    const groupId = expense.group;

    await expense.deleteOne();

    // Remove from group
    await Group.findByIdAndUpdate(groupId, {
      $pull: { expenses: req.params.id }
    });

    req.io.to(groupId.toString()).emit('expense:deleted', req.params.id);

    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
