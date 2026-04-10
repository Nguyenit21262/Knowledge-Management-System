export const isTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Chỉ giáo viên mới có quyền này",
    });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({
      message: "Chỉ học sinh mới có quyền này",
    });
  }
  next();
};
