import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};

export default verifyToken;
