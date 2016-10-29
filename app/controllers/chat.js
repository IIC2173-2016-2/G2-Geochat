
const Place = require('../mongoModels/place');

exports.main = function (req, res) {
  // get all places
  Place.find((err, places) => {
    if (err) {
      return res.render('error.ejs', {
        message: 'There has been an error geting the places',
        error: err,
      });
    }
    return res.render('chat.ejs', {
      // places,
      user: req.user, // get the user out of session and pass to template
    });
  });
};
