const {
  Product,
  Category,
  Shop,
  ProductReview,
  ProductVariant,
} = require("../models");
const { Op } = require("sequelize");
const { fn, col, literal } = require("sequelize");
const sequelize = require("../config/database");
const { Sequelize } = require("sequelize");

// Tạm tạo đối tượng ProductImage giả để ngăn lỗi từ code đang tham chiếu đến nó
const ProductImage = {
  create: (data) => {
    return null;
  },
  findByPk: (id) => {
    return null;
  },
  destroy: () => {
    return null;
  },
};

class ProductService {
  // tạo sản phẩm
  async createProduct(productData) {
    let transaction;

    try {
      // Thử tạo transaction với try-catch để bắt lỗi
      try {
        transaction = await sequelize.transaction();
      } catch (err) {
        transaction = null;
      }

      const {
        productName,
        description,
        price,
        stock,
        category,
        userId,
        primaryImageUrl,
        images = [],
        variations,
        parcelSize,
        weight,
        status = "pending",
      } = productData;

      // Đảm bảo userId tồn tại
      if (!userId) {
        throw new Error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
      }

      // Tìm shop dựa vào userId từ token
      let shop = null;
      let shop_id = null;

      // Tìm shop dựa trên owner_id = userId
      shop = await Shop.findOne({
        where: { owner_id: userId },
      });

      if (shop) {
        shop_id = shop.shop_id;
      } else {
        throw new Error(
          `Không tìm thấy shop nào thuộc người dùng với ID ${userId}. Vui lòng tạo shop trước khi thêm sản phẩm.`
        );
      }

      // Kiểm tra tên sản phẩm đã tồn tại trong shop chưa
      const existingProduct = await Product.findOne({
        where: {
          product_name: productName,
          shop_id: shop_id,
        },
      });

      if (existingProduct) {
        throw new Error(
          `Sản phẩm có tên "${productName}" đã tồn tại trong shop của bạn. Vui lòng chọn tên khác.`
        );
      }

      // Xác minh danh mục
      let category_id = null; // Mặc định null để tránh gán giá trị không hợp lệ
      try {
        // Nếu category là một chuỗi (tên danh mục) thay vì ID
        if (typeof category === "string" && isNaN(parseInt(category))) {
          const categoryByName = await Category.findOne({
            where: {
              category_name: category,
            },
          });

          if (categoryByName) {
            category_id = categoryByName.category_id;
          } else {
            // Tìm kiếm tương đối nếu không tìm thấy chính xác
            const categoryByLikeName = await Category.findOne({
              where: {
                category_name: {
                  [Op.like]: `%${category}%`,
                },
              },
            });

            if (categoryByLikeName) {
              category_id = categoryByLikeName.category_id;
            } else {
              // Báo lỗi nếu không tìm thấy danh mục
              throw new Error(
                `Không tìm thấy danh mục "${category}". Vui lòng chọn danh mục khác.`
              );
            }
          }
        } else {
          // Tìm kiếm theo ID
          const categoryId = parseInt(category) || 0;

          if (categoryId > 0) {
            const categoryObj = await Category.findByPk(categoryId);
            if (categoryObj) {
              category_id = categoryObj.category_id;
            } else {
              throw new Error(
                `Danh mục với ID ${categoryId} không tồn tại. Vui lòng chọn danh mục khác.`
              );
            }
          } else {
            throw new Error(
              `ID danh mục không hợp lệ: ${category}. Vui lòng chọn danh mục hợp lệ.`
            );
          }
        }
      } catch (error) {
        throw new Error(`Lỗi khi kiểm tra danh mục: ${error.message}`);
      }

      // Parse JSON strings if needed
      let parsedParcelSize = parcelSize;
      if (typeof parcelSize === "string") {
        try {
          parsedParcelSize = JSON.parse(parcelSize);
        } catch (e) {
          throw new Error(`Lỗi định dạng parcelSize: ${e.message}`);
        }
      }

      // Xử lý ảnh chính
      let mainImageUrl = null;
      try {
        if (primaryImageUrl) {
          // Sử dụng URL từ Cloudinary
          mainImageUrl = primaryImageUrl;
        } else if (images && images.length > 0) {
          // Sử dụng URL ảnh từ mảng images nếu không có primaryImageUrl
          mainImageUrl = images[0];
        }
      } catch (error) {
        throw new Error(`Lỗi khi xử lý ảnh sản phẩm: ${error.message}`);
      }

      // Chuẩn bị dữ liệu theo cấu trúc bảng thực tế
      const weight_safe = parseFloat(weight) || 0.3;

      // Chuyển đổi parcelSize từ object sang chuỗi định dạng
      let dimensions_safe = null;
      if (parsedParcelSize) {
        const width = parsedParcelSize.width || 0;
        const height = parsedParcelSize.height || 0;
        const length = parsedParcelSize.length || 0;
        dimensions_safe = `${width} x ${height} x ${length} cm`;
      } else {
        dimensions_safe = "20 x 10 x 5 cm";
      }

      // Tạo sản phẩm sử dụng Sequelize model
      const options = transaction ? { transaction } : {};

      const newProduct = await Product.create(
        {
          product_name: productName || "Sản phẩm mới",
          description: description || "",
          discount: 0.0, // Sử dụng giá trị mặc định 0 cho discount
          stock: parseInt(stock, 10) || 0,
          sold: 0,
          weight: weight_safe,
          dimensions: dimensions_safe, // Đảm bảo dimensions có định dạng đúng
          status: status,
          average_rating: 0,
          review_count: 0,
          shop_id: shop_id,
          category_id: category_id,
          image_url: mainImageUrl, // Thêm URL ảnh chính
        },
        options
      );

      // Xử lý biến thể nếu có
      try {
        // Đảm bảo variations là một mảng
        const variationsArray = Array.isArray(variations) ? variations : [];

        if (variationsArray.length > 0) {
          // Xóa tất cả biến thể cũ của sản phẩm trước khi tạo mới
          const deleteExistingVariantsSQL = `
            DELETE FROM product_variants 
            WHERE product_id = ${newProduct.product_id}
          `;

          const queryOptionsDelete = transaction ? { transaction } : {};
          await sequelize.query(deleteExistingVariantsSQL, queryOptionsDelete);

          // Lọc variations hợp lệ trước khi thêm vào database
          const validVariations = variationsArray.filter((variant) => {
            // Kiểm tra giá và stock có hợp lệ không
            const hasValidPrice =
              variant.price &&
              !isNaN(parseFloat(variant.price)) &&
              parseFloat(variant.price) > 0;
            const hasValidStock =
              variant.stock && !isNaN(parseInt(variant.stock, 10));
            return hasValidPrice && hasValidStock;
          });

          console.log(
            `Số lượng biến thể hợp lệ: ${validVariations.length}/${variationsArray.length}`
          );

          // Dùng validVariations thay vì variations
          for (const variant of validVariations) {
            // Sử dụng ảnh từ variant nếu có, nếu không dùng ảnh chính của sản phẩm
            let variantImageUrl = variant.image_url || mainImageUrl;

            // Chuẩn bị dữ liệu an toàn cho biến thể
            const variantSize = variant.size
              ? variant.size.replace(/'/g, "''")
              : null;
            const variantColor =
              variant.color || variant.option
                ? (variant.color || variant.option).replace(/'/g, "''")
                : null;
            const variantMaterial = variant.material
              ? variant.material.replace(/'/g, "''")
              : null;
            const variantStorage = variant.storage
              ? variant.storage.replace(/'/g, "''")
              : null;
            const variantRam = variant.ram
              ? variant.ram.replace(/'/g, "''")
              : null;
            const variantProcessor = variant.processor
              ? variant.processor.replace(/'/g, "''")
              : null;
            const variantWeight =
              parseFloat(variant.weight) || parseFloat(weight) || 0.3;
            const variantPrice =
              parseFloat(variant.price) || parseFloat(price) || 0;
            const variantStock =
              parseInt(variant.stock, 10) || parseInt(stock, 10) || 0;
            const variantImageUrl_safe = variantImageUrl
              ? variantImageUrl.replace(/'/g, "''")
              : null;

            // Sử dụng SQL trực tiếp để tạo biến thể
            let insertVariantSQL = `
              INSERT INTO product_variants (
                product_id, size, color, material, 
                storage, ram, processor, weight, 
                price, stock, image_url
              ) VALUES (
                ${newProduct.product_id}, 
                ${variantSize ? `'${variantSize}'` : "NULL"}, 
                ${variantColor ? `'${variantColor}'` : "NULL"}, 
                ${variantMaterial ? `'${variantMaterial}'` : "NULL"},
                ${variantStorage ? `'${variantStorage}'` : "NULL"}, 
                ${variantRam ? `'${variantRam}'` : "NULL"}, 
                ${variantProcessor ? `'${variantProcessor}'` : "NULL"}, 
                ${variantWeight},
                ${variantPrice}, ${variantStock}, 
                ${variantImageUrl_safe ? `'${variantImageUrl_safe}'` : "NULL"}
              )
            `;

            const queryOptions = transaction ? { transaction } : {};
            await sequelize.query(insertVariantSQL, queryOptions);
          }
        } else {
          // Nếu không có biến thể, tạo một biến thể mặc định
          // Xóa biến thể cũ trước khi tạo biến thể mặc định
          const deleteExistingVariantsSQL = `
            DELETE FROM product_variants 
            WHERE product_id = ${newProduct.product_id}
          `;

          const queryOptionsDelete = transaction ? { transaction } : {};
          await sequelize.query(deleteExistingVariantsSQL, queryOptionsDelete);

          const defaultImageUrl_safe = mainImageUrl
            ? mainImageUrl.replace(/'/g, "''")
            : null;

          // Sử dụng SQL trực tiếp để tạo biến thể mặc định
          let insertDefaultVariantSQL = `
            INSERT INTO product_variants (
              product_id, price, stock, image_url
            ) VALUES (
              ${newProduct.product_id}, ${parseFloat(price) || 0}, ${
            parseInt(stock, 10) || 0
          }, 
              ${defaultImageUrl_safe ? `'${defaultImageUrl_safe}'` : "NULL"}
            )
          `;

          const queryOptions = transaction ? { transaction } : {};
          await sequelize.query(insertDefaultVariantSQL, queryOptions);
        }
      } catch (error) {
        console.error("Lỗi chi tiết khi xử lý biến thể:", error);
        throw new Error(`Lỗi khi xử lý biến thể sản phẩm: ${error.message}`);
      }

      // Commit transaction nếu tồn tại
      if (transaction) await transaction.commit();

      // Trả về sản phẩm đã tạo
      return {
        success: true,
        message: "Tạo sản phẩm thành công",
        data: {
          product_id: newProduct.product_id,
          product_name: newProduct.product_name,
          image_url: mainImageUrl,
        },
      };
    } catch (error) {
      // Rollback nếu có lỗi và transaction tồn tại
      if (transaction) await transaction.rollback();
      throw error; // Ném lỗi để controller bắt và xử lý
    }
  }

  async deleteProductImage(image_id, userId) {
    try {
      return {
        success: false,
        message:
          "Chức năng xóa hình ảnh sản phẩm không khả dụng vì không có bảng product_image",
        data: null,
      };
    } catch (error) {
      // console.error("Error in deleteProductImage service:", error);
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
      // console.error("Lỗi khi lấy tất cả sản phẩm:", error);
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
      // console.error("Lỗi khi lấy sản phẩm:", error);
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
      // console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin sản phẩm theo danh mục",
        data: [],
      };
    }
  }

  async searchProducts(
    q,
    category_id,
    min_price,
    max_price,
    sort,
    min_rating = 0
  ) {
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

      // Filter by min_rating
      if (min_rating && !isNaN(min_rating)) {
        where.average_rating = { [Op.gte]: Number(min_rating) };
      }

      // Xử lý lọc giá trong include
      const includeVariants = {
        model: ProductVariant,
        as: "variants",
        required: true, // Bắt buộc phải có variant để lọc theo giá
        attributes: ["variant_id", "image_url", "stock", "price"],
        where: {}, // Thêm điều kiện giá ở đây
      };

      if (min_price) {
        includeVariants.where.price = { [Op.gte]: Number(min_price) };
      }

      if (max_price) {
        includeVariants.where.price = {
          ...includeVariants.where.price,
          [Op.lte]: Number(max_price),
        };
      }

      // Xử lý sắp xếp
      const order = [];
      if (sort === "price_asc") {
        order.push([col("variants.price"), "ASC"]);
      } else if (sort === "price_desc") {
        order.push([col("variants.price"), "DESC"]);
      } else {
        order.push(["created_at", "DESC"]);
      }

      // Query products
      const products = await Product.findAll({
        where,
        order,
        subQuery: false,
        include: [
          {
            model: Category,
            as: "Category",
            attributes: ["category_id", "category_name"],
          },
          includeVariants,
        ],
      });

      // Tổng stock các variant
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
      console.error("searchProducts error:", error);
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
    try {
      return await Product.findAll({
        where: { status: "active" },
        order: [["average_rating", "DESC"]],
        limit: 10,
        include: [
          {
            model: Category,
            as: "Category",
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
      });
    } catch (error) {
      // console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
      return [];
    }
  }

  async getNewArrivals() {
    try {
      return await Product.findAll({
        where: { status: "active" },
        order: [["created_at", "DESC"]],
        limit: 10,
        include: [
          {
            model: Category,
            as: "Category",
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
      });
    } catch (error) {
      // console.error("Lỗi khi lấy sản phẩm mới:", error);
      return [];
    }
  }

  async getBestDeals() {
    try {
      return await Product.findAll({
        where: {
          status: "active",
          discount: { [Op.gt]: 0 },
        },
        order: [["discount", "DESC"]],
        limit: 10,
        include: [
          {
            model: Category,
            as: "Category",
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
      });
    } catch (error) {
      // console.error("Lỗi khi lấy sản phẩm giảm giá:", error);
      return [];
    }
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

    try {
      return await Product.findAll({
        where,
        order,
        include: [
          {
            model: Category,
            as: "Category",
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
      });
    } catch (error) {
      // console.error("Lỗi khi tìm kiếm sản phẩm nâng cao:", error);
      return [];
    }
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
      // console.error("Error in deleteProduct:", error);
      throw error;
    }
  }
}

module.exports = new ProductService();
