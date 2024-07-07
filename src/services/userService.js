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
      username: user.username,
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
      username: user.username,
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
  getUserRecord: async function (id) {
    // Fetch the target user's record
    const targetUser = await User.findOne({ where: { userId: id } });
    if (!targetUser) {
      throw customError.badRequestError(`User with this Id:${id} Not Found`);
    }

    return {
      status: "success",
      message: "User fetched successfully",
      data: {
        userId: targetUser.userId,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        email: targetUser.email,
        phone: targetUser.phone,
      },
    };
  },
};
