const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  splitAmong: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      share: {
        type: Number,
        required: true, // Amount this specific user owes for this expense
      },
    },
  ],
  splitType: {
    type: String,
    enum: ['equal', 'custom', 'percentage'],
    default: 'equal',
  },
  category: {
    type: String,
    default: 'General', // Populated by ML service
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  settled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
