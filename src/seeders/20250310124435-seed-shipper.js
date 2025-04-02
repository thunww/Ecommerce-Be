"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Shippers", [
      {
        shipper_id: 5, // Bổ sung shipper_id
        user_id: 5,
        phone: "0987654321",
        vehicle_type: "bike",
        license_plate: "29A-12345",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        shipper_id: 2,
        user_id: 2,
        phone: "0978123456",
        vehicle_type: "car",
        license_plate: "30B-56789",
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        shipper_id: 12,
        user_id: 12,
        phone: "0968543210",
        vehicle_type: "truck",
        license_plate: "31C-98765",
        status: "inactive",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Shippers", null, {});
  },
};
