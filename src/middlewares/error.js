import { validationResult } from "express-validator";

// Middleware to handle validation errors
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    // console.log(errors.array()[0].msg);
  }
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: [
        {
          field: errors.array()[0].path,
          message: errors.array()[0].msg,
        },
      ],
    });
  }
  next();
}

export const errorMiddleware = (err, req, res, next) => {
  let statusCode =
    err.statusCode || (res.statusCode == 200 ? 500 : res.statusCode);
  let errorResponse = {
    status: err.status || "Failed",
    message: err.message || "Something went wrong, please try again later",
    statusCode: statusCode || 500,
  };

  const { name, errors } = err;

  if (name === "SequelizeUniqueConstraintError") {
    errorResponse = {
      errors: [
        { field: errors[0].path, message: `${errors[0].path} already exists` },
      ],
    };
    statusCode = 422;
  }

  // console.error(err.message); // Logging the error for debugging
  // console.error(err.stack); // Logging the error for debugging

  res.status(statusCode).json(errorResponse);
};
