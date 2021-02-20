import { DB, Session } from "../../MainModules";
import { DefineSQL, ErrorCodes } from "../../Constants";
import { DateUtil, UrlUtil } from "../../Utils";
import {
  IAddLikeProps,
  IAddLikeResponseError,
  IAddLikeResponseSuccess,
  IDeleteLikeProps,
  IDeleteLikeResponseError,
  IDeleteLikeResponseSuccess,
  IGetLikesProps,
  IGetLikesResponseError,
  IGetLikesResponseSuccess,
  IGetLikesResponse,
  IDeleteLikesProps,
  ILikesDB,
  ILikeDB
} from "../Interfaces";

const { ADD_LIKE, GET_LIKES, DELETE_LIKE, DELETE_LIKES } = DefineSQL;

class Like extends DB {
  constructor() {
    super();
  }

  private createLikesList = (Likes: ILikesDB): Array<IGetLikesResponse> =>
    Likes.map((Like: ILikeDB) => ({
      Id: Like.id,
      Type: Like.Type,
      PostId: Like.KeyID,
      Profile: {
        Char_Name: Like.Char_Name,
        Profile_Image: UrlUtil.toEndPoint(Like.Profile_Image),
        Cover_Image: UrlUtil.toEndPoint(Like.Cover_Image),
        UserId: Like.UserID
      },
      Created: DateUtil.ConvertDateToMilliseconds(Like.Created)
    }));

  private constructDeleteLikeSuccessRes = (
    likes: Array<IGetLikesResponse>,
    PostId: number,
    Type: number
  ): IDeleteLikeResponseSuccess => ({
    List: likes,
    PostId,
    Type,
    isError: false
  });

  public constructDeleteLikeErrorRes = (
    error: any,
    PostId: number,
    Type: number
  ): IDeleteLikeResponseError => ({
    List: [],
    PostId,
    Type,
    isError: true,
    ErrorCode: ErrorCodes.GetLikes,
    ErrorMessage: error
  });

  private constructAddLikeSuccessRes = (
    likes: Array<IGetLikesResponse>,
    PostId: number,
    Type: number
  ): IAddLikeResponseSuccess => ({
    List: likes,
    PostId,
    Type,
    isError: false
  });

  public constructAddLikeErrorRes = (
    error: any,
    PostId: number,
    Type: number
  ): IAddLikeResponseError => ({
    List: [],
    PostId,
    Type,
    isError: true,
    ErrorCode: ErrorCodes.GetLikes,
    ErrorMessage: error
  });

  private constructGetLikesSuccessRes = (
    likes: Array<IGetLikesResponse>,
    PostId: number,
    Type: number
  ): IGetLikesResponseSuccess => ({
    List: likes,
    PostId,
    Type,
    isError: false
  });

  public constructGetLikesErrorRes = (
    error: any,
    PostId: number,
    Type: number
  ): IGetLikesResponseError => ({
    List: [],
    PostId,
    Type,
    isError: true,
    ErrorCode: ErrorCodes.GetLikes,
    ErrorMessage: error
  });

  GetLikes({ PostId, Type, Limit }: IGetLikesProps) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(GET_LIKES(PostId, Type, Limit)))
      .then((response: any) => response[0] || [])
      .then(
        (formattedLikes: ILikesDB): IGetLikesResponseSuccess =>
          this.constructGetLikesSuccessRes(
            this.createLikesList(formattedLikes),
            PostId,
            Type
          )
      );
  }

  AddLike({ PostId, UserId, Type }: IAddLikeProps) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(ADD_LIKE(PostId, UserId, Type)))
      .then(() => this.GetLikes({ PostId, Type, Limit: 0 }))
      .then(
        ({ List: likes }: IGetLikesResponseSuccess): IAddLikeResponseSuccess =>
          this.constructAddLikeSuccessRes(likes, PostId, Type)
      );
  }

  DeleteLike({ PostId, Type, LikeId }: IDeleteLikeProps) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(DELETE_LIKE(LikeId)))
      .then(() => this.GetLikes({ PostId, Type, Limit: 0 }))
      .then(
        ({
          List: likes
        }: IGetLikesResponseSuccess): IDeleteLikeResponseSuccess =>
          this.constructDeleteLikeSuccessRes(likes, PostId, Type)
      );
  }

  DeleteLikes({ KeyId, Type }: IDeleteLikesProps) {
    console.log(KeyId, Type, DELETE_LIKES(KeyId, Type));
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(DELETE_LIKES(KeyId, Type)))
      .then((res) => console.log(res))
      .then(() => this.constructDeleteLikeSuccessRes([], KeyId, Type));
  }
}

export default Like;
