var Promise = require('promise');
//Requiring Mongoose user schema
var Users = require('../models/user-model.js');

exports.postUser = postUser;

/** Posting a new users**/
function postUser(req) {
  return new Promise(function(resolve, reject) {
    var newUser = new Users(req.body);

    newUser.save(function(err) {
      if (err) {
        throw err;
      }
      // If no errors are found, it responds with a JSON of the new user
      resolve(req.body);
    });
  }, function(error) {
    throw error;
  });
}
