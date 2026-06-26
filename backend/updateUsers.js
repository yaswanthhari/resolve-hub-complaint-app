const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS
    });
    console.log('MongoDB Connected');

    // Make yaswanthharitaluru@gmail.com an admin
    const adminUser = await User.findOneAndUpdate(
      { email: 'yaswanthharitaluru@gmail.com' },
      { role: 'admin', isApproved: true },
      { new: true }
    );
    console.log('Updated Admin:', adminUser ? adminUser.email : 'Not found');

    // Approve the agent account
    const agentUser = await User.findOneAndUpdate(
      { email: 'yaswanthharit@gmail.com' },
      { isApproved: true },
      { new: true }
    );
    console.log('Approved Agent:', agentUser ? agentUser.email : 'Not found');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateUsers();
