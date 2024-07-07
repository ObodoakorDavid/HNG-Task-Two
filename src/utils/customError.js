export const customError = {
  badRequestError: (message) => {
    return {
      status: "Bad Request",
      message,
      statusCode: 400,
    };
  },
  unAuthorizedError: (message) => {
    return {
      status: "Bad Request",
      message,
      statusCode: 401,
    };
  },
  internalServerError: (message) => {
    return {
      status: "Bad Request",
      message,
      statusCode: 500,
    };
  },
};
