const Place = require('../mongoModels/place');

exports.main = function (req, res) {
  return res.render('chat.ejs', {
    // places,
    user: req.user, // get the user out of session and pass to template
  });
};
