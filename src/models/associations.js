import User from "./user.js";
import Organisation from "./organisation.js";

User.belongsToMany(Organisation, {
  through: "UserOrganisation",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Organisation.belongsToMany(User, {
  through: "UserOrganisation",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export { User, Organisation };
