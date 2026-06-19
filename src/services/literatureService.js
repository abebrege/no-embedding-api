import { v4 as uuidv4 } from "uuid";
import { HttpError } from "#root/src/lib/respond.js";
import * as literatureRepo from "#root/src/repositories/literatureRepo.js";

// opts: { sort, limit } — sort="recent" orders newest-first, limit caps the set.
export const getAll = async ({ sort, limit } = {}) => {
  const literature = await literatureRepo.findAll({ sort, limit });

  return Promise.all(literature.map(async (item) => {
    const languageId = item.languageId || item.language_id;

    const language = await literatureRepo.findLanguageByLanguageId(languageId);
    const institutions = await literatureRepo.findInstitutionsByInstitutionId(item.institutionId);

    const institutionIds = institutions.map((inst) => inst.institutionId);
    const researchGroups = await literatureRepo.findResearchGroupsByInstitutionIds(institutionIds);

    return {
      ...item,
      associations: {
        language: language || null,
        institutions: institutions || [],
        researchGroups: researchGroups || []
      }
    };
  }));
};

export const getById = async (id) => {
  const literature = await literatureRepo.findById(id);
  if (!literature) return null;

  const literatureId = literature.literatureId || literature.id;
  const languageId = literature.languageId || literature.language_id;

  const language = await literatureRepo.findLanguageById(languageId);
  const institutions = await literatureRepo.findInstitutionsByLiteratureId(literatureId);

  const institutionIds = institutions.map((inst) => inst.institutionId);
  const researchGroups = await literatureRepo.findResearchGroupsByInstitutionIds(institutionIds);

  return {
    ...literature,
    associations: {
      language: language || null,
      institutions: institutions || [],
      researchGroups: researchGroups || []
    }
  };
};

export const create = async (payload) => {
  const { title, author } = payload;
  if (!title || !author) throw new HttpError(400, "Title and author are required");

  const id = uuidv4();
  const {
    abstract, language_id, institution_id, publication_year, pdf_path,
  } = payload;
  await literatureRepo.insert({
    id, title, author, abstract, language_id, institution_id, publication_year, pdf_path,
  });
  return { id, title, author, abstract, language_id, institution_id, publication_year, pdf_path };
};

export const update = async (id, payload) => {
  const result = await literatureRepo.update(id, payload);
  if (result.affectedRows === 0) throw new HttpError(404, "Literature not found");
};

export const remove = async (id) => {
  const result = await literatureRepo.remove(id);
  if (result.affectedRows === 0) throw new HttpError(404, "Literature not found");
};
