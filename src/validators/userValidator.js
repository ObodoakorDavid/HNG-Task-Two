import { body } from "express-validator";
import { handleValidationErrors } from "../middlewares/error.js";

export const userSignUpValidator = [
  body("firstName")
    .exists()
    .withMessage("firstName is required")
    .notEmpty()
    .withMessage("firstName can't be empty")
    .isString()
    .withMessage("firstName must be a string"),

  body("lastName")
    .exists()
    .withMessage("lastName is required")
    .notEmpty()
    .withMessage("lastName can't be empty")
    .isString()
    .withMessage("lastName must be a string"),

  body("email")
    .exists()
    .withMessage("email is required")
    .notEmpty()
    .withMessage("email can't be empty")
    .isString()
    .withMessage("email must be a string")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .exists()
    .withMessage("password is required")
    .notEmpty()
    .withMessage("password can't be empty")
    .isString()
    .withMessage("password must be a string"),

  body("phone").optional().isString().withMessage("phone must be a string"),

  handleValidationErrors,
];

export const userSignInValidator = [
  body("email")
    .exists()
    .withMessage("email is required")
    .isString()
    .withMessage("email must be a string")
    .notEmpty()
    .withMessage("email can't be empty")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .exists()
    .withMessage("password is required")
    .notEmpty()
    .withMessage("password can't be empty")
    .isString()
    .withMessage("password must be a string"),

  handleValidationErrors,
];
