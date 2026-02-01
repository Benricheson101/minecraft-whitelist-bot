import {DatabaseSync, type StatementSync} from 'node:sqlite';

import type {Player} from './schema';

type PlayerRow = {
  id: number;
  discord_id?: string;
  minecraft_uuid: string;
};

export class Database {
  readonly db: DatabaseSync;

  private IMPORT_WHITELIST: StatementSync;
  private GET_PLAYER_BY_DISCORD: StatementSync;
  private WHITELIST_PLAYER: StatementSync;
  private GET_PLAYER_BY_UUID: StatementSync;
  CLAIM_WHITELIST: StatementSync;
  REMOVE_PLAYER_WHITELIST: StatementSync;

  constructor(path = './db/database.sqlite3') {
    this.db = new DatabaseSync(path);
    // this.init();
    this.IMPORT_WHITELIST = this.db.prepare(
      'insert or ignore into players (minecraft_uuid) values (?)'
    );
    this.GET_PLAYER_BY_DISCORD = this.db.prepare(
      'select * from players where discord_id = ?'
    );
    this.GET_PLAYER_BY_UUID = this.db.prepare(
      'select * from players where minecraft_uuid = ?'
    );
    this.WHITELIST_PLAYER = this.db.prepare(
      'insert into players (discord_id, minecraft_uuid) values (?, ?)'
    );
    this.CLAIM_WHITELIST = this.db.prepare(
      'update players set discord_id = ? where minecraft_uuid = ?'
    );
    this.REMOVE_PLAYER_WHITELIST = this.db.prepare(
      'delete from players where discord_id = ?'
    );
  }

  // init() {
  //   this.db.exec(`
  //     create table if not exists users (
  //       id integer primary key,
  //       minecraft_uuid char(32) unique not null,
  //       discord_id text unique
  //     )
  //   `);
  // }

  importWhitelist(players: Player[]) {
    this.db.exec('begin transaction');

    try {
      for (const player of players) {
        if (!player.id) {
          console.warn(
            'got a player with no uuid in whitelist import:',
            player
          );
          continue;
        }

        this.IMPORT_WHITELIST.run(player.id);
      }

      this.db.exec('commit');
    } catch (err) {
      console.error('failed to import whitelist:', err);
      this.db.exec('rollback');
    }
  }

  getPlayerByDiscord(discordID: string): PlayerRow | undefined {
    const player = this.GET_PLAYER_BY_DISCORD.get(discordID);
    if (!player) {
      return;
    }

    return {
      id: Number(player.id!),
      discord_id: player.discord_id as string | undefined,
      minecraft_uuid: player.minecraft_uuid as string,
    };
  }

  whitelistPlayer(discordID: string, minecraftUUID: string) {
    const inDB = this.GET_PLAYER_BY_UUID.get(minecraftUUID);
    if (inDB && !inDB.discord_id) {
      this.CLAIM_WHITELIST.run(discordID, minecraftUUID);
      return;
    }

    this.WHITELIST_PLAYER.run(discordID, minecraftUUID);
  }

  unwhitelistPlayer(discordID: string) {
    this.REMOVE_PLAYER_WHITELIST.run(discordID);
  }
}
