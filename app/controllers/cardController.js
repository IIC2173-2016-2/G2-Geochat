const KreditCard = require('../models/kreditcard');


exports.create = function (req, res) {
  // get all places
  KreditCard.save(req.body).then((card) => {
    return res.status(200).send({
      card,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
};
