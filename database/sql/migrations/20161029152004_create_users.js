exports.up = function (knex, Promise) {
  return Promise.join(knex.schema.createTable('users', (table) => {
    table.increments();
    table.text('username').notNullable().unique();
    table.date('birthday');
    table.text('address');
    table.text('password').notNullable();
    table.text('bloodtype');
    table.integer('arquicoins').defaultTo(0);
    table.timestamps();
  }));
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
