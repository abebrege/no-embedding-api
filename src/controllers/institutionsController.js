import { ok, fail } from "#root/src/lib/respond.js";
import * as institutionsService from "#root/src/services/institutionsService.js";

export const getAllInstitutions = async (req, res) => {
  const data = await institutionsService.getAll();
  ok(res, data, { count: data.length });
};

export const getInstitutionById = async (req, res) => {
  const data = await institutionsService.getById(req.params.id);
  if (!data) return fail(res, 404, "Institution not found");
  ok(res, data);
};

export const createInstitution = async (req, res) => {
  const data = await institutionsService.create(req.body);
  ok(res, data, { message: "Institution created successfully" }, 201);
};

export const updateInstitution = async (req, res) => {
  await institutionsService.update(req.params.id, req.body);
  ok(res, undefined, { message: "Institution updated successfully" });
};

export const deleteInstitution = async (req, res) => {
  await institutionsService.remove(req.params.id);
  ok(res, undefined, { message: "Institution deleted successfully" });
};
