import { customError } from "../utils/customError.js";
import { User, Organisation } from "../models/index.js";
import isUUID from "../utils/isValidUUID.js";

export default {
  // Gets All User's Organisation
  getUserOrganisations: async function (userId) {
    const user = await User.findOne({ where: { userId } });

    const userWithOrgs = await User.findOne({
      where: { userId },
      include: {
        model: Organisation,
        through: {
          attributes: [],
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });

    return {
      status: "success",
      message: "User organisations fetched successfully",
      data: {
        organisations: userWithOrgs.Organisations,
      },
    };
  },
  // Get Organistion By Id
  getOrganisationById: async function (orgId) {
    if (!isUUID(orgId)) {
      throw customError.notFoundError(
        `Organisation with this Id: ${orgId} Not Found`
      );
    }

    const organisation = await Organisation.findOne({
      where: {
        orgId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!organisation) {
      throw customError.notFoundError(
        `Organisation with this Id: ${orgId} Not Found`
      );
    }

    return {
      status: "success",
      message: "Organization fetched successfully",
      data: organisation,
    };
  },

  // Get Organistion By Id
  createOrganisation: async function (organisationData = {}, userId) {
    const { name } = organisationData;

    if (!name) {
      throw customError.badRequestError("Client Error");
    }

    // Find the user
    const user = await User.findOne({ where: { userId } });

    const organisation = await Organisation.create({
      ...organisationData,
    });

    // Attach the user to the organisation
    await organisation.addUser(user);

    return {
      status: "success",
      message: "Organization created successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    };
  },

  // Add User To Organisation
  addUserToOrganisation: async function ({ userId, orgId }) {
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      throw customError.notFoundError(`User with this Id:${userId} Not Found`);
    }

    if (!isUUID(orgId)) {
      throw customError.notFoundError(
        `Organisation with this Id: ${orgId} Not Found`
      );
    }

    const organisation = await Organisation.findOne({
      where: {
        orgId,
      },
    });

    if (!organisation) {
      throw customError.notFoundError(
        `Organisation with this Id: ${orgId} Not Found`
      );
    }

    await organisation.addUser(user);

    return {
      status: "success",
      message: "User added to organisation successfully",
    };
  },
};
