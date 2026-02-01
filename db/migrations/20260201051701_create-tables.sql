-- migrate:up
create table players (
  id integer primary key,
  minecraft_uuid char(32) unique not null,
  discord_id text unique
);

-- migrate:down
drop table players;
