import {
  IUploadFileResponse
} from "./";
import {
  CommentModel, PostModel
} from "../../Constants";
export interface ICommentDB {
  id: number;
  UserID: number;
  Comment: string;
  Type: PostModel.Picture | PostModel.Album | PostModel.Status | PostModel.Video;
  Images: string[];
  KeyID: number;
  Char_Name: string;
  Profile_Image: string;
  Cover_Image: string;
  Created: string;
}

export interface ICommentsDB {
  map(arg0: (Comment: ICommentDB) => IGetCommentsResponse): IGetCommentsResponse[];
  [index: number]: ICommentDB;
}

export interface IGetCommentsResponse {
  Id: number;
  PostId: number;
  PostType: PostModel.Picture | PostModel.Album | PostModel.Status | PostModel.Video;
  Type: CommentModel.Comment | CommentModel.CommentPicture;
  Text: string;
  Profile: {
    Char_Name: string;
    Profile_Image: string;
    Cover_Image: string;
    UserId: number;
  };
  Created: number;
}

export interface IGetCommentsResponseSuccess {
  List: Array<IGetCommentsResponse>;
  PostId: number;
  PostType: PostModel.Picture | PostModel.Album | PostModel.Status | PostModel.Video;
  FirstCommentId: number;
  isError: false;
}

export interface IGetCommentsResponseError {
  List: object[];
  PostId: number;
  PostType: PostModel.Picture | PostModel.Album | PostModel.Status | PostModel.Video;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IGetCommentsProps {
  PostId: number;
  PostType: PostModel.Album | PostModel.Picture | PostModel.Status | PostModel.Video;
  LastId: number;
  isPaginition: boolean;
  Limit: number;
}

export interface IAddCommentProps {
  PostId: number;
  PostType: PostModel.Album | PostModel.Picture | PostModel.Status | PostModel.Video;
  Text: string;
  Images: IUploadFileResponse[];
  CurrentFirstId: number;
  SocketId: string;
  Limit: number;
  UserId: number;
}

export interface IAddCommentResponseSuccess {
  List: Array<IGetCommentsResponse>;
  FirstCommentId: number;
  PostId: number;
  PostType: number;
  isError: false;
}

export interface IAddCommentResponseError {
  List: object[];
  PostId: number;
  PostType: PostModel.Album | PostModel.Picture | PostModel.Status | PostModel.Video;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IDeleteCommentProps {
  CommentId: number;
  PostType: PostModel.Album | PostModel.Picture | PostModel.Status | PostModel.Video;
  CommentType: CommentModel.Comment | CommentModel.CommentPicture;
  CurrentFirstId: number;
  Limit: number;
  PostId: number;
}

export interface IDeleteCommentResponseSuccess {
  List: Array<IGetCommentsResponse>;
  FirstCommentId: number;
  PostId: number;
  PostType: PostModel.Album | PostModel.Picture | PostModel.Status | PostModel.Video;
  isError: false;
}

export interface IDeleteCommentResponseError {
  List: object[];
  PostId: number;
  PostType: PostModel.Album | PostModel.Picture | PostModel.Status | PostModel.Video;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IGetImageProps {
  CommentId: number;
}