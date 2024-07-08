import generateToken from "../config/generateToken.js";
import { User, Organisation } from "../models/index.js";
import { comparePassword, hashPassword } from "../utils/generalUtils.js";
import { customError } from "../utils/customError.js";

export default {
  // Register A New User
  register: async function (userData = {}) {
    const { firstName, password } = userData;

    // Hashing Password
    const hashedPassword = await hashPassword(password);

    // User Creation
    const user = await User.create({ ...userData, password: hashedPassword });

    // Organisation Creation
    const newOrg = await Organisation.create({
      name: `${firstName}'s Organisation`,
    });

    // Associate the user with the organisation
    await user.addOrganisation(newOrg);

    const userInfo = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    // Token Generation
    const token = generateToken(userInfo);

    return {
      status: "success",
      message: "Registration Successfully",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    };
  },
  // Sign In An Existing User
  signIn: async function (userData = {}) {
    const { email, password } = userData;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw customError.unAuthorizedError("Authentication failed");
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw customError.unAuthorizedError("Authentication failed");
    }

    const userInfo = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    const token = generateToken(userInfo);

    return {
      status: "success",
      message: "Login Successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    };
  },
  // Get User Record
  getUserRecord: async function (userId, id) {
    const user = await User.findOne({ where: { userId: id } });

    if (!isUUID(id)) {
      throw customError.badRequestError(
        `User with this Id: ${orgId} Not Found`
      );
    }

    if (!isUUID(userId)) {
      throw customError.badRequestError(
        `User with this Id: ${orgId} Not Found`
      );
    }

    if (!user) {
      throw customError.badRequestError(`User with this Id:${id} Not Found`);
    }

    if (userId === id) {
      return {
        status: "success",
        message: "User fetched successfully",
        data: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      };
    }

    // Check if both users belong to the same organisation
    const commonOrganisation = await User.findOne({
      where: { userId },
      include: {
        model: Organisation,
        as: "Organisations",
        include: {
          model: User,
          where: { userId: id },
          attributes: [],
          through: { attributes: [] },
        },
      },
    });

    if (commonOrganisation.Organisations.length < 1) {
      throw customError.badRequestError(
        `You don't share a common organisation with this user`
      );
    }

    return {
      status: "success",
      message: "User fetched successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    };
  },
};
