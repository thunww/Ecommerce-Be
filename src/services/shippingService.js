class ShippingService {
  constructor() {
    this.basePrice = 10000; // Giá cơ bản cố định
    this.weightMultipliers = {
      light: 1.0,    // < 5kg
      medium: 1.2,   // 5-10kg
      heavy: 1.5     // > 10kg
    };
  }

  // Xác định hệ số trọng lượng dựa trên tổng trọng lượng đơn hàng
  getWeightMultiplier(totalWeight) {
    if (totalWeight < 5) return this.weightMultipliers.light;
    if (totalWeight <= 10) return this.weightMultipliers.medium;
    return this.weightMultipliers.heavy;
  }

  // Tính phí vận chuyển
  async calculateShippingFee({ order_items }) {
    try {
      // Tính tổng trọng lượng đơn hàng
      const totalWeight = order_items.reduce((sum, item) => {
        return sum + (item.quantity * item.product.weight);
      }, 0);

      // Lấy hệ số trọng lượng
      const weightMultiplier = this.getWeightMultiplier(totalWeight);

      // Tính phí vận chuyển theo công thức mới
      const shippingFee = Math.round(
        this.basePrice * weightMultiplier
      );

      return {
        totalWeight,
        basePrice: this.basePrice,
        weightMultiplier,
        shippingFee
      };
    } catch (error) {
      console.error('Lỗi khi tính phí vận chuyển:', error);
      throw error;
    }
  }
}

module.exports = new ShippingService(); 