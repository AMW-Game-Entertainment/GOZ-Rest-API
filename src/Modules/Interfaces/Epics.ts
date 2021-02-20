export interface IType {
  type: string;
}

export interface INewSocketIdResponse {
  msg: object;
  isError: boolean;
  SocketId?: string;
}

interface SocketOptionalData {
  SocketId?: string;
  UseSocketId?: boolean;
  MultipleClients?: boolean;
}

export interface IMiddlewareSocketData {
  type: string;
  payload?: SocketOptionalData;
}

export interface IPropsSocketId {
  type: string;
  payload: any;
}
