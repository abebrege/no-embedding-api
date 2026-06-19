import pool from "#root/db/config.js";

const db = pool.promise();

export const findAll = async () => {
  const [rows] = await db.query("SELECT * FROM research_groups ORDER BY name ASC");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM research_groups WHERE researchGroupId = ? OR id = ?",
    [id, id]
  );
  return rows[0] || null;
};

// List path: matches on institutionId only.
export const findInstitutionByInstitutionId = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT * FROM institutions WHERE institutionId = ?",
    [institutionId]
  );
  return rows;
};

// Detail path: original also matched an `id` alias.
export const findInstitutionById = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT * FROM institutions WHERE institutionId = ? OR id = ?",
    [institutionId, institutionId]
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

export const findLanguageById = async (languageId) => {
  const [rows] = await db.query("SELECT * FROM languages WHERE languageId = ?", [languageId]);
  return rows;
};

export const findLanguagesByInstitutionId = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT * FROM languages WHERE institutionId = ?",
    [institutionId]
  );
  return rows;
};

export const insert = async ({ id, name, url, institutionId }) => {
  await db.query(
    "INSERT INTO research_groups (researchGroupId, name, url, institutionId, created_at) VALUES (?, ?, ?, ?, NOW())",
    [id, name, url, institutionId]
  );
};

export const update = async (id, { name, url, institutionId }) => {
  const [result] = await db.query(
    "UPDATE research_groups SET name = ?, url = ?, institutionId = ?, updated_at = NOW() WHERE researchGroupId = ? OR id = ?",
    [name, url, institutionId, id, id]
  );
  return result;
};

export const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM research_groups WHERE researchGroupId = ? OR id = ?",
    [id, id]
  );
  return result;
};
