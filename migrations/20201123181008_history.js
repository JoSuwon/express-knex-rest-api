
exports.up = function(knex) {
  return knex.schema.createTable('history', table => {
    table.increments('id').primary().comment('기록 구분자');
    table.string('request').notNullable().defaultTo('kiosk').comment('요청기기');
    table.string('type').notNullable().comment('사용 혹은 충전');
    table.string('payMethod').notNullable().comment('결제 및 지급 수단');
    table.integer('companyId').notNullable().comment('업체 인덱스');
    table.integer('userId').notNullable().comment('사용자 인덱스');
    table.integer('machineId').nullable().defaultTo(null).comment('장비 아이디');
    table.integer('inputAmount').notNullable().comment('장비에 투입되고자하는 금액(없으면 0)');
    table.integer('usePoint').notNullable().comment('사용 포인트 (없으면 0)');
    table.integer('realAmount').notNullable().comment('실제 지급한 금액');
    table.integer('appendPoint').notNullable().comment('충전시 추가적립 포인트');
    table.float('eventRate').notNullable().comment('이벤트 적립률');
    table.integer('totalPoint').notNullable().comment('변동 포인트 내역');
    table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('history');
};
