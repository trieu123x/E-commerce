import db from '../../models/index.js';
import { literal, col, fn } from "sequelize";
const { Product, ProductImage, Wishlist, Review, Sale, ProductSale } = db;

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;
        
        // Kiểm tra sản phẩm đã có trong wishlist chưa
        const existingEntry = await db.Wishlist.findOne({
            where: {
                user_id: userId,
                product_id
                
            }
        })
        if (existingEntry) {
            return res.status(400).json({
                success: false,
                message: "Sản phẩm đã có trong danh sách yêu thích"
            });
        }
        const wishlistEntry = await db.Wishlist.create({
            user_id: userId,
            product_id
        });
        res.json({
            success: true,
            message: "Đã thêm sản phẩm vào danh sách yêu thích",
            wishlist: wishlistEntry
        });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({  
            success: false,
            message: "Lỗi server"
        });
    }
}

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;

    await db.Wishlist.destroy({
      where: {
        user_id: userId,
        product_id
      }
    });

    res.json({
      success: true,
      message: "Đã xóa khỏi wishlist"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await db.Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Product,
          as: "product",
          attributes: {
            include: [
              [
                literal(`(
                  SELECT COALESCE(AVG(rating),0)
                  FROM reviews
                  WHERE reviews.product_id = "product".id
                )`),
                "avg_rating",
              ],
              [
                literal(`(
                  SELECT COUNT(*)
                  FROM reviews
                  WHERE reviews.product_id = "product".id
                )`),
                "review_count",
              ],
            ],
          },
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["id", "image_url", "is_main"],
              where: { is_main: true },
              required: false,
            },
            {
              model: Sale,
              as: "sales",
              attributes: [
                "id",
                "name",
                "discount_type",
                "discount_value",
                "start_date",
                "end_date",
                "is_active",
              ],
              through: { attributes: [] },
              required: false,
            },
          ],
        },
      ],
    });

    const now = new Date();
    const formattedWishlist = wishlistItems.map((item) => {
      const product = item.product;
      if (!product) return item;

      let saleName = null;
      let price_after = product.price;

      const activeSales = product.sales?.filter(
        (sale) =>
          sale.is_active &&
          new Date(sale.start_date) <= now &&
          new Date(sale.end_date) >= now,
      );

      if (activeSales && activeSales.length > 0) {
        activeSales.forEach((s) => {
          let discountedPrice = product.price;
          if (s.discount_type === "percent") {
            discountedPrice = product.price - (product.price * s.discount_value) / 100;
          } else if (s.discount_type === "fixed") {
            discountedPrice = product.price - s.discount_value;
          }

          if (discountedPrice < price_after) {
            price_after = discountedPrice;
            saleName = s.name;
          }
        });
      }

      return {
        ...item.toJSON(),
        product: {
          ...product.toJSON(),
          price: parseFloat(product.price),
          price_after: parseFloat(price_after),
          saleName,
          rating: product.get("avg_rating")
            ? parseFloat(product.get("avg_rating")).toFixed(1)
            : 0,
          review_count: parseInt(product.get("review_count")) || 0,
          main_image:
            product.images && product.images.length > 0
              ? product.images[0].image_url
              : null,
        },
      };
    });

    res.json({
      success: true,
      data: formattedWishlist
    });

  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
};