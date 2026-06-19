import { ok, fail } from "#root/src/lib/respond.js";
import * as researchGroupsService from "#root/src/services/researchGroupsService.js";

export const getAllResearchGroups = async (req, res) => {
  const data = await researchGroupsService.getAll();
  ok(res, data, { count: data.length });
};

export const getResearchGroupById = async (req, res) => {
  const data = await researchGroupsService.getById(req.params.id);
  if (!data) return fail(res, 404, "Research group not found");
  ok(res, data);
};

export const createResearchGroup = async (req, res) => {
  const data = await researchGroupsService.create(req.body);
  ok(res, data, { message: "Research group created successfully" }, 201);
};

export const updateResearchGroup = async (req, res) => {
  await researchGroupsService.update(req.params.id, req.body);
  ok(res, undefined, { message: "Research group updated successfully" });
};

export const deleteResearchGroup = async (req, res) => {
  await researchGroupsService.remove(req.params.id);
  ok(res, undefined, { message: "Research group deleted successfully" });
};
