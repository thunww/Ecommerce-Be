module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Payments", [
      {
        payment_id: 1,
        sub_order_id: 1,
        payment_method: "cod",
        status: "pending",
        transaction_id: "TXN123456",
        amount: 200000.0,
        paid_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_id: 2,
        sub_order_id: 2,
        payment_method: "credit_card",
        status: "paid",
        transaction_id: "TXN123457",
        amount: 500000.0,
        paid_at: new Date("2025-03-18T14:30:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_id: 3,
        sub_order_id: 3,
        payment_method: "momo",
        status: "failed",
        transaction_id: "TXN123458",
        amount: 300000.0,
        paid_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_id: 4,
        sub_order_id: 4,
        payment_method: "bank_transfer",
        status: "refunded",
        transaction_id: "TXN123459",
        amount: 100000.0,
        paid_at: new Date("2025-03-15T10:15:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_id: 5,
        sub_order_id: 5,
        payment_method: "cod",
        status: "pending",
        transaction_id: "TXN123460",
        amount: 150000.0,
        paid_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Thêm dữ liệu cố định khác nếu cần...
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Payments", null, {});
  },
};
