export type JsonRpcID = string | number;

export type JsonRpcRequest<Method extends string, Params extends unknown[]> = {
  jsonrpc: '2.0';
  method: Method;
  params: Params;
  id: JsonRpcID;
};

export type JsonRpcNotification<
  Method extends string,
  Params extends unknown[],
> = Omit<JsonRpcRequest<Method, Params>, 'id'>;

export type JsonRpcError = {
  error: {
    code: number;
    message: string;
    data: unknown;
  };
};

export type JsonRpcSuccess<Result> = {
  result: Result;
};

export type JsonRpcResponse<Result> = {
  jsonrpc: '2.0';
  id: JsonRpcID;
} & (JsonRpcError | JsonRpcSuccess<Result>);
