const mongoose = require('mongoose')
const User = require('../models/User')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)

async function makeAdmin() {
  try {
    const user = await User.findOneAndUpdate(
      { email: "thaaragainaturals@gmail.com" }, // Replace with actual email
      { role: "super_admin" },
      { new: true }
    );
    if (user) {
      console.log("Super Admin created:", user.name, user.email);
    } else {
      console.log("User not found with that email.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

makeAdmin();
