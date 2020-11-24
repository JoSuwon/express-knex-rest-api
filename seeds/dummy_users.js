
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {phone: '010-0000-0000', password: '0000', companyId: 18, point: 100000, hasPassword: true},
        {phone: '010-4417-3371', companyId: 18, point: 0, hasPassword: false},
      ]);
    });
};
