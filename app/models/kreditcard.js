const Table = require('./table'); // eslint-disabled-this-line no-unused-vars


class KreditCards extends Table {


  constructor() {
    const table_name = 'kreditcards';
    super(table_name);
  }
}

const instance = new KreditCards();


module.exports = instance;
