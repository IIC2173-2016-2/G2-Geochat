exports.up = function (knex, Promise) {
  return Promise.join(knex.schema.createTable('kreditcards', (table) => {
    table.increments();
    table.text('number').notNullable();
    table.text('first_name').notNullable();
    table.text('last_name').notNullable();
    table.string('cvv').notNullable();
    table.text('operator').notNullable();
    table.date('expire_date').notNullable();
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.timestamps();
  }));
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('kreditcards');
};
