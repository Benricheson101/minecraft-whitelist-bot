export const keyToDER = (key: string) =>
  Buffer.concat([
    Buffer.from([
      0x30, 0x2a, // 42 byte sequence

      0x30, 0x05, // 5 byte oid
      0x06, 0x03, 0x2b, 0x65, 0x70, // oid

      0x03, 0x21, // 33 byte string (32 byte key + 0x00 unused bits)
      0x00,
    ]),
    Buffer.from(key, 'hex'),
  ]);
