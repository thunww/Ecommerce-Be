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
  async createProduct(productData, userId) {
    try {
      // Lấy thông tin shop của user
      const shop = await Shop.findOne({ where: { owner_id: userId } });
      if (!shop) {
        return {
          success: false,
          message: "Không tìm thấy thông tin shop của bạn",
          data: null,
        };
      }

      console.log("Found shop:", shop.shop_id);

      // Tạo sản phẩm mới
      const newProduct = await Product.create({
        product_name: productData.product_name,
        description: productData.description,
        category_id: productData.category_id || null,
        shop_id: shop.shop_id,
        stock: productData.stock || 0,
        discount: productData.discount || 0,
        status: "pending",
        weight: productData.weight || null,
        dimensions: productData.dimensions || null,
        image_url: productData.image_url || null, // Lưu đường dẫn ảnh chính
      });

      console.log("Created product:", newProduct.product_id);

      // Lưu các ảnh phụ nếu có
      if (
        productData.additional_images &&
        Array.isArray(productData.additional_images)
      ) {
        await Promise.all(
          productData.additional_images.map(async (imagePath) => {
            await ProductImage.create({
              product_id: newProduct.product_id,
              image_url: imagePath,
              is_primary: false,
            });
          })
        );
        console.log("Added additional images");
      }

      // Xử lý biến thể sản phẩm nếu có
      if (productData.variations && Array.isArray(productData.variations)) {
        console.log("Processing variations:", productData.variations.length);

        await Promise.all(
          productData.variations.map(async (variant, index) => {
            // Nếu có ảnh cho biến thể này
            let imageUrl = null;
            if (
              productData.variation_images &&
              productData.variation_images[index]
            ) {
              imageUrl = productData.variation_images[index];
            } else if (variant.image_url) {
              imageUrl = variant.image_url;
            }

            const newVariant = await ProductVariant.create({
              product_id: newProduct.product_id,
              size: variant.size || null,
              color: variant.color || null,
              material: variant.material || null,
              storage: variant.storage || null,
              ram: variant.ram || null,
              processor: variant.processor || null,
              price: variant.price || 0,
              stock: variant.stock || 0,
              weight: variant.weight || null,
              image_url: imageUrl,
            });
            console.log("Created variant:", newVariant.variant_id);
            return newVariant;
          })
        );
      }

      return {
        success: true,
        message: "Sản phẩm đã được tạo thành công",
        data: newProduct,
      };
    } catch (error) {
      console.error("Error in createProduct service:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi tạo sản phẩm",
        error: error.message,
      };
    }
  }

  async updateProduct(product_id, productData, userId) {
    try {
      // Kiểm tra sản phẩm tồn tại hay không
      const existingProduct = await Product.findByPk(product_id);
      if (!existingProduct) {
        return {
          success: false,
          message: "Sản phẩm không tồn tại",
          data: null,
        };
      }

      // Kiểm tra quyền truy cập
      const shop = await Shop.findOne({ where: { owner_id: userId } });
      if (!shop || existingProduct.shop_id !== shop.shop_id) {
        return {
          success: false,
          message: "Bạn không có quyền cập nhật sản phẩm này",
          data: null,
        };
      }

      // Cập nhật thông tin cơ bản của sản phẩm
      await existingProduct.update({
        product_name: productData.product_name || existingProduct.product_name,
        description: productData.description || existingProduct.description,
        category_id: productData.category_id || existingProduct.category_id,
        stock: productData.stock || existingProduct.stock,
        discount: productData.discount || existingProduct.discount,
        weight: productData.weight || existingProduct.weight,
        dimensions: productData.dimensions || existingProduct.dimensions,
        image_url: productData.image_url || existingProduct.image_url,
      });

      console.log("Updated product:", product_id);

      // Xử lý ảnh phụ
      if (
        productData.additional_images &&
        Array.isArray(productData.additional_images)
      ) {
        // Xóa tất cả ảnh phụ cũ
        await ProductImage.destroy({
          where: { product_id, is_primary: false },
        });

        // Thêm ảnh phụ mới
        await Promise.all(
          productData.additional_images.map(async (imagePath) => {
            await ProductImage.create({
              product_id,
              image_url: imagePath,
              is_primary: false,
            });
          })
        );
        console.log("Updated additional images");
      }

      // Xử lý biến thể sản phẩm
      if (productData.variations && Array.isArray(productData.variations)) {
        console.log(
          "Processing updated variations:",
          productData.variations.length
        );

        // Lấy danh sách variant_id hiện tại
        const existingVariants = await ProductVariant.findAll({
          where: { product_id },
        });
        const existingVariantIds = existingVariants.map((v) => v.variant_id);

        // Mảng chứa các ID biến thể cần giữ lại
        const variantIdsToKeep = [];

        // Xử lý từng biến thể
        await Promise.all(
          productData.variations.map(async (variant, index) => {
            let imageUrl = null;
            if (
              productData.variation_images &&
              productData.variation_images[index]
            ) {
              imageUrl = productData.variation_images[index];
            } else if (variant.image_url) {
              imageUrl = variant.image_url;
            }

            // Nếu biến thể có ID, cập nhật biến thể
            if (variant.variant_id) {
              const existingVariant = await ProductVariant.findByPk(
                variant.variant_id
              );

              if (
                existingVariant &&
                existingVariant.product_id.toString() === product_id.toString()
              ) {
                await existingVariant.update({
                  size:
                    variant.size !== undefined
                      ? variant.size
                      : existingVariant.size,
                  color:
                    variant.color !== undefined
                      ? variant.color
                      : existingVariant.color,
                  material:
                    variant.material !== undefined
                      ? variant.material
                      : existingVariant.material,
                  storage:
                    variant.storage !== undefined
                      ? variant.storage
                      : existingVariant.storage,
                  ram:
                    variant.ram !== undefined
                      ? variant.ram
                      : existingVariant.ram,
                  processor:
                    variant.processor !== undefined
                      ? variant.processor
                      : existingVariant.processor,
                  price:
                    variant.price !== undefined
                      ? variant.price
                      : existingVariant.price,
                  stock:
                    variant.stock !== undefined
                      ? variant.stock
                      : existingVariant.stock,
                  weight:
                    variant.weight !== undefined
                      ? variant.weight
                      : existingVariant.weight,
                  image_url: imageUrl || existingVariant.image_url,
                });

                variantIdsToKeep.push(variant.variant_id);
                console.log("Updated variant:", variant.variant_id);
              }
            } else {
              // Nếu không có ID, tạo biến thể mới
              const newVariant = await ProductVariant.create({
                product_id,
                size: variant.size || null,
                color: variant.color || null,
                material: variant.material || null,
                storage: variant.storage || null,
                ram: variant.ram || null,
                processor: variant.processor || null,
                price: variant.price || 0,
                stock: variant.stock || 0,
                weight: variant.weight || null,
                image_url: imageUrl,
              });

              variantIdsToKeep.push(newVariant.variant_id);
              console.log("Created new variant:", newVariant.variant_id);
            }
          })
        );

        // Xóa các biến thể không còn được sử dụng
        const variantIdsToDelete = existingVariantIds.filter(
          (id) => !variantIdsToKeep.includes(id)
        );

        if (variantIdsToDelete.length > 0) {
          await ProductVariant.destroy({
            where: {
              variant_id: {
                [Op.in]: variantIdsToDelete,
              },
            },
          });
          console.log("Deleted unused variants:", variantIdsToDelete);
        }
      }

      // Lấy thông tin sản phẩm đã cập nhật
      const updatedProduct = await Product.findByPk(product_id);

      return {
        success: true,
        message: "Sản phẩm đã được cập nhật thành công",
        data: updatedProduct,
      };
    } catch (error) {
      console.error("Error in updateProduct service:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật sản phẩm",
        error: error.message,
      };
    }
  }

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
}

module.exports = new ProductService();
