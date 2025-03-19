module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Shipments", [
      {
        shipment_id: 1,
        sub_order_id: 1,
        shipper_id: 5,
        tracking_number: "TRK123456",
        status: "waiting",
        estimated_delivery_date: new Date("2025-03-25"),
        actual_delivery_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        shipment_id: 2,
        sub_order_id: 2,
        shipper_id: 5,
        tracking_number: "TRK123457",
        status: "in_transit",
        estimated_delivery_date: new Date("2025-03-26"),
        actual_delivery_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        shipment_id: 3,
        sub_order_id: 3,
        shipper_id: 12,
        tracking_number: "TRK123458",
        status: "delivered",
        estimated_delivery_date: new Date("2025-03-24"),
        actual_delivery_date: new Date("2025-03-24"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        shipment_id: 4,
        sub_order_id: 4,
        shipper_id: 5,
        tracking_number: "TRK123459",
        status: "failed",
        estimated_delivery_date: new Date("2025-03-27"),
        actual_delivery_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        shipment_id: 5,
        sub_order_id: 5,
        shipper_id: 12,
        tracking_number: "TRK123460",
        status: "in_transit",
        estimated_delivery_date: new Date("2025-03-28"),
        actual_delivery_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Thêm dữ liệu cố định khác nếu cần...
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Shipments", null, {});
  },
};
