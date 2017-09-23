var Promise = require('promise');
//Requiring Mongoose user schema
var Users = require('../models/user-model.js');

//Exposing getUsers and postUser to external calls
exports.getUsers = getUsers;
exports.postUser = postUser;

/** Gets all the users stored in the DB **/
function getUsers() {
  return new Promise(function(resolve, reject) {
    //Opens Mongoose Query
    var query = Users.find({});
    query.exec(function(err, users) {
      if (err) {
        return reject(err);
      }
      // If no errors are found, it responds with a JSON of all users
      return resolve(users);
    });
  }, function(error) {
    return reject(error);
  });
}

/** Posting a new users**/
function postUser(req) {
  return new Promise(function(resolve, reject) {
    var newUser = new Users(req.body);

    newUser.save(function(err) {
      if (err) {
        reject(err);
      }
      // If no errors are found, it responds with a JSON of the new user
      resolve(req.body);
    });
  }, function(error) {
    return reject(error);
  });
}
