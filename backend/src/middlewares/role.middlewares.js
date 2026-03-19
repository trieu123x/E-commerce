export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") next();
    else {
        res.status(403).json({message:"chỉ admin mới truy cập"})
    }
}
export const isCustomer = (req, res, next) => {
    if (req.user && req.user.role === "customer") next();
    else {
        res.status(403).json({message: "Yêu cầu quyền user"})
    }
}

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      console.log("Role check - User role:", req.user?.role);
      console.log("Allowed roles:", allowedRoles);
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: "Không có quyền truy cập" 
        });
      }
      
      if (!allowedRoles.includes(req.user.role)) {
        console.log("Access denied. User role:", req.user.role);
        return res.status(403).json({ 
          success: false,
          message: "Không đủ quyền truy cập" 
        });
      }
      
      console.log("Role authorized:", req.user.role);
      next();
      
    } catch (error) {
      console.error("Role middleware error:", error);
      res.status(500).json({ 
        success: false,
        message: "Lỗi phân quyền" 
      });
    }
  };
};