import pool from "#root/db/config.js";

const db = pool.promise();

// sort: "recent" => publication_year DESC, created_at DESC; default => created_at DESC
// limit: positive integer caps the result set (ignored otherwise)
export const findAll = async ({ sort, limit } = {}) => {
  const orderBy =
    sort === "recent"
      ? "ORDER BY publication_year DESC, created_at DESC"
      : "ORDER BY created_at DESC";

  const parsedLimit = Number.parseInt(limit, 10);
  const hasLimit = Number.isInteger(parsedLimit) && parsedLimit > 0;

  const sql = `SELECT * FROM literature ${orderBy}${hasLimit ? " LIMIT ?" : ""}`;
  const [rows] = await db.query(sql, hasLimit ? [parsedLimit] : []);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM literature WHERE literatureId = ? OR id = ?",
    [id, id]
  );
  return rows[0] || null;
};

// List path: matches on languageId only.
export const findLanguageByLanguageId = async (languageId) => {
  const [rows] = await db.query("SELECT * FROM languages WHERE languageId = ?", [languageId]);
  return rows[0] || null;
};

// Detail path: original also matched an `id` alias.
export const findLanguageById = async (languageId) => {
  const [rows] = await db.query(
    "SELECT * FROM languages WHERE languageId = ? OR id = ?",
    [languageId, languageId]
  );
  return rows[0] || null;
};

export const findInstitutionsByInstitutionId = async (institutionId) => {
  const [rows] = await db.query(
    "SELECT * FROM institutions WHERE institutionId = ?",
    [institutionId]
  );
  return rows;
};

export const findInstitutionsByLiteratureId = async (literatureId) => {
  const [rows] = await db.query(
    "SELECT DISTINCT i.* FROM institutions i JOIN literature_institutions li ON i.institutionId = li.institutionId WHERE li.literatureId = ?",
    [literatureId]
  );
  return rows;
};

export const findResearchGroupsByInstitutionIds = async (institutionIds) => {
  if (institutionIds.length === 0) return [];
  const placeholders = institutionIds.map(() => "?").join(",");
  const [rows] = await db.query(
    `SELECT * FROM research_groups WHERE institutionId IN (${placeholders})`,
    institutionIds
  );
  return rows;
};

export const insert = async ({
  id,
  title,
  author,
  abstract,
  language_id,
  institution_id,
  publication_year,
  pdf_path,
}) => {
  await db.query(
    `INSERT INTO literature (id, title, author, abstract, language_id, institution_id, publication_year, pdf_path, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [id, title, author, abstract, language_id, institution_id, publication_year, pdf_path]
  );
};

export const update = async (id, {
  title,
  author,
  abstract,
  language_id,
  institution_id,
  publication_year,
  pdf_path,
}) => {
  const [result] = await db.query(
    `UPDATE literature
     SET title = ?, author = ?, abstract = ?, language_id = ?, institution_id = ?, publication_year = ?, pdf_path = ?, updated_at = NOW()
     WHERE id = ?`,
    [title, author, abstract, language_id, institution_id, publication_year, pdf_path, id]
  );
  return result;
};

export const remove = async (id) => {
  const [result] = await db.query("DELETE FROM literature WHERE id = ?", [id]);
  return result;
};
