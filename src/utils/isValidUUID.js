import { Sequelize } from "sequelize";

function isUUID(uuid, version = null) {
  if (version) {
    return Sequelize.Validator.isUUID(uuid, version);
  }
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export default isUUID;
