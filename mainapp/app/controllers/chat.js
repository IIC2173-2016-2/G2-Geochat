const User = require('../models/user');

exports.main = function (req, res) {
  User.all().then((users) => {
    console.log(users);
    return res.render('chat.ejs', {
      // places,
      user: req.user, // get the user out of session and pass to template
      users,
    });
  }).catch((err) => {
    console.log(err);
  });
};
