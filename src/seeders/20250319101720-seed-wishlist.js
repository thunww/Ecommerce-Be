"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Wishlists", [
      {
        user_id: 1,
        product_id: 1,
        added_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        product_id: 1,
        added_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        product_id: 2,
        added_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        product_id: 2,
        added_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        product_id: 3,
        added_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        product_id: 3,
        added_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Wishlists", null, {});
  },
};
