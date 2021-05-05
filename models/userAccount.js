var mongoose = require('mongoose');

var UserAccountSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: [true, 'First name cannot be blank']
  },
  lastName:{
    type: String, 
    required: [true, 'Last name cannot be blank']
  },
  age:{
    type: Number,
    required: [true, 'Age cannot be blank']
  },
  email: {
    type: String,
    required: [true, 'Email cannot be blank']
  },
  password: {
    type: String,
    required: [true, 'Password cannot be blank']
  }
})

var UserAccount = mongoose.model('UserAccount', UserAccountSchema);
module.exports = UserAccount; 