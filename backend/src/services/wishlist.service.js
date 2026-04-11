import wishlistRepository from "../repositories/wishlist.repository.js";

class WishlistService {
  async getWishlist(userId) {
    const wishlist = await wishlistRepository.findAll(userId);
    return wishlist.map((item) => this._formatWishlistItem(item));
  }

  async addToWishlist(userId, productId) {
    const existing = await wishlistRepository.findOne({
      user_id: userId,
      product_id: productId,
    });
    if (existing) {
      throw new Error("Sản phẩm đã có trong danh sách yêu thích");
    }
    return await wishlistRepository.create({
      user_id: userId,
      product_id: productId,
    });
  }

  async removeFromWishlist(userId, productId) {
    const deleted = await wishlistRepository.delete({
      user_id: userId,
      product_id: productId,
    });
    if (deleted === 0) {
      throw new Error("Sản phẩm không có trong danh sách yêu thích");
    }
    return true;
  }

  async checkWishlistStatus(userId, productId) {
    const item = await wishlistRepository.findOne({
      user_id: userId,
      product_id: productId,
    });
    return !!item;
  }

  _formatWishlistItem(item) {
    const product = item.product;
    const now = new Date();
    let price_after = product.price;
    let saleName = null;

    const activeSales = product.sales?.filter(
      (sale) =>
        sale.is_active &&
        new Date(sale.start_date) <= now &&
        new Date(sale.end_date) >= now
    );

    if (activeSales && activeSales.length > 0) {
      activeSales.forEach((sale) => {
        let discountedPrice = product.price;
        if (sale.discount_type === "percent") {
          discountedPrice =
            product.price - (product.price * sale.discount_value) / 100;
        }
        if (sale.discount_type === "fixed") {
          discountedPrice = product.price - sale.discount_value;
        }
        if (discountedPrice < price_after) {
          price_after = discountedPrice;
          saleName = sale.name;
        }
      });
    }

    return {
      id: item.id,
      user_id: item.user_id,
      product_id: product.id,
      product: {
        id: product.id,
        category_id: product.category_id,
        name: product.name,
        price: parseFloat(product.price),
        price_after: parseFloat(price_after),
        saleName: saleName,
        images: product.images,
        main_image: product.images && product.images[0] ? product.images[0].image_url : null,
        stock: product.stock,
        rating: product.rating,
        review_count: product.review_count
      }
    };
  }
}

export default new WishlistService();
