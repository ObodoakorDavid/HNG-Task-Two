import jwt from "jsonwebtoken";
import { customError } from "../utils/customError.js";
import verifyToken from "../config/verifyToken.js";

export const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(customError.unAuthorizedError("Authentication failed"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(customError.unAuthorizedError("Authentication failed"));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(customError.unAuthorizedError("Authentication failed"));
    }

    return next(customError.internalServerError("Something went wrong"));
  }
};
