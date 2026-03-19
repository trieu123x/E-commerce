import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        
        if (!req.headers.authorization) {
            return res.status(401).json({ 
                success: false,
                message: "Không tìm thấy token. Vui lòng đăng nhập." 
            });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Token không hợp lệ" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn user info vào request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            fullName: decoded.fullName,
        };
        
        next();
        
    } catch (error) {
        console.error("Auth middleware error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: "Token không hợp lệ" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Token đã hết hạn. Vui lòng đăng nhập lại." 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Lỗi xác thực" 
        });
    }
};