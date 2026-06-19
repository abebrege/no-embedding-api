import pool from "#root/db/config.js";

const db = pool.promise();

export const findAll = async () => {
  const [rows] = await db.query("SELECT * FROM institutions ORDER BY name ASC");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM institutions WHERE institutionId = ? OR id = ?",
    [id, id]
  );
  return rows[0] || null;
};

export const findResearchGroupsByInstitutionId = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT * FROM research_groups WHERE institutionId = ?",
    [institutionId]
  );
  return rows;
};

export const findLiteratureByInstitutionId = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT * FROM literature WHERE institutionId = ?",
    [institutionId]
  );
  return rows;
};

export const findLiteratureByInstitutionIdViaJoin = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT DISTINCT l.* FROM literature l JOIN literature_institutions li ON l.literatureId = li.literatureId WHERE li.institutionId = ?",
    [institutionId]
  );
  return rows;
};

export const findLanguagesByInstitutionIdViaJoin = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT DISTINCT lang.* FROM languages lang JOIN literature l ON lang.languageId = l.languageId JOIN literature_institutions li ON l.literatureId = li.literatureId WHERE li.institutionId = ?",
    [institutionId]
  );
  return rows;
};

export const findLanguageById = async (languageId) => {
  const [rows] = await db.query("SELECT * FROM languages WHERE languageId = ?", [languageId]);
  return rows[0] || null;
};

export const insert = async ({ id, name, location, type, description }) => {
  await db.query(
    "INSERT INTO institutions (id, name, location, type, description, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
    [id, name, location, type, description]
  );
};

export const update = async (id, { name, location, type, description }) => {
  const [result] = await db.query(
    "UPDATE institutions SET name = ?, location = ?, type = ?, description = ?, updated_at = NOW() WHERE id = ?",
    [name, location, type, description, id]
  );
  return result;
};

export const remove = async (id) => {
  const [result] = await db.query("DELETE FROM institutions WHERE id = ?", [id]);
  return result;
};
