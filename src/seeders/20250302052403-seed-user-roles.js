module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("User_Roles", [
      { user_id: 1, role_id: 1 }, // John Doe - Admin
      { user_id: 2, role_id: 2 }, // Jane Smith - Customer
      { user_id: 3, role_id: 1 }, // Admin User - Admin
      { user_id: 3, role_id: 2 }, // Admin User - Customer
      { user_id: 4, role_id: 2 }, // User 4 - Customer
      { user_id: 5, role_id: 3 }, // User 5 - Shipper
      { user_id: 6, role_id: 4 }, // User 6 - Vendor
      { user_id: 7, role_id: 2 }, // User 7 - Customer
      { user_id: 8, role_id: 3 }, // User 8 - Shipper
      { user_id: 9, role_id: 4 }, // User 9 - Vendor
      { user_id: 10, role_id: 1 }, // User 10 - Admin
      { user_id: 11, role_id: 2 }, // User 11 - Customer
      { user_id: 12, role_id: 3 }, // User 12 - Shipper
      { user_id: 13, role_id: 4 }, // User 13 - Vendor
      { user_id: 14, role_id: 1 }, // User 14 - Admin
      { user_id: 15, role_id: 2 }, // User 15 - Customer
      { user_id: 16, role_id: 3 }, // User 16 - Shipper
      { user_id: 17, role_id: 4 }, // User 17 - Vendor
      { user_id: 18, role_id: 2 }, // User 18 - Customer
      { user_id: 18, role_id: 4 },
      { user_id: 7, role_id: 4 },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("User_Roles", null, {});
  },
};
