const User = require('../models/user');
const KreditCard = require('../models/kreditcard');
const Transaction = require('../models/transaction');

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
  KreditCard.find({
    user_id: urlId,
  }).then((cards) => {
    return res.status(200).send({
      cards,
    });
  }).catch((err) => {
    return res.status(500).send(err);
  });
};

exports.buyArquicoins = function (req, res) {
  const url_id = req.params.id.toString();
  const id = req.body.id.toString();
  const amount = req.body.amount;
  if (id !== url_id || !id) {
    return res.status(400).send('IDs no coinciden');
  }
  Transaction.buyArquicoins(id, amount).then((user) => {
    if (!user) {
      return res.status(500).send('Something went wrong');
    }
    return res.status(200).send({
      user,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
};

exports.spendArquicoins = function (req, res) {
  const url_id = req.params.id.toString();
  const id = req.body.id.toString();
  const amount = req.body.cost;
  if (id !== url_id || !id) {
    return res.status(400).send('IDs no coinciden');
  }
  Transaction.spendArquicoins(id, amount).then((user) => {
    if (!user) {
      return res.status(500).send('Something went wrong');
    }
    return res.status(200).send({
      user,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
};

exports.transferArquicoins = function (req, res) {
  const url_id = req.params.id.toString();
  const fromId = req.body.fromId.toString();
  const toId = req.body.toId.toString();
  const amount = req.body.amount;
  if (fromId !== url_id || !fromId) {
    return res.status(400).send('IDs no coinciden');
  }
  Transaction.transferArquicoins(fromId, amount, toId).then((user) => {
    if (!user) {
      return res.status(500).send('Something went wrong');
    }
    return res.status(200).send({
      user,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
};
