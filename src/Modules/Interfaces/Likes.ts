export interface ILikeDB {
  id: number;
  UserID: number;
  Type: number;
  KeyID: number;
  Char_Name: string;
  Profile_Image: string;
  Cover_Image: string;
  Created: string;
}

export interface ILikesDB {
  map(arg0: (Like: ILikeDB) => IGetLikesResponse): IGetLikesResponse[];
  [index: number]: ILikeDB;
}

export interface IGetLikesResponse {
  Id: number;
  PostId: number;
  Type: number;
  Profile: {
    Char_Name: string;
    Profile_Image: string;
    Cover_Image: string;
    UserId: number;
  };
  Created: number;
}

export interface IGetLikesResponseSuccess {
  List: Array<IGetLikesResponse>;
  PostId: number;
  Type: number;
  isError: false;
}

export interface IGetLikesResponseError {
  List: object[];
  PostId: number;
  Type: number;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IGetLikesProps {
  PostId: number;
  Type: number;
  Limit: number;
}

export interface IAddLikeProps {
  PostId: number;
  Type: number;
  SocketId: string;
  UserId: number;
}

export interface IAddLikeResponseSuccess {
  List: Array<IGetLikesResponse>;
  PostId: number;
  Type: number;
  isError: false;
}

export interface IAddLikeResponseError {
  List: object[];
  PostId: number;
  Type: number;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IDeleteLikeProps {
  LikeId: number;
  Type: number;
  PostId: number;
}

export interface IDeleteLikeResponseSuccess {
  List: Array<IGetLikesResponse>;
  PostId: number;
  Type: number;
  isError: false;
}

export interface IDeleteLikeResponseError {
  List: object[];
  PostId: number;
  Type: number;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IDeleteLikesProps {
  KeyId: number;
  Type: number;
}