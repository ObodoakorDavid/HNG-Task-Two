import db from "./db.js";

const connectDB = async () => {
  try {
    await db.authenticate();
  } catch (error) {
    console.log(error);
    console.log(`DB closed because of:${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
