module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('User_Roles', [
      { user_id: 1, role_id: 1 }, // John Doe - Admin
      { user_id: 2, role_id: 2 }, // Jane Smith - Customer
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('User_Roles', null, {});
  },
};
