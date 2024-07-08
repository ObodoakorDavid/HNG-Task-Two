import db from "../config/db.js";
import { User, Organisation } from "./associations.js";

// Sync all models
db.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
});

export { User, Organisation };
