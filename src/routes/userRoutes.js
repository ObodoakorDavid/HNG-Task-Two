import { getUserRecord } from "../controllers/userController.js";
import { isAuth } from "../middlewares/auth.js";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import express from "express";
const router = express.Router();

router.route("/users/:id").get(isAuth, getUserRecord).all(methodNotAllowed);

export default router;
