class ShippingService {
  constructor() {}

  // Tính phí vận chuyển động theo trọng lượng
  async calculateShippingFee({ order_items }) {
    try {
      // Tính tổng trọng lượng đơn hàng (gram)
      let totalWeight = 0;
      for (const item of order_items) {
        // item.product.weight là trọng lượng 1 sản phẩm (kg), cần chuyển sang gram
        const weight = item.product?.weight ? parseFloat(item.product.weight) : 0;
        totalWeight += weight * 1000 * (item.quantity || 1);
      }

      // Xác định hệ số
      let weightMultiplier = 1;
      if (totalWeight < 100) weightMultiplier = 0.72;
      else if (totalWeight < 300) weightMultiplier = 0.98;
      else if (totalWeight < 1000) weightMultiplier = 1.6;
      else if (totalWeight <= 5000) weightMultiplier = 2.3;
      else if (totalWeight <= 10000) weightMultiplier = 7.1;
      else weightMultiplier = 13.2;

      // Tính phí ship
      const shippingFee = 5000 + 5000 * weightMultiplier;

      return {
        totalWeight,
        weightMultiplier,
        shippingFee: Math.round(shippingFee)
      };
    } catch (error) {
      console.error('Lỗi khi tính phí vận chuyển:', error);
      throw error;
    }
  }
}

module.exports = new ShippingService(); 