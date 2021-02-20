export interface INoteDB {
  id: number;
  UserID: number;
  KeyID: number;
  Type: number;
  Title: string;
  Image: string;
  AlbumID: number;
  Created: string;
}

export interface INotesDB {
  [index: number]: INoteDB;

  map: (event: object) => INoteResponse;
}

export interface INoteResponse {
  Id: number;
  UserId: number;
  PostId: number;
  Type: number;
  Title: string;
  Image: string;
  AlbumID: number;
  Created: number;
}

export interface INoteResponseSuccess {
  List: INoteResponse;
  isError: false;
}

export interface INoteResponseError {
  List: Array<INoteResponse>;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface INoteProps {
  UserId: number;
  Limit: number;
}
