/*
 * Minecraft Management API
 * Generated from OpenRPC schema
 */

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export type GameType = 'survival' | 'creative' | 'adventure' | 'spectator';

export type Player = {
  name?: string;
  id?: string;
};

export type Version = {
  protocol?: number;
  name?: string;
};

export type ServerState = {
  players?: Player[];
  started?: boolean;
  version?: Version;
};

export type UserBan = {
  reason?: string;
  expires?: string;
  source?: string;
  player?: Player;
};

export type IPBan = {
  reason?: string;
  expires?: string;
  ip?: string;
  source?: string;
};

export type IncomingIPBan = {
  reason?: string;
  expires?: string;
  ip?: string;
  source?: string;
  player?: Player;
};

export type Message = {
  translatable?: string;
  translatableParams?: string[];
  literal?: string;
};

export type SystemMessage = {
  receivingPlayers?: Player[];
  overlay?: boolean;
  message?: Message;
};

export type KickPlayer = {
  message?: Message;
  player?: Player;
};

export type Operator = {
  permissionLevel?: number;
  bypassesPlayerLimit?: boolean;
  player?: Player;
};

export type UntypedGameRule = {
  value?: boolean | number;
  key?: string;
};

export type TypedGameRule = {
  type?: 'integer' | 'boolean';
  value?: boolean | number;
  key?: string;
};

export type MinecraftRequestMap = {
  /** Get the allowlist */
  'minecraft:allowlist': {
    params: [];
    result: Player[];
  };

  /** Set the allowlist */
  'minecraft:allowlist/set': {
    params: [players: Player[]];
    result: Player[];
  };

  /** Add players to allowlist */
  'minecraft:allowlist/add': {
    params: [add: Player[]];
    result: Player[];
  };

  /** Remove players from allowlist */
  'minecraft:allowlist/remove': {
    params: [remove: Player[]];
    result: Player[];
  };

  /** Clear all players in allowlist */
  'minecraft:allowlist/clear': {
    params: [];
    result: Player[];
  };

  /** Get the ban list */
  'minecraft:bans': {
    params: [];
    result: UserBan[];
  };

  /** Set the banlist */
  'minecraft:bans/set': {
    params: [bans: UserBan[]];
    result: UserBan[];
  };

  /** Add players to ban list */
  'minecraft:bans/add': {
    params: [add: UserBan[]];
    result: UserBan[];
  };

  /** Remove players from ban list */
  'minecraft:bans/remove': {
    params: [remove: Player[]];
    result: UserBan[];
  };

  /** Clear all players in ban list */
  'minecraft:bans/clear': {
    params: [];
    result: UserBan[];
  };

  /** Get the ip ban list */
  'minecraft:ip_bans': {
    params: [];
    result: IPBan[];
  };

  /** Set the ip banlist */
  'minecraft:ip_bans/set': {
    params: [banlist: IPBan[]];
    result: IPBan[];
  };

  /** Add ip to ban list */
  'minecraft:ip_bans/add': {
    params: [add: IncomingIPBan[]];
    result: IPBan[];
  };

  /** Remove ip from ban list */
  'minecraft:ip_bans/remove': {
    params: [ip: string[]];
    result: IPBan[];
  };

  /** Clear all ips in ban list */
  'minecraft:ip_bans/clear': {
    params: [];
    result: IPBan[];
  };

  /** Get all connected players */
  'minecraft:players': {
    params: [];
    result: Player[];
  };

  /** Kick players */
  'minecraft:players/kick': {
    params: [kick: KickPlayer[]];
    result: Player[];
  };

  /** Get all oped players */
  'minecraft:operators': {
    params: [];
    result: Operator[];
  };

  /** Set all oped players */
  'minecraft:operators/set': {
    params: [operators: Operator[]];
    result: Operator[];
  };

  /** Op players */
  'minecraft:operators/add': {
    params: [add: Operator[]];
    result: Operator[];
  };

  /** Deop players */
  'minecraft:operators/remove': {
    params: [remove: Player[]];
    result: Operator[];
  };

  /** Deop all players */
  'minecraft:operators/clear': {
    params: [];
    result: Operator[];
  };

  /** Get server status */
  'minecraft:server/status': {
    params: [];
    result: ServerState;
  };

  /** Save server state */
  'minecraft:server/save': {
    params: [flush: boolean];
    result: boolean;
  };

  /** Stop server */
  'minecraft:server/stop': {
    params: [];
    result: boolean;
  };

  /** Send a system message */
  'minecraft:server/system_message': {
    params: [message: SystemMessage];
    result: boolean;
  };

  /** Get whether automatic world saving is enabled on the server */
  'minecraft:serversettings/autosave': {
    params: [];
    result: boolean;
  };

  /** Enable or disable automatic world saving on the server */
  'minecraft:serversettings/autosave/set': {
    params: [enable: boolean];
    result: boolean;
  };

  /** Get the current difficulty level of the server */
  'minecraft:serversettings/difficulty': {
    params: [];
    result: Difficulty;
  };

  /** Set the difficulty level of the server */
  'minecraft:serversettings/difficulty/set': {
    params: [difficulty: Difficulty];
    result: Difficulty;
  };

  /** Get whether allowlist enforcement is enabled */
  'minecraft:serversettings/enforce_allowlist': {
    params: [];
    result: boolean;
  };

  /** Enable or disable allowlist enforcement */
  'minecraft:serversettings/enforce_allowlist/set': {
    params: [enforce: boolean];
    result: boolean;
  };

  /** Get whether the allowlist is enabled on the server */
  'minecraft:serversettings/use_allowlist': {
    params: [];
    result: boolean;
  };

  /** Enable or disable the allowlist on the server */
  'minecraft:serversettings/use_allowlist/set': {
    params: [use: boolean];
    result: boolean;
  };

  /** Get the maximum number of players allowed to connect to the server */
  'minecraft:serversettings/max_players': {
    params: [];
    result: number;
  };

  /** Set the maximum number of players allowed to connect to the server */
  'minecraft:serversettings/max_players/set': {
    params: [max: number];
    result: number;
  };

  /** Get the number of seconds before the game is automatically paused when no players are online */
  'minecraft:serversettings/pause_when_empty_seconds': {
    params: [];
    result: number;
  };

  /** Set the number of seconds before the game is automatically paused when no players are online */
  'minecraft:serversettings/pause_when_empty_seconds/set': {
    params: [seconds: number];
    result: number;
  };

  /** Get the number of seconds before idle players are automatically kicked from the server */
  'minecraft:serversettings/player_idle_timeout': {
    params: [];
    result: number;
  };

  /** Set the number of seconds before idle players are automatically kicked from the server */
  'minecraft:serversettings/player_idle_timeout/set': {
    params: [seconds: number];
    result: number;
  };

  /** Get whether flight is allowed for players in Survival mode */
  'minecraft:serversettings/allow_flight': {
    params: [];
    result: boolean;
  };

  /** Allow or disallow flight for players in Survival mode */
  'minecraft:serversettings/allow_flight/set': {
    params: [allow: boolean];
    result: boolean;
  };

  /** Get the server's message of the day displayed to players */
  'minecraft:serversettings/motd': {
    params: [];
    result: string;
  };

  /** Set the server's message of the day displayed to players */
  'minecraft:serversettings/motd/set': {
    params: [message: string];
    result: string;
  };

  /** Get the spawn protection radius in blocks */
  'minecraft:serversettings/spawn_protection_radius': {
    params: [];
    result: number;
  };

  /** Set the spawn protection radius in blocks */
  'minecraft:serversettings/spawn_protection_radius/set': {
    params: [radius: number];
    result: number;
  };

  /** Get whether players are forced to use the server's default game mode */
  'minecraft:serversettings/force_game_mode': {
    params: [];
    result: boolean;
  };

  /** Enable or disable forcing players to use the server's default game mode */
  'minecraft:serversettings/force_game_mode/set': {
    params: [force: boolean];
    result: boolean;
  };

  /** Get the server's default game mode */
  'minecraft:serversettings/game_mode': {
    params: [];
    result: GameType;
  };

  /** Set the server's default game mode */
  'minecraft:serversettings/game_mode/set': {
    params: [mode: GameType];
    result: GameType;
  };

  /** Get the server's view distance in chunks */
  'minecraft:serversettings/view_distance': {
    params: [];
    result: number;
  };

  /** Set the server's view distance in chunks */
  'minecraft:serversettings/view_distance/set': {
    params: [distance: number];
    result: number;
  };

  /** Get the server's simulation distance in chunks */
  'minecraft:serversettings/simulation_distance': {
    params: [];
    result: number;
  };

  /** Set the server's simulation distance in chunks */
  'minecraft:serversettings/simulation_distance/set': {
    params: [distance: number];
    result: number;
  };

  /** Get whether the server accepts player transfers from other servers */
  'minecraft:serversettings/accept_transfers': {
    params: [];
    result: boolean;
  };

  /** Enable or disable accepting player transfers from other servers */
  'minecraft:serversettings/accept_transfers/set': {
    params: [accept: boolean];
    result: boolean;
  };

  /** Get the interval in seconds between server status heartbeats */
  'minecraft:serversettings/status_heartbeat_interval': {
    params: [];
    result: number;
  };

  /** Set the interval in seconds between server status heartbeats */
  'minecraft:serversettings/status_heartbeat_interval/set': {
    params: [seconds: number];
    result: number;
  };

  /** Get default operator permission level */
  'minecraft:serversettings/operator_user_permission_level': {
    params: [];
    result: number;
  };

  /** Set default operator permission level */
  'minecraft:serversettings/operator_user_permission_level/set': {
    params: [level: number];
    result: number;
  };

  /** Get whether the server hides online player information from status queries */
  'minecraft:serversettings/hide_online_players': {
    params: [];
    result: boolean;
  };

  /** Enable or disable hiding online player information from status queries */
  'minecraft:serversettings/hide_online_players/set': {
    params: [hide: boolean];
    result: boolean;
  };

  /** Get whether the server responds to connection status requests */
  'minecraft:serversettings/status_replies': {
    params: [];
    result: boolean;
  };

  /** Enable or disable the server responding to connection status requests */
  'minecraft:serversettings/status_replies/set': {
    params: [enable: boolean];
    result: boolean;
  };

  /** Get the entity broadcast range as a percentage */
  'minecraft:serversettings/entity_broadcast_range': {
    params: [];
    result: number;
  };

  /** Set the entity broadcast range as a percentage */
  'minecraft:serversettings/entity_broadcast_range/set': {
    params: [percentage_points: number];
    result: number;
  };

  /** Get the available game rule keys and their current values */
  'minecraft:gamerules': {
    params: [];
    result: TypedGameRule[];
  };

  /** Update game rule value */
  'minecraft:gamerules/update': {
    params: [gamerule: UntypedGameRule];
    result: TypedGameRule;
  };
};

export type MinecraftNotificationMap = {
  /** Server started */
  'minecraft:notification/server/started': [];

  /** Server shutting down */
  'minecraft:notification/server/stopping': [];

  /** Server save started */
  'minecraft:notification/server/saving': [];

  /** Server save completed */
  'minecraft:notification/server/saved': [];

  /** Server activity occurred. Rate limited to 1 notification per 30 seconds */
  'minecraft:notification/server/activity': [];

  /** Player joined */
  'minecraft:notification/players/joined': [player: Player];

  /** Player left */
  'minecraft:notification/players/left': [player: Player];

  /** Player was oped */
  'minecraft:notification/operators/added': [player: Operator];

  /** Player was deoped */
  'minecraft:notification/operators/removed': [player: Operator];

  /** Player was added to allowlist */
  'minecraft:notification/allowlist/added': [player: Player];

  /** Player was removed from allowlist */
  'minecraft:notification/allowlist/removed': [player: Player];

  /** Ip was added to ip ban list */
  'minecraft:notification/ip_bans/added': [player: IPBan];

  /** Ip was removed from ip ban list */
  'minecraft:notification/ip_bans/removed': [player: string];

  /** Player was added to ban list */
  'minecraft:notification/bans/added': [player: UserBan];

  /** Player was removed from ban list */
  'minecraft:notification/bans/removed': [player: Player];

  /** Gamerule was changed */
  'minecraft:notification/gamerules/updated': [gamerule: TypedGameRule];

  /** Server status heartbeat */
  'minecraft:notification/server/status': [status: ServerState];
};
