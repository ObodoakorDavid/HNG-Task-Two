import asyncWrapper from "../middlewares/asyncWrapper.js";
import orgService from "../services/orgService.js";

// Get User's Organisations
export const getUserOrgs = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await orgService.getUserOrganisations(userId);
  res.status(200).json(result);
});

// Create New Organisation
export const createOrganisation = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const orgDetails = req.body;
  const result = await orgService.createOrganisation(orgDetails, userId);
  res.status(201).json(result);
});

// Get Organisation By Id
export const getOrganisationById = asyncWrapper(async (req, res, next) => {
  const { orgId } = req.params;
  const result = await orgService.getOrganisationById(orgId);
  res.status(200).json(result);
});

// Add User To Organisation
export const addUserToOrganisation = asyncWrapper(async (req, res, next) => {
  const { userId } = req.body;
  const { orgId } = req.params;
  const result = await orgService.addUserToOrganisation({ userId, orgId });
  res.status(200).json(result);
});
