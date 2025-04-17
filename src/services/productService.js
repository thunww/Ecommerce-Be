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
    // console.log("ProductImage.create được gọi nhưng model không tồn tại:", data);
    return null;
  },
  findByPk: (id) => {
    // console.log("ProductImage.findByPk được gọi nhưng model không tồn tại:", id);
    return null;
  },
  destroy: () => {
    // console.log("ProductImage.destroy được gọi nhưng model không tồn tại");
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
        // console.log("Không thể tạo transaction, tiếp tục không có transaction:", err.message);
        transaction = null;
      }

      const {
        productName,
        description,
        price,
        stock,
        category,
        shopId,
        userId = 1, // Cung cấp giá trị mặc định để tránh lỗi trong môi trường phát triển
        primaryImage,
        additionalImages,
        variationImages,
        variations,
        parcelSize,
        weight,
        status = "active",
      } = productData;

      // console.log("Dữ liệu sản phẩm nhận được:", JSON.stringify(productData, null, 2));

      // Sử dụng ID người dùng mặc định cho môi trường phát triển nếu không có
      const effectiveUserId = userId || 1; // Dùng ID 1 nếu không có userId (chỉ dùng trong môi trường DEV)
      // console.log("Xử lý tạo sản phẩm cho userId:", effectiveUserId);

      // Xác minh danh mục
      let category_id = null; // Mặc định null để tránh gán giá trị không hợp lệ
      try {
        // Nếu category là một chuỗi (tên danh mục) thay vì ID
        if (typeof category === "string" && isNaN(parseInt(category))) {
          // console.log(`Đang tìm danh mục theo tên: "${category}"`);
          // Tìm kiếm category theo tên chính xác (không dùng LIKE mà dùng so khớp chính xác)
          const categoryByName = await Category.findOne({
            where: {
              category_name: category,
            },
          });

          if (categoryByName) {
            category_id = categoryByName.category_id;
            // console.log(`Đã tìm thấy danh mục: ${categoryByName.category_name} với ID: ${category_id}`);
          } else {
            // console.log(`Không tìm thấy danh mục chính xác với tên "${category}", thử tìm tương đối`);
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
              // console.log(`Đã tìm thấy danh mục tương đối: ${categoryByLikeName.category_name} với ID: ${category_id}`);
            } else {
              // Lấy danh sách tất cả danh mục để debug
              // console.log(`Không tìm thấy danh mục với tên tương đối "${category}", hiển thị tất cả danh mục`);
              const allCategories = await Category.findAll({
                attributes: ["category_id", "category_name"],
              });
              // console.log(`Danh sách tất cả danh mục:`, allCategories.map((c) => `${c.category_id}: ${c.category_name}`));

              // Gán một category_id mặc định (3 = Computers) nếu không tìm thấy
              category_id = 3; // Gán ID mặc định cho danh mục Computers
              // console.log(`Sử dụng ID danh mục mặc định: ${category_id}`);
            }
          }
        } else {
          // Tìm kiếm theo ID như trước
          const categoryId = parseInt(category) || 0;
          // console.log(`Tìm danh mục theo ID: ${categoryId}`);

          if (categoryId > 0) {
            const categoryObj = await Category.findByPk(categoryId);
            if (categoryObj) {
              category_id = categoryObj.category_id;
              // console.log(`Đã tìm thấy danh mục theo ID: ${category_id} (${categoryObj.category_name})`);
            } else {
              // console.log(`Danh mục với ID ${categoryId} không tồn tại, sử dụng ID mặc định 3 (Computers)`);
              category_id = 3; // Gán ID mặc định cho danh mục
            }
          } else {
            // console.log(`ID danh mục không hợp lệ: ${category}, sử dụng ID mặc định 3 (Computers)`);
            category_id = 3; // Gán ID mặc định cho danh mục
          }
        }
      } catch (error) {
        // console.log("Lỗi khi kiểm tra danh mục:", error.message);
        // Sử dụng danh mục mặc định trong trường hợp lỗi
        category_id = 3; // Gán ID mặc định cho danh mục Computers
        // console.log(`Đã xảy ra lỗi, sử dụng ID danh mục mặc định: ${category_id}`);
      }

      // Đảm bảo category_id luôn là một số nguyên hợp lệ
      if (!category_id || isNaN(category_id)) {
        category_id = 3; // Gán ID mặc định cho danh mục Computers
        // console.log(`category_id không hợp lệ, sử dụng giá trị mặc định: ${category_id}`);
      }

      // console.log(`FINAL: Sử dụng category_id = ${category_id} cho sản phẩm`);

      // Xác minh shop - Tìm shop dựa vào userId nếu không có shopId
      let shop = null;
      let shop_id = null;

      // Trường hợp 1: Có shopId cụ thể
      if (shopId) {
        shop = await Shop.findByPk(shopId);
        // Không cần kiểm tra owner_id nếu đang ở chế độ phát triển
        if (shop) {
          shop_id = shop.shop_id;
        }
      }

      // Trường hợp 2: Không có shopId, tìm shop dựa vào userId
      if (!shop_id) {
        shop = await Shop.findOne({
          where: { owner_id: effectiveUserId },
        });
        if (shop) {
          shop_id = shop.shop_id;
        }
      }

      // Trường hợp 3: Vẫn không tìm thấy shop, lấy shop đầu tiên trong DB (chỉ cho môi trường phát triển)
      if (!shop) {
        shop = await Shop.findOne();
        if (shop) {
          shop_id = shop.shop_id;
          // console.log(`Sử dụng shop_id = ${shop_id} mặc định vì không tìm thấy shop cho user`);
        } else {
          throw new Error(
            `Không tìm thấy shop nào trong hệ thống. Vui lòng tạo shop trước khi thêm sản phẩm.`
          );
        }
      }

      // Parse JSON strings if needed
      let parsedParcelSize = parcelSize;
      if (typeof parcelSize === "string") {
        try {
          parsedParcelSize = JSON.parse(parcelSize);
        } catch (e) {
          // console.log("Lỗi parse parcelSize:", e.message);
          parsedParcelSize = null;
        }
      }

      // console.log("parsedParcelSize nhận được:", parsedParcelSize);

      // Xử lý ảnh chính - sẽ chỉ lưu vào biến thể sản phẩm, không lưu vào bảng products
      let primaryImageUrl = null;
      try {
        if (primaryImage && primaryImage.filename) {
          // Tạm thời sử dụng đường dẫn local cho demo
          primaryImageUrl = `/uploads/products/${primaryImage.filename}`;
        } else if (productData.images && productData.images.length > 0) {
          // Sử dụng URL ảnh từ mảng images nếu không có primaryImage
          primaryImageUrl = productData.images[0];
        }
      } catch (error) {
        // console.error("Lỗi khi xử lý ảnh chính:", error);
      }

      // console.log("Tạo sản phẩm với shop_id:", shop_id);

      // Chuẩn bị dữ liệu theo cấu trúc bảng thực tế
      const weight_safe = parseFloat(weight) || 0.3;

      // Chuyển đổi parcelSize từ object sang chuỗi định dạng "width x height x length cm"
      // Đặt giá trị mặc định nếu không có
      let dimensions_safe = null;
      if (parsedParcelSize) {
        const width = parsedParcelSize.width || 0;
        const height = parsedParcelSize.height || 0;
        const length = parsedParcelSize.length || 0;
        dimensions_safe = `${width} x ${height} x ${length} cm`;
      } else {
        // Giá trị mặc định để đảm bảo không null
        dimensions_safe = "20 x 10 x 5 cm";
      }

      // console.log("Dimensions được lưu:", dimensions_safe);

      // Lưu ý: Trường `discount` trong DB có định dạng DECIMAL(5,2), tối đa là 999.99
      // Nếu muốn lưu giá tiền, cần chuyển đổi sang cơ chế khác hoặc sử dụng giá trị mặc định
      // Ví dụ: 0.00 nghĩa là không giảm giá

      // Tạo sản phẩm sử dụng Sequelize model để tránh lỗi SQL
      const options = transaction ? { transaction } : {};

      const newProduct = await Product.create(
        {
          product_name: productName || "Sản phẩm mới",
          description: description || "",
          discount: 0.0, // Sử dụng giá trị mặc định 0 cho discount thay vì lưu giá sản phẩm
          stock: parseInt(stock, 10) || 0,
          sold: 0,
          weight: weight_safe,
          dimensions: dimensions_safe, // Đảm bảo dimensions có định dạng đúng
          status: status,
          average_rating: 0,
          review_count: 0,
          shop_id: shop_id,
          category_id: category_id, // Đảm bảo category_id được truyền đúng, không để null
        },
        options
      );

      // Kiểm tra xem sản phẩm đã được lưu với dimensions và category_id chưa
      // console.log("Sản phẩm được tạo:", {
      //   id: newProduct.product_id,
      //   name: newProduct.product_name,
      //   dimensions: newProduct.dimensions,
      //   category_id: newProduct.category_id,
      // });

      // SQL để tạo sản phẩm mới nếu model Product không hoạt động
      // Đây là giải pháp dự phòng
      if (!newProduct || !newProduct.product_id) {
        // console.log("Không thể tạo sản phẩm bằng model Product, chuyển sang SQL");
        const productName_safe = productName
          ? productName.replace(/'/g, "''")
          : "Sản phẩm mới";
        const description_safe = description
          ? description.replace(/'/g, "''")
          : "";
        const dimensions_sql_safe = dimensions_safe
          ? dimensions_safe.replace(/'/g, "''")
          : "";

        let insertProductSQL = `
          INSERT INTO products (
            \`product_name\`, \`description\`, \`discount\`, \`stock\`, \`sold\`,
            \`category_id\`, \`shop_id\`, \`status\`, \`weight\`, 
            \`dimensions\`, \`average_rating\`, \`review_count\`
          ) VALUES (
            '${productName_safe}', '${description_safe}', 0.00, ${
          parseInt(stock, 10) || 0
        }, 0,
            ${category_id || 3}, ${shop_id}, '${status}', ${weight_safe},
            '${dimensions_sql_safe}', 0, 0
          )
        `;

        // console.log("SQL INSERT Products:", insertProductSQL);
        const queryOptions = transaction ? { transaction } : {};
        const [productResult] = await sequelize.query(
          insertProductSQL,
          queryOptions
        );
        // console.log("Kết quả tạo sản phẩm SQL:", productResult);
        newProduct = { product_id: productResult, product_name: productName };
      }

      // Xử lý biến thể nếu có
      try {
        if (variations && variations.length > 0) {
          // THÊM VÀO: Xóa tất cả biến thể cũ của sản phẩm trước khi tạo mới
          // console.log(`Xóa tất cả biến thể cũ của sản phẩm ${newProduct.product_id} trước khi tạo mới`);
          const deleteExistingVariantsSQL = `
            DELETE FROM product_variants 
            WHERE product_id = ${newProduct.product_id}
          `;

          const queryOptionsDelete = transaction ? { transaction } : {};
          await sequelize.query(deleteExistingVariantsSQL, queryOptionsDelete);
          // console.log("Đã xóa biến thể cũ");

          // Lọc variations hợp lệ trước khi thêm vào database
          const validVariations = variations.filter((variant) => {
            // Kiểm tra giá và stock có hợp lệ không
            const hasValidPrice =
              variant.price &&
              !isNaN(parseFloat(variant.price)) &&
              parseFloat(variant.price) > 0;
            const hasValidStock =
              variant.stock && !isNaN(parseInt(variant.stock, 10));
            return hasValidPrice && hasValidStock;
          });

          // console.log(`Số lượng variations hợp lệ: ${validVariations.length}/${variations.length}`);

          // Dùng validVariations thay vì variations
          for (const variant of validVariations) {
            // Xử lý ảnh biến thể nếu có
            let variantImageUrl = variant.image_url || null;

            if (
              !variantImageUrl &&
              variationImages &&
              variationImages[variant.id] &&
              variationImages[variant.id].filename
            ) {
              // Tạm thời sử dụng đường dẫn local
              variantImageUrl = `/uploads/products/variants/${
                variationImages[variant.id].filename
              }`;
            } else if (!variantImageUrl) {
              // Sử dụng ảnh chính nếu không có ảnh biến thể
              variantImageUrl = primaryImageUrl;
            }

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
            // Bỏ trường created_at và updated_at, để MySQL tự quản lý
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
          // THÊM VÀO: Xóa biến thể cũ trước khi tạo biến thể mặc định
          // console.log(`Xóa tất cả biến thể cũ của sản phẩm ${newProduct.product_id} trước khi tạo mặc định`);
          const deleteExistingVariantsSQL = `
            DELETE FROM product_variants 
            WHERE product_id = ${newProduct.product_id}
          `;

          const queryOptionsDelete = transaction ? { transaction } : {};
          await sequelize.query(deleteExistingVariantsSQL, queryOptionsDelete);
          // console.log("Đã xóa biến thể cũ");

          const defaultImageUrl_safe = primaryImageUrl
            ? primaryImageUrl.replace(/'/g, "''")
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
        // console.error("Lỗi khi xử lý biến thể sản phẩm:", error);
        throw error;
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
        },
      };
    } catch (error) {
      // Rollback nếu có lỗi và transaction tồn tại
      if (transaction) await transaction.rollback();
      // console.error("Error creating product:", error);
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
      // console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      return [];
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
