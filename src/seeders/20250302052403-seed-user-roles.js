module.exports = {
  up: async (queryInterface) => {
    const userRoles = [];

    // Mặc định tất cả user đều có role Customer (role_id: 2)
    for (let userId = 1; userId <= 18; userId++) {
      userRoles.push({ user_id: userId, role_id: 2 });
    }

    // Thêm các role khác cho một số user
    userRoles.push(
      { user_id: 1, role_id: 1 }, // John Doe - Admin
      { user_id: 3, role_id: 1 }, // Admin User - Admin
      { user_id: 5, role_id: 3 }, // User 5 - Shipper
      { user_id: 6, role_id: 4 }, // User 6 - Vendor
      { user_id: 8, role_id: 3 }, // User 8 - Shipper
      { user_id: 9, role_id: 4 }, // User 9 - Vendor
      { user_id: 10, role_id: 1 }, // User 10 - Admin
      { user_id: 12, role_id: 3 }, // User 12 - Shipper
      { user_id: 13, role_id: 4 }, // User 13 - Vendor
      { user_id: 14, role_id: 1 }, // User 14 - Admin
      { user_id: 16, role_id: 3 }, // User 16 - Shipper
      { user_id: 17, role_id: 4 }, // User 17 - Vendor
      { user_id: 18, role_id: 4 }, // User 18 - Vendor
      { user_id: 7, role_id: 4 } // User 7 - Vendor
    );

    await queryInterface.bulkInsert("User_Roles", userRoles);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("User_Roles", null, {});
  },
};