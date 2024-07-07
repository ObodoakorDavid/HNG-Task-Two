import methodNotAllowed from "../utils/methodNotAllowed.js";
import express from "express";
import { signInUser, signUpUser } from "../controllers/authController.js";
import {
  userSignInValidator,
  userSignUpValidator,
} from "../validators/userValidator.js";

const router = express.Router();

router
  .route("/register")
  .post(userSignUpValidator, signUpUser)
  .all(methodNotAllowed);
router
  .route("/login")
  .post(userSignInValidator, signInUser)
  .all(methodNotAllowed);

export default router;
