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

exports.update = function (req, res) {
  const url_card_id = req.params.card_id.toString();
  const card_id = req.body.id.toString();
  if (card_id !== url_card_id || !card_id) {
    return res.status(400).send('IDs no coinciden');
  }
  KreditCard.update(card_id, req.body).then((card) => {
    return res.status(200).send({
      card,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
};

exports.delete = function (req, res) {
  const url_card_id = req.params.card_id.toString();
  const card_id = req.body.id.toString();
  if (card_id !== url_card_id || !card_id) {
    return res.status(400).send('IDs no coinciden');
  }
  KreditCard.delete(card_id).then((card) => {
    return res.status(200).send({
      card,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
};
