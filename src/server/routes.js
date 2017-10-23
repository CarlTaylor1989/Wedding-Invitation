var router = require('express').Router();
var nodemailer = require('nodemailer');
var four0four = require('./utils/404')();
var data = require('./data');
var info = require('./utils/info');
var UserFactory = require('./factories/user.factory');

router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.post('/users', postUser);
router.get('/*', four0four.notFoundMiddleware);
router.post('/postEmail', postEmail);

module.exports = router;

//////////////

function getPeople(req, res, next) {
  res.status(200).send(data.people);
}

function getPerson(req, res, next) {
  var id = +req.params.id;
  var person = data.people.filter(function(p) {
    return p.id === id;
  })[0];

  if (person) {
    res.status(200).send(person);
  } else {
    four0four.send404(req, res, 'person ' + id + ' not found');
  }
}

function postUser(req, res, next) {
  console.log('post user route')
  UserFactory.postUser(req).then(function(user) {
    console.log('Successfully posted '+ JSON.stringify(user));
    res.json(user);
  });
}

function postEmail(req, res, next) {
  var transporter = nodemailer.createTransport({
    service: info.service,
    auth: {
      user: info.user,
      pass: info.pass
    }
  });

  var mailOptions = {
    from: '<carltaylor1989@gmail.com>',
    to: 'carltaylor1989@gmail.com'
  };

  if(req.body.attending === false) {
    mailOptions.subject = req.body.name + ' are sadly not attending.';
    mailOptions.html = '';
  } else {
    mailOptions.subject = req.body.name + ' are attending!';
    mailOptions.html = '<strong>' + req.body.name + ' are attending!</strong><br /><br />Their meal choices are: ' + req.body.menu[0] +' and ' + req.body.menu[1];
  }

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.json({yo: 'error'});
    } else {
      console.log('Message sent: ' + info.response);
      res.json({yo: info.response});
    }
  });
}
