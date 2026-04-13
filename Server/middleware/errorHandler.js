export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "API route not found" });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON payload.",
    });
    return;
  }

  if (error.message?.startsWith("CORS blocked for origin:")) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error("Unhandled server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
