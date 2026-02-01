// import {ManagementServer} from './mcsmp';
//
// const server = new ManagementServer(
//   process.env.MGMT_SERVER!,
//   process.env.MGMT_AUTH!,
// );
//
// server.onNotification = n => {
//   console.log('got a notification:', n.method);
// }
//
// server.waitConnect().then(server => {
//   server.allowlistAdd([{name: 'ActuallyPanda'}]).then(console.log);
// });

import {createPublicKey, verify} from 'node:crypto';
import {createServer} from 'node:http';

import type {APIInteraction} from 'discord-api-types/v10';

import {keyToDER} from './util';

const PUBKEY = process.env.DISCORD_PUBKEY!;

const verifyKey = createPublicKey({
  format: 'der',
  type: 'spki',
  key: keyToDER(PUBKEY),
});

const server = createServer(async (req, res) => {
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

      if (msg.type === 1) {
        res
          .setHeader('Content-Type', 'application/json')
          .writeHead(200)
          .end('{"type": 1}');
        return;
      }

      res.writeHead(200).end();
      return;
    }

    default: {
      res.writeHead(404).end();
      return;
    }
  }
});

server.listen(3500, () => {
  console.log('listening on http://localhost:3500');
});
