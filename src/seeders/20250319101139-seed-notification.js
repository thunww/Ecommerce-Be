module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Notifications", [
      {
        notification_id: 1,
        user_id: 3,
        title: "Your order is being processed",
        message: "Order #12345 is being prepared and will be shipped soon.",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 2,
        user_id: 2,
        title: "Special discount coupon!",
        message: "You have received a 20% discount coupon for your next order.",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 3,
        user_id: 2,
        title: "Order delivered successfully",
        message: "Order #56789 has been successfully delivered. Thank you!",
        is_read: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 4,
        user_id: 7,
        title: "Your favorite product is on sale!",
        message:
          "The product you were interested in is now 30% off, don’t miss it!",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 5,
        user_id: 1,
        title: "Important update",
        message:
          "Our return policy has been updated. Please check the details.",
        is_read: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 6,
        user_id: 4,
        title: "Order confirmation",
        message: "Order #67890 has been confirmed and is now being processed.",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 7,
        user_id: 3,
        title: "Running out of stock!",
        message:
          "The product you recently viewed is almost out of stock. Order now before it's gone!",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 8,
        user_id: 6,
        title: "Your birthday gift!",
        message: "Happy Birthday! You have received a special gift from us!",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 9,
        user_id: 8,
        title: "Review your order",
        message:
          "Leave a review for your order and get a special discount on your next purchase!",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        notification_id: 10,
        user_id: 5,
        title: "Exclusive offer just for you",
        message:
          "An exclusive discount code is waiting for you! Use it now and save big.",
        is_read: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Notifications", null, {});
  },
};
