import jwt from "jsonwebtoken";

const generateToken = (userData) => {
  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export default generateToken;
