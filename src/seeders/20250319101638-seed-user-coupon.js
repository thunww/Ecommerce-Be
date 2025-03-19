module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("User_Coupons", [
      {
        user_coupon_id: 1,
        user_id: 1,
        coupon_id: 3,
        used_at: new Date("2025-03-10T12:00:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 2,
        user_id: 2,
        coupon_id: 1,
        used_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 3,
        user_id: 3,
        coupon_id: 5,
        used_at: new Date("2025-03-15T14:30:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 4,
        user_id: 4,
        coupon_id: 2,
        used_at: new Date("2025-03-16T10:45:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 5,
        user_id: 5,
        coupon_id: 4,
        used_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 6,
        user_id: 6,
        coupon_id: 1,
        used_at: new Date("2025-03-18T18:15:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 7,
        user_id: 7,
        coupon_id: 3,
        used_at: new Date("2025-03-19T09:00:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 8,
        user_id: 8,
        coupon_id: 2,
        used_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 9,
        user_id: 9,
        coupon_id: 5,
        used_at: new Date("2025-03-20T11:20:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_coupon_id: 10,
        user_id: 10,
        coupon_id: 4,
        used_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("User_Coupons", null, {});
  },
};
