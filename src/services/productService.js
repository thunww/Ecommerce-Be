const {
  Product,
  ProductImage,
  Category,
  Shop,
  ProductReview,
} = require("../models");
const { Op } = require("sequelize");

class ProductService {
  async getAllProducts() {
    return await Product.findAll({
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
      order: [["created_at", "DESC"]],
    });
  }

  async getProductById(product_id) {
    return await Product.findByPk(product_id, {
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
