import {
  addUserToOrganisation,
  createOrganisation,
  getOrganisationById,
  getUserOrgs,
} from "../controllers/orgController.js";
import { isAuth } from "../middlewares/auth.js";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import express from "express";
const router = express.Router();

router
  .route("/organisations")
  .get(isAuth, getUserOrgs)
  .post(isAuth, createOrganisation)
  .all(methodNotAllowed);

router
  .route("/organisations/:orgId")
  .get(isAuth, getOrganisationById)
  .all(methodNotAllowed);

router
  .route("/organisations/:orgId/users")
  .post(addUserToOrganisation)
  .all(methodNotAllowed);

export default router;
