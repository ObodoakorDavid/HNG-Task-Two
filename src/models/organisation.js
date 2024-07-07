import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./user.js";

const Organisation = db.define("Organisation", {
  orgId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

// User.sync();
// User.sync({ force: true });
export default Organisation;
