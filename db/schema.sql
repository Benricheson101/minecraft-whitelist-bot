CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE players (
  id integer primary key,
  minecraft_uuid char(32) unique not null,
  discord_id text unique
);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20260201051701');
