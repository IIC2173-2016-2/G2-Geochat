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
            User.changeArquicoins(id, amount).then((user) => {
              resolve(user);
            }).catch((err) => {
              reject(err);
            });
          }).catch(() => {
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

exports.transferArquicoins = function (id, amount, toId) {
  return new Promise((resolve, reject) => {
    if (!utils.isInteger(amount)) {
      return reject(`Cannot decrease arquicoins by ${amount}. Invalid input`);
    }

    User.findById(id).then((fromUser) => {
      if (fromUser.arquicoins < amount) {
        return reject('not enough money');
      }
      User.findById(toId).then((toUser) => {
        User.changeArquicoins(fromUser.id, -amount).then((user) => {
          User.changeArquicoins(toUser.id, amount).then(() => {
            resolve(user);
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
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
