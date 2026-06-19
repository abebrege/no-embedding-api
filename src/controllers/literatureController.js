import { ok, fail } from "#root/src/lib/respond.js";
import * as literatureService from "#root/src/services/literatureService.js";

export const getAllLiterature = async (req, res) => {
  const { sort, limit } = req.query;
  const data = await literatureService.getAll({ sort, limit });
  ok(res, data, { count: data.length });
};

export const getLiteratureById = async (req, res) => {
  const data = await literatureService.getById(req.params.id);
  if (!data) return fail(res, 404, "Literature not found");
  ok(res, data);
};

export const createLiterature = async (req, res) => {
  const data = await literatureService.create(req.body);
  ok(res, data, { message: "Literature created successfully" }, 201);
};

export const updateLiterature = async (req, res) => {
  await literatureService.update(req.params.id, req.body);
  ok(res, undefined, { message: "Literature updated successfully" });
};

export const deleteLiterature = async (req, res) => {
  await literatureService.remove(req.params.id);
  ok(res, undefined, { message: "Literature deleted successfully" });
};
