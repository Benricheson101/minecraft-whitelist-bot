import assert from 'node:assert';
import {createPublicKey, verify} from 'node:crypto';
import {createServer} from 'node:http';

import type {
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
} from 'discord-api-types/v10';

import {Database} from './db';
import {ManagementServer} from './mgmt';
import {getMinecraftPlayer, keyToDER} from './util';

const PUBKEY = process.env.DISCORD_PUBKEY!;
const DATABASE_URL = process.env.DATABASE_URL!;

const db = new Database(DATABASE_URL.replace(/^sqlite:/, ''));

const mgmt = new ManagementServer(
  process.env.MGMT_SERVER!,
  process.env.MGMT_AUTH!
);

mgmt.onNotification = n => {
  console.log('got a notification:', n.method);
};

mgmt.waitConnect().then(server => {
  server.allowlist().then(al => {
    console.log('Syncing whitelist database');
    db.importWhitelist(al);
  });
});

const verifyKey = createPublicKey({
  format: 'der',
  type: 'spki',
  key: keyToDER(PUBKEY),
});

const InteractionType = {
  Ping: 1,
  ApplicationCommand: 2,
  MessageComponent: 3,
  ApplicationCommandAutocomplete: 4,
  ModalSubmit: 5,
} as const;

const InteractionResponseType = {
  Pong: 1,
  ChannelMessageWithSource: 4,
  DeferredChannelMessageWithSource: 5,
  DeferredMessageUpdate: 6,
  UpdateMessage: 7,
  ApplicationCommandAutocompleteResult: 8,
} as const;

const httpServer = createServer(async (req, res) => {
  const sendMsg = (msg: APIInteractionResponseCallbackData, ephemeral = true) =>
    res
      .setHeader('content-type', 'application/json')
      .writeHead(200)
      .end(
        JSON.stringify(<APIInteractionResponse>{
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            ...msg,
            flags: ephemeral ? 64 : 0,
          },
        })
      );

  switch (req.url || '/') {
    case '/i': {
      if (req.method !== 'POST') {
        res.writeHead(405).end();
        return;
      }

      const body = await Array.fromAsync(req).then(a => a.join(''));
      const sig = req.headersDistinct['x-signature-ed25519']?.[0] || '';
      const ts = req.headersDistinct['x-signature-timestamp']?.[0] || '';

      const isVerified = verify(
        null,
        Buffer.from(ts + body, 'utf8'),
        verifyKey,
        Buffer.from(sig, 'hex')
      );

      if (!isVerified) {
        console.error('failed to verify request');
        res.writeHead(401).end();
        return;
      }

      const msg = JSON.parse(body) as APIInteraction;
      console.dir(msg, {depth: null});

      switch (msg.type) {
        case InteractionType.Ping: {
          res
            .setHeader('Content-Type', 'application/json')
            .writeHead(200)
            .end('{"type": 1}');
          return;
        }

        case InteractionType.ApplicationCommand: {
          assert(msg.data.type === 1);

          switch (msg.data.name) {
            case 'whitelist': {
              switch (msg.data.options?.[0].name) {
                case 'add': {
                  assert(msg.data.options![0].type === 1);
                  const ign = msg.data.options![0].options!.find(
                    o => o.type === 3 && o.name === 'ign'
                  )!.value as string;

                  const inDB = db.getPlayerByDiscord(msg.member!.user.id);
                  if (inDB) {
                    sendMsg({
                      content:
                        ':x: You already have an account whitelisted on the server.',
                    });
                    return;
                  }

                  const addedRes = await mgmt.allowlistAdd([{name: ign}]);
                  const added = addedRes.find(
                    r => r.name?.toLowerCase() === ign.toLowerCase()
                  );
                  if (!added) {
                    sendMsg({
                      content:
                        ':x: Failed to whitelist player. Double check the spelling and try again.',
                    });
                    return;
                  }

                  db.whitelistPlayer(msg.member!.user.id, added.id!);

                  sendMsg({
                    content: `:white_check_mark: Added \`${ign}\` to the server whitelist.`,
                  });

                  return;
                }

                case 'remove': {
                  assert(msg.data.options![0].type === 1);
                  // const ign = msg.data.options![0].options!.find(
                  //   o => o.type === 3 && o.name === 'ign'
                  // )?.value as string | undefined;

                  const player = db.getPlayerByDiscord(msg.member!.user.id);
                  if (!player) {
                    sendMsg({
                      content:
                        ":x: You don't have an account whitelisted on the server.",
                    });
                    return;
                  }

                  const mcPlayer = await getMinecraftPlayer(
                    player.minecraft_uuid
                  );

                  // if (!ign) {
                  const rmvd = await mgmt.allowlistRemove([
                    {id: player.minecraft_uuid},
                  ]);
                  const didRemove = !rmvd.some(
                    r => r.id! === player.minecraft_uuid
                  );

                  if (didRemove) {
                    db.unwhitelistPlayer(msg.member!.user.id);

                    sendMsg({
                      content: `:white_check_mark: Removed \`${mcPlayer.ign}\` from the whitelist.`,
                    });
                    return;
                  }

                  console.log({rmvd});
                  return;
                  // }
                }
              }

              return;
            }
          }

          break;
        }
      }

      res.writeHead(500).end();
      return;
    }

    default: {
      res.writeHead(404).end();
      return;
    }
  }
});

httpServer.listen(3500, () => {
  console.log('listening on http://localhost:3500');
});
