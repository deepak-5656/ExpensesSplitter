const mongoose = require('mongoose');

async function debug() {
  try {
    await mongoose.connect('mongodb://localhost:27017/expense-splitter');
    const Expense = require('./server/models/Expense');
    const Group = require('./server/models/Group');

    const expenses = await Expense.find().populate('paidBy').populate('splitAmong.user');
    console.log(JSON.stringify(expenses, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
