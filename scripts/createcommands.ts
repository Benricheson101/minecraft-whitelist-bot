import type {RESTPutAPIApplicationCommandsJSONBody} from 'discord-api-types/v10';

const ApplicationCommandOptionType = {
  Subcommand: 1,
  SubcommandGroup: 2,
  String: 3,
  Integer: 4,
  Boolean: 5,
  User: 6,
  Channel: 7,
  Role: 8,
  Mentionable: 9,
  Number: 10,
  Attachment: 11,
} as const;

const commands: RESTPutAPIApplicationCommandsJSONBody = [
  {
    name: 'whitelist',
    description: 'Minecraft server whitelist command',
    contexts: [0], // guild only
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'add',
        description: 'Add a player to the server whitelist',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'ign',
            description: 'Minecraft username',
            required: true,
          },
        ],
      },

      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'remove',
        description: 'Remove yourself from the server whitelist',
        // options: [
        //   {
        //     type: ApplicationCommandOptionType.String,
        //     name: 'ign',
        //     description: 'Minecraft username. Leave blank to remove yourself',
        //     required: false,
        //   },
        // ],
      },
    ],
  },
];

console.log(JSON.stringify(commands, null, 2))

const discordToken = process.env.DISCORD_TOKEN!;

const discordID = Buffer.from(discordToken.split('.')[0], 'base64').toString(
  'utf8'
);

fetch(`https://discord.com/api/v10/applications/${discordID}/commands`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${discordToken}`,
  },
  body: JSON.stringify(commands),
})
  .then(a => a.json())
  .then(d => console.dir(d, {depth: null}));
