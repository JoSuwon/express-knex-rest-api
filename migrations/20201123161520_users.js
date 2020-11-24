
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary().comment('회원 구분자');
    table.string('phone', 20).notNullable().comment('회원 휴대폰번호');
    table.string('password', 4).nullable().comment('비밀 번호');
    table.integer('companyId').notNullable().comment('회원이 가입된 업체ID');
    table.integer('point').notNullable().defaultTo(0).comment('회원 보유 포인트');
    table.boolean('hasPassword').notNullable().comment('비밀번호 존재유무');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
