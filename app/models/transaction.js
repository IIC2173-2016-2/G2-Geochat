const utils = require('../services/utils');
const Kreditcard = require('../models/kreditcard');
const User = require('../models/user');

exports.buyArquicoins = function (id, amount) {
  return new Promise((resolve, reject) => {
    if (!utils.isInteger(amount)) {
      return reject(`Cannot buy ${amount}. Invalid input`);
    }

    Kreditcard.find({
      user_id: id,
    }).then((cards) => {
      let rejected = 0;
      cards.forEach((card) => {
        Kreditcard.isValid(card)
          .then((card) => {
            console.log(card);
            User.changeArquicoins(id, amount).then((user) => {
              resolve(user);
            }).catch((err) => {
              console.log('fallo la compra');
              reject(err);
            });
          }).catch((err) => {
            rejected++;
            if (rejected === cards.length) {
              reject('No valid cards');
            }
          });
      });
    }).catch((err) => {
      reject(err);
    });
  });
};

exports.spendArquicoins = function (id, cost) {
  return new Promise((resolve, reject) => {
    if (!utils.isInteger(cost)) {
      return reject(`Cannot decrease arquicoins by ${cost}. Invalid input`);
    }

    User.findById(id).then((user) => {
      if (user.arquicoins < cost) {
        return reject('not enough money');
      }
      User.changeArquicoins(id, -cost).then((user) => {
        resolve(user);
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};
