import {ManagementServer} from './mcsmp';

const server = new ManagementServer(
  process.env.MGMT_SERVER!,
  process.env.MGMT_AUTH!,
);

server.onNotification = n => {
  console.log('got a notification:', n.method);
}

server.waitConnect().then(server => {
  server.allowlistAdd([{name: 'ActuallyPanda'}]).then(console.log);
});
