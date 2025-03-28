const { Product, ProductImage, Category, Shop, ProductReview } = require('../models');
const { Op } = require('sequelize');

class ProductService {
    async getAllProducts() {
        return await Product.findAll({
            where: { is_active: true },
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Category,
                    as: 'Category'
                }
            ]
        });
    }

    async getProductById(product_id) {
        return await Product.findByPk(product_id, {
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Category,
                    as: 'Category'
                }
            ]
        });
    }

    async searchProducts(q, category_id, min_price, max_price, sort) {
        const where = { is_active: true };
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
                case 'price_asc':
                    order.push(['price', 'ASC']);
                    break;
                case 'price_desc':
                    order.push(['price', 'DESC']);
                    break;
                case 'newest':
                    order.push(['created_at', 'DESC']);
                    break;
                case 'rating':
                    order.push(['average_rating', 'DESC']);
                    break;
            }
        }

        return await Product.findAll({
            where,
            order,
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Category,
                    as: 'Category'
                }
            ]
        });
    }

    async getFeaturedProducts() {
        return await Product.findAll({
            where: { is_active: true },
            order: [['average_rating', 'DESC']],
            limit: 10,
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Category,
                    as: 'Category'
                }
            ]
        });
    }

    async getNewArrivals() {
        return await Product.findAll({
            where: { is_active: true },
            order: [['created_at', 'DESC']],
            limit: 10,
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Category,
                    as: 'Category'
                }
            ]
        });
    }

    async getBestDeals() {
        return await Product.findAll({
            where: {
                is_active: true,
                discount: { [Op.gt]: 0 }
            },
            order: [['discount', 'DESC']],
            limit: 10,
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Category,
                    as: 'Category'
                }
            ]
        });
    }

    async advancedSearch(keyword, category_id, min_price, max_price, rating, sort) {
        const where = { is_active: true };
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
                case 'price_asc':
                    order.push(['price', 'ASC']);
                    break;
                case 'price_desc':
                    order.push(['price', 'DESC']);
                    break;
                case 'newest':
                    order.push(['created_at', 'DESC']);
                    break;
                case 'rating':
                    order.push(['average_rating', 'DESC']);
                    break;
            }
        }

        return await Product.findAll({
            where,
            order,
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: Category,
                    as: 'Category'
                }
            ]
        });
    }
}

module.exports = new ProductService(); 