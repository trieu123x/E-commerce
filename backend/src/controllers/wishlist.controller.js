import db from '../../models/index.js';

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
          as: "product"
        }
      ]
    });

    res.json({
      success: true,
      data: wishlistItems
    });

  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server"
    });
  }
};