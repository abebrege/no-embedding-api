import { ok, fail } from "#root/src/lib/respond.js";
import * as languagesService from "#root/src/services/languagesService.js";

export const getAllLanguages = async (req, res) => {
  const data = await languagesService.getAll();
  ok(res, data, { count: data.length });
};

export const getLanguageById = async (req, res) => {
  const data = await languagesService.getById(req.params.id);
  if (!data) return fail(res, 404, "Language not found");
  ok(res, data);
};

export const createLanguage = async (req, res) => {
  const data = await languagesService.create(req.body);
  ok(res, data, { message: "Language created successfully" }, 201);
};

export const updateLanguage = async (req, res) => {
  await languagesService.update(req.params.id, req.body);
  ok(res, undefined, { message: "Language updated successfully" });
};

export const deleteLanguage = async (req, res) => {
  await languagesService.remove(req.params.id);
  ok(res, undefined, { message: "Language deleted successfully" });
};
