import asyncWrapper from "../middlewares/asyncWrapper.js";
import userService from "../services/userService.js";

// SignUp User
export const signUpUser = asyncWrapper(async (req, res, next) => {
  const result = await userService.register(req.body);
  res.status(201).json(result);
});

// SignIn User
export const signInUser = asyncWrapper(async (req, res, next) => {
  const result = await userService.signIn(req.body);
  res.status(200).json(result);
});
