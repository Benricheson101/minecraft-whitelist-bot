import {inspect} from 'node:util';

import type {
  JsonRpcError,
  JsonRpcID,
  JsonRpcNotification,
  JsonRpcRequest,
  JsonRpcResponse,
} from './jsonrpc';
import type {MinecraftNotificationMap, MinecraftRequestMap} from './schema';

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: type fuckery
export class ManagementServer {
  #awaitingResponse = new Map<
    JsonRpcID,
    {
      resolve(
        result: MinecraftRequestMap[keyof MinecraftRequestMap]['result']
      ): void;
      reject(error: JsonRpcError['error']): void;
    }
  >();
  #nextID = 0;
  #ws: WebSocket;
  private isConnected: Promise<undefined>;

  public onNotification = (_: MinecraftNotification) => {};

  constructor(url: string, apiKey: string) {
    const {promise, resolve: setIsConnected} =
      Promise.withResolvers<undefined>();
    this.isConnected = promise;

    this.#ws = new WebSocket(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    this.#ws.onopen = async () => {
      console.log('connected');
      setIsConnected(undefined);
    };

    this.#ws.onmessage = ({data}) => {
      const msg = JSON.parse(data.toString()) as
        | MinecraftResponse
        | MinecraftNotification;

      if ('id' in msg) {
        if (this.#awaitingResponse.has(msg.id)) {
          const {resolve, reject} = this.#awaitingResponse.get(msg.id)!;
          this.#awaitingResponse.delete(msg.id);

          if ('error' in msg) {
            reject(msg.error);
          } else {
            resolve(msg.result);
          }
        } else {
          console.error('unhandled message:', inspect(msg, false, null, true));
        }
      } else {
        this.onNotification?.(msg);
      }
    };

    // biome-ignore lint/correctness/noConstructorReturn: proxy is okay
    return new Proxy(this, {
      get: (target, prop: string | symbol, receiver) => {
        if (prop === 'then') {
          return undefined;
        }

        if (typeof prop === 'string' && !(prop in target)) {
          const methodName = this.#convertMethodName(prop);

          return (...params: any[]) =>
            this.send(
              methodName,
              ...(params as MinecraftRequest[typeof methodName]['params'])
            );
        }

        return Reflect.get(target, prop, receiver);
      },
    });
  }

  async waitConnect(): Promise<typeof this> {
    await this.isConnected;
    return this;
  }

  #convertMethodName(name: string): keyof MinecraftRequestMap {
    const path = name.replace(/[A-Z]/g, a => `/${a.toLowerCase()}`);
    return `minecraft:${path}` as keyof MinecraftRequestMap;
  }

  async send<Method extends keyof MinecraftRequest>(
    method: Method,
    ...params: MinecraftRequest[Method]['params']
  ): Promise<MinecraftRequestMap[Method]['result']> {
    this.#ws.send(
      JSON.stringify(<JsonRpcRequest<Method, typeof params>>{
        jsonrpc: '2.0',
        id: this.#nextID,
        method: method,
        params: params,
      })
    );

    const {promise, ...rest} =
      Promise.withResolvers<MinecraftRequestMap[Method]['result']>();
    this.#awaitingResponse.set(this.#nextID++, rest);

    return promise;
  }

  async whitelistUser(username: string) {
    return this.send('minecraft:allowlist/add', [{name: username}]);
  }
}

type RemoveMinecraftPrefix<S extends string> = S extends `minecraft:${infer R}`
  ? R
  : S;

type MinecraftRequestMethod = {
  [Method in keyof MinecraftRequestMap as PathToCamel<
    RemoveMinecraftPrefix<Method>
  >]: (
    ...params: MinecraftRequestMap[Method]['params']
  ) => Promise<MinecraftRequestMap[Method]['result']>;
};

type PathToCamel<S extends string> = S extends `${infer Head}/${infer Tail}`
  ? `${Head}${Capitalize<PathToCamel<Tail>>}`
  : S;

export interface ManagementServer extends MinecraftRequestMethod {}

export type MinecraftRequest = {
  [Method in keyof MinecraftRequestMap]: JsonRpcRequest<
    Method,
    MinecraftRequestMap[Method]['params']
  >;
};

export type MinecraftResponse = {
  [Method in keyof MinecraftRequestMap]: JsonRpcResponse<
    MinecraftRequestMap[Method]['result']
  >;
}[keyof MinecraftRequestMap];

export type MinecraftNotification = {
  [Method in keyof MinecraftNotificationMap]: JsonRpcNotification<
    Method,
    MinecraftNotificationMap[Method]
  >;
}[keyof MinecraftNotificationMap];
