const {
  Product,
  ProductImage,
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
      // Truy vấn đầu tiên để lấy thông tin cơ bản của tất cả sản phẩm và tính trung bình rating
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
        ],
        group: ["Product.product_id", "Category.category_id"],
      });

      if (!products || products.length === 0) {
        return {
          success: false,
          message: "Không có sản phẩm nào tồn tại",
          data: null,
        };
      }

      // Truy vấn thứ hai để lấy variants và images cho tất cả sản phẩm
      const productsWithDetails = await Product.findAll({
        include: [
          {
            model: ProductImage,
            as: "images",
            attributes: ["image_id", "image_url"],
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
            ],
          },
        ],
      });

      // Gộp kết quả và tính tổng stock cho từng sản phẩm
      const result = products.map((product) => {
        const productDetails = productsWithDetails.find(
          (p) => p.product_id === product.product_id
        );

        // Tính tổng stock từ các variants
        const totalStock = productDetails.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0
        );

        const productJson = product.toJSON();
        productJson.images = productDetails.images;
        productJson.variants = productDetails.variants;
        productJson.stock = totalStock;

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

      // Truy vấn thứ hai để lấy variants và images
      const productWithDetails = await Product.findByPk(product_id, {
        include: [
          {
            model: ProductImage,
            as: "images",
            attributes: ["image_id", "image_url"],
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
      result.images = productWithDetails.images;
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

  async searchProducts(q, category_id, min_price, max_price, sort) {
    const where = { status: "active" };
    if (q) {
      where.product_name = { [Op.like]: `%${q}%` };
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
