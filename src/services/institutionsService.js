import { v4 as uuidv4 } from "uuid";
import { HttpError } from "#root/src/lib/respond.js";
import * as institutionsRepo from "#root/src/repositories/institutionsRepo.js";

// Moved verbatim from the old controller — the DAG renderer walks this exact
// nested shape, so the keys/casing/nesting must be preserved byte-for-byte.
const mapResearchGroupsWithAssociations = async (researchGroups, institution) => {
  return Promise.all(researchGroups.map(async (group) => {
    const institutionId = group.institutionId || institution.institutionId || institution.id;

    const literature = await institutionsRepo.findLiteratureByInstitutionId(institutionId);

    const literatureWithAssociations = await Promise.all(literature.map(async (lit) => {
      const languageId = lit.languageId || lit.language_id;
      const language = await institutionsRepo.findLanguageById(languageId);

      return {
        ...lit,
        associations: {
          language: language || null
        }
      };
    }));

    return {
      ...group,
      associations: {
        institution: institution || null,
        literature: literatureWithAssociations || []
      }
    };
  }));
};

export const getAll = async () => {
  const institutions = await institutionsRepo.findAll();

  return Promise.all(institutions.map(async (institution) => {
    const researchGroups = await institutionsRepo.findResearchGroupsByInstitutionId(institution.institutionId);
    const researchGroupsWithAssociations = await mapResearchGroupsWithAssociations(researchGroups, institution);

    const literature = await institutionsRepo.findLiteratureByInstitutionId(institution.institutionId);
    const literatureWithAssociations = await Promise.all(literature.map(async (lit) => {
      const languageId = lit.languageId || lit.language_id;
      const language = await institutionsRepo.findLanguageById(languageId);
      return {
        ...lit,
        associations: {
          language: language || null
        }
      };
    }));

    return {
      ...institution,
      associations: {
        researchGroups: researchGroupsWithAssociations || [],
        literature: literatureWithAssociations || [],
      }
    };
  }));
};

export const getById = async (id) => {
  const institution = await institutionsRepo.findById(id);
  if (!institution) return null;

  const institutionId = institution.institutionId;

  const researchGroups = await institutionsRepo.findResearchGroupsByInstitutionId(institutionId);
  const researchGroupsWithAssociations = await mapResearchGroupsWithAssociations(researchGroups, institution);

  const literature = await institutionsRepo.findLiteratureByInstitutionIdViaJoin(institutionId);
  const languages = await institutionsRepo.findLanguagesByInstitutionIdViaJoin(institutionId);

  return {
    ...institution,
    associations: {
      researchGroups: researchGroupsWithAssociations || [],
      literature: literature || [],
      languages: languages || []
    }
  };
};

export const create = async ({ name, location, type, description }) => {
  if (!name) throw new HttpError(400, "Name is required");
  const id = uuidv4();
  await institutionsRepo.insert({ id, name, location, type, description });
  return { id, name, location, type, description };
};

export const update = async (id, { name, location, type, description }) => {
  const result = await institutionsRepo.update(id, { name, location, type, description });
  if (result.affectedRows === 0) throw new HttpError(404, "Institution not found");
};

export const remove = async (id) => {
  const result = await institutionsRepo.remove(id);
  if (result.affectedRows === 0) throw new HttpError(404, "Institution not found");
};
