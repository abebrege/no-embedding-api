import { v4 as uuidv4 } from "uuid";
import { HttpError } from "#root/src/lib/respond.js";
import * as researchGroupsRepo from "#root/src/repositories/researchGroupsRepo.js";

export const getAll = async () => {
  const researchGroups = await researchGroupsRepo.findAll();

  return Promise.all(researchGroups.map(async (group) => {
    const institutionId = group.institutionId;

    const institutions = await researchGroupsRepo.findInstitutionByInstitutionId(institutionId);
    const literature = await researchGroupsRepo.findLiteratureByInstitutionId(institutionId);

    const literatureWithAssociations = await Promise.all(literature.map(async (lit) => {
      const languages = await researchGroupsRepo.findLanguageById(lit.languageId);
      return {
        ...lit,
        associations: {
          language: languages[0] || null
        }
      };
    }));

    return {
      ...group,
      associations: {
        institution: institutions[0] || null,
        literature: literatureWithAssociations || [],
      }
    };
  }));
};

export const getById = async (id) => {
  const researchGroup = await researchGroupsRepo.findById(id);
  if (!researchGroup) return null;

  const institutionId = researchGroup.institutionId;

  const institutions = await researchGroupsRepo.findInstitutionById(institutionId);
  const literature = await researchGroupsRepo.findLiteratureByInstitutionId(institutionId);
  const languages = await researchGroupsRepo.findLanguagesByInstitutionId(institutionId);

  return {
    ...researchGroup,
    associations: {
      institution: institutions[0] || null,
      literature: literature || [],
      languages: languages || []
    }
  };
};

export const create = async ({ name, url, institutionId }) => {
  if (!name) throw new HttpError(400, "Name is required");
  const id = uuidv4();
  try {
    await researchGroupsRepo.insert({ id, name, url, institutionId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") throw new HttpError(409, "Research group URL already exists");
    throw error;
  }
  return { id, name, url, institutionId };
};

export const update = async (id, { name, url, institutionId }) => {
  const result = await researchGroupsRepo.update(id, { name, url, institutionId });
  if (result.affectedRows === 0) throw new HttpError(404, "Research group not found");
};

export const remove = async (id) => {
  const result = await researchGroupsRepo.remove(id);
  if (result.affectedRows === 0) throw new HttpError(404, "Research group not found");
};
