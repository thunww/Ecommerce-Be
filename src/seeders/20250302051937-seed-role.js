module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Roles", [
      { role_id: 1, role_name: "admin" },
      { role_id: 2, role_name: "customer" },
      { role_id: 3, role_name: "shipper" },
      { role_id: 4, role_name: "vendor" },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};