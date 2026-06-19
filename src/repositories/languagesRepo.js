import pool from "#root/db/config.js";

const db = pool.promise();

export const findAll = async () => {
  const [rows] = await db.query("SELECT * FROM languages ORDER BY name ASC");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM languages WHERE languageId = ?", [id]);
  return rows[0] || null;
};

export const findLiteratureByLanguageId = async (languageId) => {
  const [rows] = await db.query("SELECT * FROM literature WHERE languageId = ?", [languageId]);
  return rows;
};

export const findInstitutionsByLanguageId = async (languageId) => {
  const [rows] = await db.query(
    "SELECT DISTINCT i.* FROM institutions i JOIN literature_institutions li ON i.institutionId = li.institutionId JOIN literature l ON li.literatureId = l.literatureId WHERE l.languageId = ?",
    [languageId]
  );
  return rows;
};

export const findResearchGroupsByLanguageId = async (languageId) => {
  const [rows] = await db.query(
    "SELECT DISTINCT rg.* FROM research_groups rg JOIN institutions i ON rg.institutionId = i.institutionId JOIN literature_institutions li ON i.institutionId = li.institutionId JOIN literature l ON li.literatureId = l.literatureId WHERE l.languageId = ?",
    [languageId]
  );
  return rows;
};

export const insert = async ({ languageId, name, repoUrl, type, host, summary }) => {
  await db.query(
    "INSERT INTO languages (languageId, name, repoUrl, type, host, summary, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
    [languageId, name, repoUrl, type, host, summary]
  );
};

export const update = async (id, { name, repoUrl, type, host, summary }) => {
  const [result] = await db.query(
    "UPDATE languages SET name = ?, repoUrl = ?, type = ?, host = ?, summary = ?, updated_at = NOW() WHERE languageId = ?",
    [name, repoUrl, type, host, summary, id]
  );
  return result;
};

export const remove = async (id) => {
  const [result] = await db.query("DELETE FROM languages WHERE languageId = ?", [id]);
  return result;
};
