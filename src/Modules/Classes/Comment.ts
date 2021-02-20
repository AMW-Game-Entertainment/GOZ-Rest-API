import { DB } from "../../MainModules";
import {
  DefineSQL,
  ErrorCodes,
  CommentModel,
  PostModel
} from "../../Constants";
import { DateUtil, UrlUtil, FileUtil } from "../../Utils";
import { Like, GetPost } from "../";
import {
  IAddCommentProps,
  IAddCommentResponseError,
  IAddCommentResponseSuccess,
  IDeleteCommentProps,
  IDeleteCommentResponseError,
  IDeleteCommentResponseSuccess,
  IGetCommentsProps,
  IGetCommentsResponseError,
  IGetCommentsResponseSuccess,
  IGetCommentsResponse,
  IGetImageProps,
  ICommentsDB,
  ICommentDB,
  IUploadFileResponse
} from "../Interfaces";

const {
  ADD_COMMENT,
  ADD_COMMENT_IMAGE,
  GET_COMMENTS,
  GET_COMMENTS_PAGINITION,
  GET_FIRST_COMMENT,
  GET_COMMENT_IMAGES,
  DELETE_COMMENT,
  DELETE_COMMENT_IMAGE
} = DefineSQL;

class Comment extends DB {
  constructor() {
    super();
  }

  private createCommentsList = (
    Comments: ICommentsDB
  ): Array<IGetCommentsResponse> =>
    Comments.map((Comment: ICommentDB) => ({
      Id: Comment.id,
      PostType: Comment.Type,
      PostId: Comment.KeyID,
      Type:
        Comment.Images.length > 0
          ? CommentModel.CommentPicture
          : CommentModel.Comment,
      Text: Buffer.from(Comment.Comment, "base64").toString("ascii"),
      Images: Comment.Images,
      Profile: {
        Char_Name: Comment.Char_Name,
        Profile_Image: UrlUtil.toEndPoint(Comment.Profile_Image),
        Cover_Image: UrlUtil.toEndPoint(Comment.Cover_Image),
        UserId: Comment.UserID
      },
      Created: DateUtil.ConvertDateToMilliseconds(Comment.Created)
    }));

  private refactorCommentImages(paths: string[]): string[] {
    return paths.map((path: string) => UrlUtil.toEndPoint(path));
  }

  private constructDeleteCommentSuccessRes = (
    comments: Array<IGetCommentsResponse>,
    FirstCommentId: number,
    PostId: number,
    PostType: number
  ): IDeleteCommentResponseSuccess => ({
    List: comments,
    FirstCommentId,
    PostId,
    PostType,
    isError: false
  });

  public constructDeleteCommentErrorRes = (
    error: any,
    PostId: number,
    PostType: number
  ): IDeleteCommentResponseError => ({
    List: [],
    PostId,
    PostType,
    isError: true,
    ErrorCode: ErrorCodes.GetComments,
    ErrorMessage: error
  });

  private constructAddCommentSuccessRes = (
    comments: Array<IGetCommentsResponse>,
    FirstCommentId: number,
    PostId: number,
    PostType: number
  ): IAddCommentResponseSuccess => ({
    List: comments,
    FirstCommentId,
    PostId,
    PostType,
    isError: false
  });

  public constructAddCommentErrorRes = (
    error: any,
    PostId: number,
    PostType: number
  ): IAddCommentResponseError => ({
    List: [],
    PostId,
    PostType,
    isError: true,
    ErrorCode: ErrorCodes.GetComments,
    ErrorMessage: error
  });

  private constructGetCommentsSuccessRes = (
    comments: Array<IGetCommentsResponse>,
    FirstCommentId: number,
    PostId: number,
    PostType: number
  ): IGetCommentsResponseSuccess => ({
    List: comments,
    FirstCommentId,
    PostId,
    PostType,
    isError: false
  });

  public constructGetCommentsErrorRes = (
    error: any,
    PostId: number,
    PostType: number
  ): IGetCommentsResponseError => ({
    List: [],
    isError: true,
    PostId,
    PostType,
    ErrorCode: ErrorCodes.GetComments,
    ErrorMessage: error
  });

  public GetComments({
    PostId,
    PostType,
    LastId,
    Limit,
    isPaginition
  }: IGetCommentsProps): Promise<IGetCommentsResponseSuccess> {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) =>
        db.execute(
          isPaginition
            ? GET_COMMENTS_PAGINITION(PostId, PostType, LastId, Limit)
            : GET_COMMENTS(PostId, PostType, LastId, Limit)
        )
      )
      .then((response: any) => response[0] || [])
      .then(
        (response: ICommentDB[]): Promise<ICommentDB[]> =>
          Promise.all(
            response.map((comment: ICommentDB) =>
              this.GetCommntImages({ CommentId: comment.id }).then(
                (images: string[]): ICommentDB => ({
                  ...comment,
                  Images: this.refactorCommentImages(images)
                })
              )
            )
          )
      )
      .then((formattedComments: ICommentsDB) =>
        this.getFirstcommentId(PostId, PostType).then(({ FirstCommentId }) => ({
          formattedComments,
          FirstCommentId
        }))
      )
      .then(
        ({
          FirstCommentId,
          formattedComments
        }: {
          FirstCommentId: number;
          formattedComments: ICommentsDB;
        }): IGetCommentsResponseSuccess =>
          this.constructGetCommentsSuccessRes(
            this.createCommentsList(formattedComments),
            FirstCommentId,
            PostId,
            PostType
          )
      );
  }

  public GetCommntImages({ CommentId }: IGetImageProps): Promise<string[]> {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(GET_COMMENT_IMAGES(CommentId)))
      .then(
        (response: any) =>
          response[0].map((list: { Image: string }) => list.Image) || []
      );
  }

  public DeleteCommentImages(CommentId: number): Promise<boolean[]> {
    return this.GetCommntImages({ CommentId }).then((images: Array<string>) =>
      images.map(
        (image: string) =>
          <boolean>FileUtil.deleteFile(<string>UrlUtil.toResourcesPath(image))
      )
    );
  }

  public AddCommentImages(
    CommentId: number,
    Images: IUploadFileResponse[]
  ): Promise<string[]> {
    const Connection: Promise<DB> = new Promise(resolve =>
      resolve(this.connect())
    );
    return Promise.all(
      Images.map(({ UploadedPath }: IUploadFileResponse) =>
        Connection.then(db =>
          db.execute(
            ADD_COMMENT_IMAGE(
              CommentId,
              UrlUtil.toResourcesRelativePathDB(UploadedPath)
            )
          )
        )
      )
    );
  }

  public getFirstcommentId(PostId: number, Type: PostModel) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: DB) => db.execute(GET_FIRST_COMMENT(PostId, Type)))
      .then(res => res[0] || [])
      .then(result => ({
        FirstCommentId: result[0].id
      }));
  }

  public AddComment({
    PostId,
    UserId,
    CurrentFirstId,
    PostType,
    Text,
    Images,
    Limit
  }: IAddCommentProps): Promise<IAddCommentResponseSuccess> {
    const encodedText = new Buffer(Text.trim(), "utf8").toString("base64");
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) =>
        db.execute(ADD_COMMENT(PostId, encodedText, UserId, PostType))
      )
      .then(([insertId, totalRows]: number[]) =>
        this.AddCommentImages(insertId, Images)
      )
      .then(() =>
        this.GetComments({ PostId, PostType, LastId: CurrentFirstId, Limit, isPaginition: false })
      )
      .then(
        ({
          List: comments,
          FirstCommentId
        }: IGetCommentsResponseSuccess): IAddCommentResponseSuccess =>
          this.constructAddCommentSuccessRes(
            comments,
            FirstCommentId,
            PostId,
            PostType
          )
      );
  }

  public DeleteComment({
    PostId,
    CommentType,
    PostType,
    CurrentFirstId,
    CommentId,
    Limit
  }: IDeleteCommentProps): Promise<IDeleteCommentResponseSuccess> {
    return new Promise(resolve =>
      resolve(new Like().DeleteLikes({ KeyId: CommentId, Type: CommentType }))
    )
      .then(() => this.DeleteCommentImages(CommentId))
      .then(() => this.connect())
      .then((db: any) =>
        Promise.all([
          db.execute(DELETE_COMMENT(CommentId)),
          db.execute(DELETE_COMMENT_IMAGE(CommentId))
        ])
      )
      .then(() =>
        this.GetComments({ PostId, PostType, LastId: CurrentFirstId, Limit, isPaginition: false })
      )
      .then(
        ({
          List: comments,
          FirstCommentId
        }: IGetCommentsResponseSuccess): IDeleteCommentResponseSuccess =>
          this.constructDeleteCommentSuccessRes(
            comments,
            FirstCommentId,
            PostId,
            PostType
          )
      );
  }
}

export default Comment;
