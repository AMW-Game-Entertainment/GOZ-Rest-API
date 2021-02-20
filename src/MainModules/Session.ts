import { ISessionMap } from "../Modules/Interfaces";

class Session {
  private static SessionMap: Map<string | number, ISessionMap>;
  constructor() {
    Session.SessionMap = new Map();
  }

  static initSessionHeaders() {
    Session.SessionMap = new Map();
  }

  static setSessionMap(key: string | number, value: any): void {
    this.SessionMap.set(key, value);
  }

  static getSessionMap(key: string | number): any {
    return this.SessionMap.get(key) || {};
  }
  // IS LOGGED
  static setIsLogged(SocketId: string, isLogged: boolean) {
    this.setSessionMap(SocketId, {
      ...(this.getSessionMap(SocketId) || {}),
      isLogged
    });
  }

  static isLogged(SocketId: string) {
    const SMap = this.getSessionMap(SocketId);
    return SMap.isLogged || false;
  }

  // CHARACTER NAME
  static setCharacterName(SocketId: string, CharName: string) {
    this.setSessionMap(SocketId, {
      ...(this.getSessionMap(SocketId) || {}),
      CharName
    });
  }

  static getCharacterName(SocketId: string) {
    const SMap = this.getSessionMap(SocketId);
    return SMap.CharName || "";
  }

  // RANK
  static setRank(SocketId: string, Rank: number) {
    this.setSessionMap(SocketId, {
      ...(this.getSessionMap(SocketId) || {}),
      Rank
    });
  }

  static getRank(SocketId: string) {
    const SMap = this.getSessionMap(SocketId);
    return SMap.Rank || 0;
  }

  // EMAIL
  static setEmail(SocketId: string, Email: string) {
    this.setSessionMap(SocketId, {
      ...(this.getSessionMap(SocketId) || {}),
      Email
    });
  }

  static getEmail(SocketId: string) {
    const SMap = this.getSessionMap(SocketId);
    return SMap.Email || "";
  }

  // USERNAME
  static setUsername(SocketId: string, Username: string) {
    this.setSessionMap(SocketId, {
      ...(this.getSessionMap(SocketId) || {}),
      Username
    });
  }

  static getUsername(SocketId: string) {
    const SMap = this.getSessionMap(SocketId);
    return SMap.Username || "";
  }

  // USER ID
  static setUserID(SocketId: string, UserId: number) {
    this.setSessionMap(SocketId, {
      ...(this.getSessionMap(SocketId) || {}),
      UserId
    });
  }

  static getUserID(SocketId: string) {
    const SMap = this.getSessionMap(SocketId);
    return SMap.UserId || 0;
  }

  static setUser(SocketId: string) {
    if (!this.getSessionMap(SocketId)) {
      this.setSessionMap(SocketId, {});
    }
  }

  static removeUser(SocketId: string) {
    if (!this.getSessionMap(SocketId)) {
      this.SessionMap.delete(SocketId);
    }
  }

  static getSessionBySocketId(SocketId: string) {
    return {
      ...this.getSessionMap(SocketId),
      SocketId: SocketId
    };
  }
}

export default Session;
