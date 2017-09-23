//Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creates a User Schema, it will automatically set an _id to a user
var users = new Schema({
  name: {
    type: String
  },
  age: Number,
  sex: {
    type: String
  }
});

//Saves schema to DB
module.exports = mongoose.model('users', users);
