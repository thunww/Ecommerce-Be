module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Shops", {
      shop_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      owner_id: { type: Sequelize.INTEGER, allowNull: false },
      shop_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: { type: Sequelize.TEXT, allowNull: true },
      logo: { type: Sequelize.STRING(255), allowNull: true },
      banner: { type: Sequelize.STRING(255), allowNull: true },
      rating: { type: Sequelize.DECIMAL(3, 2), defaultValue: 0.0 },
      followers: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_products: { type: Sequelize.INTEGER, defaultValue: 0 },
      views: { type: Sequelize.INTEGER, defaultValue: 0 },
      address: { type: Sequelize.STRING(255), allowNull: true },
      status: {
        type: Sequelize.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
    await queryInterface.addConstraint("Shops", {
      fields: ["owner_id"],
      type: "foreign key",
      name: "fk_shops_owner_id",
      references: { table: "Users", field: "user_id" },
      onDelete: "CASCADE",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Shops");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Shops_status";'
    );
  },
};
