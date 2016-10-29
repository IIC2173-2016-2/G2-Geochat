const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class KreditCards extends Table {


  constructor() {
    const table_name = 'kreditcards';
    super(table_name);
  }

  update(id, attributes) {
    return new Promise((resolve, reject) => {
      if (attributes && attributes.user_id) {
        return reject('Not authorized to change the owner of this card');
      }
      super.update(id, attributes).then((card) => {
        return resolve(card);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const instance = new KreditCards();


module.exports = instance;
