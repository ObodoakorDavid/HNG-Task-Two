import asyncWrapper from "../middlewares/asyncWrapper.js";
import userService from "../services/userService.js";

// Get User Record
export const getUserRecord = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await userService.getUserRecord(id);
  res.status(200).json(result);
});
