import { v4 as uuidv4 } from "uuid";
import { HttpError } from "#root/src/lib/respond.js";
import * as languagesRepo from "#root/src/repositories/languagesRepo.js";

// Build the full association shape for a single language. The list now mirrors
// getById (literature + institutions + researchGroups) so the frontend gets
// each language's repo, linked paper(s), and university without cross-joining.
const withAssociations = async (language) => {
  const languageId = language.languageId || language.id;

  const [literature, institutions, researchGroups] = await Promise.all([
    languagesRepo.findLiteratureByLanguageId(languageId),
    languagesRepo.findInstitutionsByLanguageId(languageId),
    languagesRepo.findResearchGroupsByLanguageId(languageId),
  ]);

  return {
    ...language,
    associations: {
      literature: literature || [],
      institutions: institutions || [],
      researchGroups: researchGroups || [],
    },
  };
};

export const getAll = async () => {
  const languages = await languagesRepo.findAll();
  return Promise.all(languages.map(withAssociations));
};

export const getById = async (id) => {
  const language = await languagesRepo.findById(id);
  if (!language) return null;
  return withAssociations(language);
};

export const create = async ({ name, repoUrl, type, host, summary }) => {
  if (!name) throw new HttpError(400, "Name is required");
  const languageId = uuidv4();
  try {
    await languagesRepo.insert({ languageId, name, repoUrl, type, host, summary });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") throw new HttpError(409, "Language repoUrl already exists");
    throw error;
  }
  return { languageId, name, repoUrl, type, host, summary };
};

export const update = async (id, { name, repoUrl, type, host, summary }) => {
  const result = await languagesRepo.update(id, { name, repoUrl, type, host, summary });
  if (result.affectedRows === 0) throw new HttpError(404, "Language not found");
};

export const remove = async (id) => {
  const result = await languagesRepo.remove(id);
  if (result.affectedRows === 0) throw new HttpError(404, "Language not found");
};
