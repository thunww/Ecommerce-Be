const {
  Product,
  Category,
  Shop,
  ProductReview,
  ProductVariant,
} = require("../models");
const { Op } = require("sequelize");
const { fn, col, literal } = require("sequelize");

class ProductService {
  async getAllProducts() {
    try {
      const products = await Product.findAll({
        attributes: {
          include: [
            [fn("AVG", col("reviews.rating")), "average_rating"],
            [fn("COUNT", col("reviews.review_id")), "review_count"],
          ],
        },
        include: [
          {
            model: Category,
            as: "Category",
            attributes: ["category_name"],
          },
          {
            model: ProductReview,
            as: "reviews",
            attributes: [],
          },
          {
            model: ProductVariant,
            as: "variants",
            attributes: [
              "variant_id",
              "size",
              "color",
              "material",
              "storage",
              "ram",
              "processor",
              "weight",
              "price",
              "stock",
              "image_url",
            ],
          },
        ],
        group: [
          "Product.product_id",
          "Category.category_id",
          "variants.variant_id", // Add variant_id to the GROUP BY clause
          "variants.size", // Add size to GROUP BY clause
          "variants.color", // Add color to GROUP BY clause
          "variants.material", // Add material to GROUP BY clause
          "variants.storage", // Add storage to GROUP BY clause
          "variants.ram", // Add ram to GROUP BY clause
          "variants.processor", // Add processor to GROUP BY clause
          "variants.weight", // Add weight to GROUP BY clause
          "variants.price", // Add price to GROUP BY clause
          "variants.stock", // Add stock to GROUP BY clause
          "variants.image_url", // Add image_url to GROUP BY clause
        ],
      });

      if (!products || products.length === 0) {
        return {
          success: false,
          message: "Không có sản phẩm nào tồn tại",
          data: null,
        };
      }

      const result = products.map((product) => {
        const productJson = product.toJSON();

        // Calculate total stock
        const totalStock = productJson.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0
        );

        productJson.stock = totalStock; // Add total stock to the product data

        return productJson;
      });

      return {
        success: true,
        message: "Lấy thông tin tất cả sản phẩm thành công",
        data: result,
      };
    } catch (error) {
      console.error("Lỗi khi lấy tất cả sản phẩm:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm",
        data: null,
      };
    }
  }

  async getProductById(product_id) {
    try {
      // Truy vấn đầu tiên để lấy thông tin cơ bản của sản phẩm và tính trung bình rating
      const product = await Product.findOne({
        where: { product_id },
        attributes: {
          include: [
            [fn("AVG", col("reviews.rating")), "average_rating"],
            [fn("COUNT", col("reviews.review_id")), "review_count"],
          ],
        },
        include: [
          {
            model: Category,
            as: "Category",
            attributes: ["category_name"],
          },
          {
            model: ProductReview,
            as: "reviews",
            attributes: [],
          },
        ],
        group: ["Product.product_id", "Category.category_id"],
      });

      if (!product) {
        return {
          success: false,
          message: "Sản phẩm không tồn tại",
          data: null,
        };
      }

      // Truy vấn thứ hai để lấy variants, images và tính tổng stock
      const productWithDetails = await Product.findByPk(product_id, {
        include: [
          {
            model: ProductVariant,
            as: "variants",
            attributes: [
              "variant_id",
              "size",
              "color",
              "material",
              "storage",
              "ram",
              "processor",
              "weight",
              "price",
              "stock",
              "image_url", // Lấy image_url từ ProductVariant
            ],
          },
        ],
      });

      // Tính tổng stock từ các variants
      const totalStock = productWithDetails.variants.reduce(
        (sum, variant) => sum + variant.stock,
        0
      );

      // Gộp kết quả
      const result = product.toJSON();
      result.variants = productWithDetails.variants;
      result.stock = totalStock;

      return {
        success: true,
        message: "Lấy thông tin sản phẩm thành công",
        data: result,
      };
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm",
        data: null,
      };
    }
  }
  async getProductsByCategoryId(category_id) {
    try {
      // Truy vấn đầu tiên: lấy danh sách sản phẩm theo category kèm rating trung bình
      const products = await Product.findAll({
        where: { category_id },
        attributes: {
          include: [
            [fn("AVG", col("reviews.rating")), "average_rating"],
            [fn("COUNT", col("reviews.review_id")), "review_count"],
          ],
        },
        include: [
          {
            model: Category,
            as: "Category",
            attributes: ["category_name"],
          },
          {
            model: ProductReview,
            as: "reviews",
            attributes: [],
          },
        ],
        group: ["Product.product_id", "Category.category_id"],
      });

      if (!products || products.length === 0) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm nào trong danh mục này",
          data: [],
        };
      }

      // Lặp qua từng sản phẩm để lấy thêm thông tin variants và tổng stock
      const detailedProducts = await Promise.all(
        products.map(async (product) => {
          const productWithVariants = await Product.findByPk(
            product.product_id,
            {
              include: [
                {
                  model: ProductVariant,
                  as: "variants",
                  attributes: [
                    "variant_id",
                    "size",
                    "color",
                    "material",
                    "storage",
                    "ram",
                    "processor",
                    "weight",
                    "price",
                    "stock",
                    "image_url",
                  ],
                },
              ],
            }
          );

          const totalStock = productWithVariants.variants.reduce(
            (sum, variant) => sum + variant.stock,
            0
          );

          const result = product.toJSON();
          result.variants = productWithVariants.variants;
          result.stock = totalStock;
          return result;
        })
      );

      return {
        success: true,
        message: "Lấy danh sách sản phẩm theo danh mục thành công",
        data: detailedProducts,
      };
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm theo danh mục",
        data: [],
      };
    }
  }

  async searchProducts(q, category_id, min_price, max_price, sort) {
    try {
      const where = { status: "active" };

      // Search by product name
      if (q) {
        where.product_name = { [Op.like]: `%${q.trim()}%` };
      }

      // Filter by category
      if (category_id) {
        where.category_id = Number(category_id);
      }

      // Price conditions for variants
      const priceConditions = {};
      if (min_price) priceConditions[Op.gte] = Number(min_price);
      if (max_price) priceConditions[Op.lte] = Number(max_price);
      if (Object.keys(priceConditions).length > 0) {
        where["$variants.price$"] = priceConditions;
      }

      // Sorting conditions
      const order = [];
      if (sort === "price_asc") {
        order.push([Sequelize.col("variants.price"), "ASC"]);
      } else if (sort === "price_desc") {
        order.push([Sequelize.col("variants.price"), "DESC"]);
      } else {
        order.push(["created_at", "DESC"]);
      }

      // Query products with includes
      const products = await Product.findAll({
        where,
        order,
        include: [
          {
            model: Category,
            as: "Category",
            attributes: ["category_id", "category_name"],
          },
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["variant_id", "image_url", "stock", "price"],
          },
        ],
      });

      // Calculate total stock for each product
      const updatedProducts = products.map((product) => {
        const totalStock = product.variants.reduce(
          (sum, variant) => sum + (variant.stock || 0),
          0
        );
        return {
          ...product.toJSON(),
          stock: totalStock,
        };
      });

      return {
        success: true,
        message:
          updatedProducts.length > 0
            ? "Products retrieved successfully"
            : "No products found",
        data: updatedProducts,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve products",
        data: [],
      };
    }
  }

  async searchSuggest(q, limit = 5) {
    try {
      if (!q.trim()) {
        return {
          success: true,
          message: "No keyword provided",
          data: [],
        };
      }

      const products = await Product.findAll({
        where: {
          product_name: {
            [Op.like]: `%${q.trim()}%`,
          },
          status: "active",
        },
        attributes: ["product_id", "product_name"],
        limit: parseInt(limit),
      });

      return {
        success: true,
        message:
          products.length > 0
            ? "Suggestions retrieved successfully"
            : "No matching products found",
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve suggestions",
        data: [],
      };
    }
  }
  async getFeaturedProducts() {
    return await Product.findAll({
      where: { status: "active" },
      order: [["average_rating", "DESC"]],
      limit: 10,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: Category,
          as: "Category",
        },
      ],
    });
  }

  async getNewArrivals() {
    return await Product.findAll({
      where: { status: "active" },
      order: [["created_at", "DESC"]],
      limit: 10,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: Category,
          as: "Category",
        },
      ],
    });
  }

  async getBestDeals() {
    return await Product.findAll({
      where: {
        status: "active",
        discount: { [Op.gt]: 0 },
      },
      order: [["discount", "DESC"]],
      limit: 10,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: Category,
          as: "Category",
        },
      ],
    });
  }

  async advancedSearch(
    keyword,
    category_id,
    min_price,
    max_price,
    rating,
    sort
  ) {
    const where = { status: "active" };
    if (keyword) {
      where.product_name = { [Op.like]: `%${keyword}%` };
    }
    if (category_id) {
      where.category_id = category_id;
    }
    if (min_price) {
      where.price = { [Op.gte]: min_price };
    }
    if (max_price) {
      where.price = { ...where.price, [Op.lte]: max_price };
    }
    if (rating) {
      where.average_rating = { [Op.gte]: rating };
    }

    const order = [];
    if (sort) {
      switch (sort) {
        case "price_asc":
          order.push(["price", "ASC"]);
          break;
        case "price_desc":
          order.push(["price", "DESC"]);
          break;
        case "newest":
          order.push(["created_at", "DESC"]);
          break;
        case "rating":
          order.push(["average_rating", "DESC"]);
          break;
      }
    }

    return await Product.findAll({
      where,
      order,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: Category,
          as: "Category",
        },
      ],
    });
  }

  async assignProduct(product_id, status) {
    try {
      const product = await Product.findByPk(product_id);
      if (!product) {
        throw new Error("Product not found");
      }
      product.status = status;
      await product.save();

      return {
        success: true,
        message: "Product updated successfully",
        data: product,
      };
    } catch (error) {
      throw new Error(error.message || "Internal Server Error");
    }
  }
  async deleteProduct(product_id) {
    try {
      const product = await Product.findByPk(product_id);
      if (!product) {
        throw new Error("Product not found");
      }

      await product.destroy();

      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw error;
    }
  }
}

module.exports = new ProductService();
