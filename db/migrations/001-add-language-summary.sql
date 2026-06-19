-- Forward migration: add languages.summary
--
-- There is no migration runner in this project; `npm run rebuild_run` drops and
-- recreates the schema from db/model/create_db.sql (which already includes this
-- column). Apply this file manually only against an existing database that must
-- be preserved (i.e. not rebuilt from scratch):
--
--   mysql -u <user> -p <schema> < db/migrations/001-add-language-summary.sql

ALTER TABLE languages
  ADD COLUMN summary VARCHAR(500) DEFAULT NULL AFTER host;
