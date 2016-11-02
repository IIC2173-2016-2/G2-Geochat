const utils = require('../services/utils');
const Kreditcard = require('../models/kreditcard');
const User = require('../models/user');
const requestify = require('requestify');

const API_TOKEN = '237ea5ca-3f9a-4383-9d46-793d8c5cab6f';
const COIN_COST = 1;

exports.buyArquicoins = function (user_id, card_id, amount) {
  return new Promise((resolve, reject) => {
    if (!utils.isInteger(amount)) {
      return reject(`Cannot buy ${amount}. Invalid input`);
    }

    Kreditcard.find({
      user_id,
      id: card_id,
    }).then((cards) => {
      console.log(cards);
      if (!cards || cards.length === 0) {
        reject('Card does not correspond to user');
      }

      const params = {
        application_token: API_TOKEN,
        kredit_card: {
          card_number: cards[0].number,
          card_cvv: cards[0].cvv,
          card_holder: {
            first_name: cards[0].first_name,
            last_name: cards[0].last_name,
          },
        },
        to_charge: {
          currency: 'CLP',
          amount: amount * COIN_COST,
        },
      };

      requestify.post('https://alquitran.ing.puc.cl/transactions/', params)
        .then(() => {
          User.changeArquicoins(user_id, amount).then((user) => {
            resolve(user);
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err.body.description);
        });
    }).catch((err) => {
      reject(err);
    });
  });
};

exports.transferArquicoins = function (id, amount, toId) {
  console.log('llego');
  console.log(amount);
  return new Promise((resolve, reject) => {
    if (!utils.isInteger(amount)) {
      return reject(`Cannot decrease arquicoins by ${amount}. Invalid input`);
    }
    console.log('numero valido');

    User.findById(id).then((fromUser) => {
      console.log(fromUser);
      if (parseInt(fromUser.arquicoins, 10) < parseInt(amount, 10)) {
        return reject('not enough money');
      }
      console.log(`Money of fromUser at the begin ${fromUser.arquicoins}`);

      User.findById(toId).then((toUser) => {
        User.changeArquicoins(fromUser.id, -amount).then((user) => {
          console.log(user);
          console.log(`Money of fromUser at the end ${user.arquicoins}`);
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
