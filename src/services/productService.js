const {
  Product,
  Category,
  Shop,
  ProductReview,
  ProductVariant,
  ProductImage,
} = require("../models");
const { Op } = require("sequelize");
const { fn, col, literal } = require("sequelize");

class ProductService {
  async deleteProductImage(image_id, userId) {
    try {
      // Tìm hình ảnh theo ID
      const productImage = await ProductImage.findByPk(image_id);

      if (!productImage) {
        return {
          success: false,
          message: "Không tìm thấy hình ảnh sản phẩm",
          data: null,
        };
      }

      // Tìm sản phẩm liên quan đến hình ảnh
      const product = await Product.findByPk(productImage.product_id);

      if (!product) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm liên quan đến hình ảnh này",
          data: null,
        };
      }

      // Kiểm tra quyền truy cập
      const shop = await Shop.findOne({ where: { owner_id: userId } });
      if (!shop || product.shop_id !== shop.shop_id) {
        return {
          success: false,
          message: "Bạn không có quyền xóa hình ảnh của sản phẩm này",
          data: null,
        };
      }

      // Lưu lại URL hình ảnh để có thể xóa khỏi Cloudinary sau này
      const imageUrl = productImage.image_url;

      // Xóa hình ảnh khỏi cơ sở dữ liệu
      await productImage.destroy();

      // Nếu cần, thêm mã để xóa hình ảnh khỏi Cloudinary ở đây
      // Yêu cầu thêm công cụ từ Cloudinary API

      return {
        success: true,
        message: "Hình ảnh sản phẩm đã được xóa thành công",
        data: null,
      };
    } catch (error) {
      console.error("Error in deleteProductImage service:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi xóa hình ảnh sản phẩm",
        error: error.message,
      };
    }
  }

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

  async createProduct(productData) {
    try {
      const {
        productName,
        description,
        price,
        stock,
        category,
        shopId,
        userId,
        primaryImage,
        additionalImages,
        variationImages,
        variations,
        parcelSize,
        shippingOptions,
        weight,
        preOrder,
        condition,
        parentSKU,
        status = "active",
      } = productData;

      // Xác minh danh mục
      const categoryObj = await Category.findByPk(category);
      if (!categoryObj) {
        throw new Error("Danh mục không tồn tại");
      }

      // Xác minh shop
      const shop = await Shop.findByPk(shopId);
      if (!shop || shop.owner_id !== userId) {
        throw new Error("Shop không tồn tại hoặc bạn không có quyền truy cập");
      }

      // Parse JSON strings if needed
      let parsedParcelSize = parcelSize;
      if (typeof parcelSize === "string") {
        parsedParcelSize = JSON.parse(parcelSize);
      }

      let parsedShippingOptions = shippingOptions;
      if (typeof shippingOptions === "string") {
        parsedShippingOptions = JSON.parse(shippingOptions);
      }

      // Tạo sản phẩm mới
      const newProduct = await Product.create({
        product_name: productName,
        description,
        base_price: parseFloat(price),
        stock: parseInt(stock, 10),
        category_id: category,
        shop_id: shopId,
        status,
        weight: parseFloat(weight) || 0.3,
        dimensions: parsedParcelSize ? JSON.stringify(parsedParcelSize) : null,
        shipping_options: parsedShippingOptions
          ? JSON.stringify(parsedShippingOptions)
          : null,
        pre_order: preOrder || "No",
        condition: condition || "New",
        parent_sku: parentSKU || null,
      });

      // Upload và lưu ảnh chính
      let primaryImageUrl = null;
      if (primaryImage) {
        // Thực hiện upload lên cloud storage (ví dụ Cloudinary)
        // Giả định có function để upload
        // primaryImageUrl = await uploadToCloudinary(primaryImage.path);

        // Tạm thời sử dụng đường dẫn local cho demo
        primaryImageUrl = `/uploads/products/${primaryImage.filename}`;

        // Lưu thông tin ảnh vào database
        await ProductImage.create({
          product_id: newProduct.product_id,
          image_url: primaryImageUrl,
          is_primary: true,
        });
      }

      // Upload và lưu ảnh phụ
      if (additionalImages && additionalImages.length > 0) {
        for (const image of additionalImages) {
          // Thực hiện upload lên cloud storage
          // const imageUrl = await uploadToCloudinary(image.path);

          // Tạm thời sử dụng đường dẫn local
          const imageUrl = `/uploads/products/${image.filename}`;

          // Lưu thông tin ảnh vào database
          await ProductImage.create({
            product_id: newProduct.product_id,
            image_url: imageUrl,
            is_primary: false,
          });
        }
      }

      // Xử lý biến thể nếu có
      if (variations && variations.length > 0) {
        for (const variant of variations) {
          // Xử lý ảnh biến thể nếu có
          let variantImageUrl = null;
          if (variationImages && variationImages[variant.id]) {
            const variantImage = variationImages[variant.id];
            // variantImageUrl = await uploadToCloudinary(variantImage.path);

            // Tạm thời sử dụng đường dẫn local
            variantImageUrl = `/uploads/products/variants/${variantImage.filename}`;
          }

          // Tạo biến thể trong database
          await ProductVariant.create({
            product_id: newProduct.product_id,
            size: variant.size || null,
            color: variant.color || variant.option || null,
            material: variant.material || null,
            storage: variant.storage || null,
            ram: variant.ram || null,
            processor: variant.processor || null,
            weight: variant.weight || weight || 0.3,
            price: parseFloat(variant.price) || parseFloat(price),
            stock: parseInt(variant.stock, 10) || parseInt(stock, 10),
            sku:
              variant.sku ||
              `${parentSKU || "P"}-${Date.now()}-${Math.floor(
                Math.random() * 1000
              )}`,
            image_url: variantImageUrl,
          });
        }
      } else {
        // Nếu không có biến thể, tạo một biến thể mặc định
        await ProductVariant.create({
          product_id: newProduct.product_id,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          sku: `${parentSKU || "P"}-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`,
          image_url: primaryImageUrl,
        });
      }

      // Trả về sản phẩm đã tạo
      return {
        success: true,
        product_id: newProduct.product_id,
        product_name: newProduct.product_name,
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
}

module.exports = new ProductService();
