const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Expense = require('./models/Expense');
    const Group = require('./models/Group');
    const User = require('./models/User');

    console.log("Users:", await User.countDocuments());
    console.log("Groups:", await Group.countDocuments());
    console.log("Expenses:", await Expense.countDocuments());

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
