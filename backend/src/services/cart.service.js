import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";

class CartService {
  async getCart(userId) {
    const cart = await cartRepository.findCartWithItems(userId);
    if (!cart) {
      const [newCart] = await cartRepository.findOrCreateCart(userId);
      return {
        id: newCart.id,
        user_id: newCart.user_id,
        items: [],
        summary: { totalItems: 0, totalQuantity: 0, totalPrice: 0 },
      };
    }

    const activeItems = (cart.items || []).filter(
      (item) => item.product && item.product.status === "ACTIVE"
    );

    const formattedItems = activeItems.map((item) => this._formatCartItem(item));

    const total = formattedItems.reduce((sum, item) => sum + item.total, 0);

    return {
      id: cart.id,
      user_id: cart.user_id,
      items: formattedItems,
      summary: {
        totalItems: formattedItems.length,
        totalQuantity: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: total,
      },
    };
  }

  async addToCart(userId, productId, quantity) {
    const product = await productRepository.findById(productId);
    if (!product || product.status !== "ACTIVE") {
      throw new Error("Sản phẩm không tồn tại hoặc không khả dụng");
    }

    if (product.stock < quantity) {
      throw new Error("Số lượng sản phẩm trong kho không đủ");
    }

    const [cart] = await cartRepository.findOrCreateCart(userId);
    const cartItem = await cartRepository.findCartItem(cart.id, productId);

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      await cartRepository.createCartItem(cart.id, productId, quantity);
    }

    // Lấy lại item đã cập nhật để trả về
    const updatedCartItem = await cartRepository.findCartItemWithProduct(
      cartItem ? cartItem.id : (await cartRepository.findCartItem(cart.id, productId)).id,
      userId
    );

    return this._formatCartItem(updatedCartItem);
  }

  async updateCartItem(userId, itemId, quantity) {
    if (!quantity || quantity < 1) {
      throw new Error("Số lượng không hợp lệ");
    }

    const cartItem = await cartRepository.findCartItemWithProduct(itemId, userId);
    if (!cartItem) {
      throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }

    if (quantity > cartItem.product.stock) {
      throw new Error(`Số lượng trong kho không đủ. Chỉ còn ${cartItem.product.stock} sản phẩm`);
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return this._formatCartItem(cartItem);
  }

  async removeFromCart(userId, itemId) {
    const deleted = await cartRepository.deleteCartItem(itemId, userId);
    if (deleted === 0) {
      throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }
    return true;
  }

  async clearCart(userId) {
    const cart = await cartRepository.findCartWithItems(userId);
    if (!cart) return 0;
    return await cartRepository.clearCart(cart.id);
  }

  async getCartCount(userId) {
    const cart = await cartRepository.findCartWithItems(userId);
    let totalQuantity = 0;
    if (cart && cart.items) {
      totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    return totalQuantity;
  }

  _formatCartItem(item) {
    const product = item.product;
    const now = new Date();
    let price = parseFloat(product.price);
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
      cart_id: item.cart_id,
      product_id: item.product_id,
      product_name: product.name,
      price,
      price_after,
      saleName,
      quantity: item.quantity,
      image: product.images && product.images.length > 0 ? product.images[0].image_url : null,
      stock: product.stock,
      total: price_after * item.quantity,
    };
  }
}

export default new CartService();
