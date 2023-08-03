// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  answers: [
    {
      question: { type: String },
      answer: { type: Number, min: 1, max: 2 },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
