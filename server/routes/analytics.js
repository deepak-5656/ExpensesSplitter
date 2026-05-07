const express = require('express');
const router = express.Router();
const PersonalExpense = require('../models/PersonalExpense');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

// @route   GET /api/analytics/personal
// @desc    Get personal expense analytics (Combined Personal + Group shares)
// @access  Private
router.get('/personal', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current month dates
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // 1. Get Personal Expenses for current month
    const personalExpenses = await PersonalExpense.find({
      user: userId,
      date: { $gte: firstDay, $lt: nextMonth },
    });

    // 2. Get Group Expenses for current month where user owes money or paid
    const groupExpenses = await Expense.find({
      'splitAmong.user': userId,
      createdAt: { $gte: firstDay, $lt: nextMonth }
    });

    // Calculate total spending for current month
    let totalSpending = 0;
    const categoryBreakdownMap = {};

    // Process Personal Expenses
    personalExpenses.forEach(exp => {
      totalSpending += exp.amount;
      categoryBreakdownMap[exp.category] = (categoryBreakdownMap[exp.category] || 0) + exp.amount;
    });

    // Process Group Expenses (Only add the user's specific share to their total)
    groupExpenses.forEach(exp => {
      const userShare = exp.splitAmong.find(s => s.user.toString() === userId.toString());
      if (userShare && userShare.share > 0) {
        totalSpending += userShare.share;
        categoryBreakdownMap[exp.category] = (categoryBreakdownMap[exp.category] || 0) + userShare.share;
      }
    });

    const categoryBreakdown = Object.keys(categoryBreakdownMap).map(key => ({
      name: key,
      value: categoryBreakdownMap[key]
    }));

    // Last 6 months trend (Bar chart data)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    // Fetch past 6 months data
    const pastPersonal = await PersonalExpense.find({
      user: userId,
      date: { $gte: sixMonthsAgo }
    });

    const pastGroup = await Expense.find({
      'splitAmong.user': userId,
      createdAt: { $gte: sixMonthsAgo }
    });

    // Aggregate monthly
    const monthlyDataMap = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyDataMap[key] = 0;
    }

    pastPersonal.forEach(exp => {
      const d = new Date(exp.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyDataMap[key] !== undefined) {
        monthlyDataMap[key] += exp.amount;
      }
    });

    pastGroup.forEach(exp => {
      const userShare = exp.splitAmong.find(s => s.user.toString() === userId.toString());
      if (userShare && userShare.share > 0) {
        const d = new Date(exp.createdAt);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (monthlyDataMap[key] !== undefined) {
          monthlyDataMap[key] += userShare.share;
        }
      }
    });

    const monthlyTrend = Object.keys(monthlyDataMap).map(key => ({
      month: key,
      amount: monthlyDataMap[key]
    }));

    res.json({
      totalSpending,
      categoryBreakdown,
      monthlyTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/group/:id
// @desc    Get group expense analytics
// @access  Private
router.get('/group/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const expenses = await Expense.find({ group: req.params.id }).populate('paidBy', 'name');

    const totalGroupSpending = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    // Who spent the most
    const spendingByUserMap = expenses.reduce((acc, exp) => {
      const userName = exp.paidBy ? exp.paidBy.name : 'Unknown';
      acc[userName] = (acc[userName] || 0) + exp.amount;
      return acc;
    }, {});

    const spendingByUser = Object.keys(spendingByUserMap).map(key => ({
      name: key,
      value: spendingByUserMap[key]
    }));

    // Group Category Breakdown
    const groupCategoryBreakdownMap = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const groupCategoryBreakdown = Object.keys(groupCategoryBreakdownMap).map(key => ({
      name: key,
      value: groupCategoryBreakdownMap[key]
    }));

    res.json({
      totalGroupSpending,
      spendingByUser,
      groupCategoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
