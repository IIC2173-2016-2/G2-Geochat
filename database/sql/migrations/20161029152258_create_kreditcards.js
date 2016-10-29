exports.up = function (knex, Promise) {
  return Promise.join(knex.schema.createTable('kreditcards', (table) => {
    table.increments();
    table.text('number').notNullable();
    table.text('name_on_card').notNullable();
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
