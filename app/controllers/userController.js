const User = require('../models/user');
const KreditCard = require('../models/kreditcard');

exports.userExists = function (req, res) {
  const username = req.params.username.toString();
  // get all places
  User.findByUsername(username).then((user) => {
    if (!user) {
      return res.status(200).send({
        exists: false,
      });
    }
    return res.status(200).send({
      exists: true,
    });
  }).catch((err) => {
    return res.status(500).send(err);
  });
};

exports.update = function (req, res) {
  const urlId = req.params.id.toString();

  const id = req.body.id.toString();
  if (urlId !== id) {
    return res.status(400).send('IDs do not match');
  }
  // get all places
  User.update(id, req.body).then((user) => {
    return res.status(200).send({
      user,
    });
  }).catch((err) => {
    return res.status(500).send(err);
  });
};

exports.getKreditCards = function (req, res) {
  const urlId = req.params.id.toString();
  KreditCard.findFromUser(urlId, (err, cards) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send({
      cards,
    });
  });
};
