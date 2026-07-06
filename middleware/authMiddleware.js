import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // Check token
    if (!token) {
      return res.status(401).json({
        message: "No token found",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save user data
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default protect;
