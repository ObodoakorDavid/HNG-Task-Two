import asyncWrapper from "../middlewares/asyncWrapper.js";
import userService from "../services/userService.js";

// Get User Record
export const getUserRecord = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;
  const result = await userService.getUserRecord(userId, id);
  res.status(200).json(result);
});
