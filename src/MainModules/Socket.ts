import * as SocketIo from "socket.io";
import { Routes } from "../Constants";
import { Session, SocketEpicMiddleware } from "../MainModules";
import { ISocketMap, ISocketProps } from "../Modules/Interfaces/Socket";
import { SocketUtil } from "../Utils";
class Socket {
  private static SocketMap: Map<string | number, ISocketMap>;
  private static IO: any;

  constructor() {
    Socket.SocketMap = new Map();
    Socket.setSocketMap("Clients", {});
  }

  static setSocketMap(key: string | number, value: any): void {
    this.SocketMap.set(key, value);
  }

  static getSocketMap(key: string | number): any {
    return this.SocketMap.get(key);
  }

  static Listen(Server: any): void {
    this.IO = SocketIo.listen(Server, {
      "heartbeat interval": 5,
      "heartbeat timeout": 10
    });
  }

  static getClients(): any {
    return this.getSocketMap("Clients") || {};
  }

  static getClient(Id: string): Array<any> {
    const UserClients = this.getSocketMap("Clients") || {};
    return UserClients[Id] || [];
  }
  static async setClient(Id: string, Client: any) {
    console.log(
      `Set new client :: SocketId ${String(Id)} Client ID => ${Client.id}`
    );
    const UserCls = {
      ...(this.getClients() || {}),
      [String(Id)]: [...this.getClient(Id) || [], Client]
    };

    this.setSocketMap("Clients", UserCls);

    this.removeDisconnectedClients(Id);

    return await Id;
  }

  static removeDisconnectedClients(Id: string): void {
    const UsersClients = this.getClients();
    Object.keys(UsersClients).map(UserClients => {
      const UserClientsList = UsersClients[UserClients];
      UserClientsList.forEach((ClientsList, index) => {
        const Client = UserClientsList[index];
        if (Client.disconnected) {
          console.log(
            `Disconnected Client => ${Client.id} :: Will be removed from list`
          );
          const NewCli = this.getClient(Id).splice(index, 1);
          this.setSocketMap("Clients", {
            ...(this.getClients() || []),
            [Id]: NewCli
          });
        }
      });
    });
  }

  static async makeSocketID(Client: any) {
    const SocketId = await SocketUtil.MakeSocketId();

    if (!Object.keys(Socket.getClient(SocketId)).length) {
      await Socket.setClient(SocketId, Client);
      await Session.setUser(SocketId);
      return await SocketId;
    } else if (Socket.getClient(SocketId).length > 0) {
      // repeat same process until u get unique game socket id
      await Socket.makeSocketID(Client);
    }
  }

  static async emitTo(Id: string, topic: string, msg: object) {
    const UserClients = await Socket.getClient(Id);
    UserClients.forEach(async (Client: any, Index: number) => {
      const CurrentClient = Client[Index] || Client;
      console.log(
        `Send to client ::  SocketId ${Id} Client ID => ${
          CurrentClient.id
        } Msg => ${msg}`
      );
      if (CurrentClient) {
        await CurrentClient.emit(topic, msg);
      }
    });
  }

  static getSocket(): any {
    return this.IO;
  }

  static initSocket({ Server }: ISocketProps) {
    this.SocketMap = new Map();
    const { API, Connection } = Routes.Socket;

    this.Listen(Server);
    // ON SOCKET CONNECTION
    // SEND OVER THE RESOURCES
    this.IO.on(Connection, (Client: any) => {
      console.log("Client Init"); // CONNECT CLIENT

      Client.on(API, (data: any) => {
        SocketEpicMiddleware(Client, data);
        console.log("WS message => ", data); // CONNECT CLIENT
      });
      // Client.on(Disconnected, (ws: any) => {
      //   this.removeDisconnectedClients(ws.SocketId);
      // });
    });
  }
}

export default Socket;
