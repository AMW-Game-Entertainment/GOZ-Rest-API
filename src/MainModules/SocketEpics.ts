import { of, from } from "rxjs";
import { filter, map, flatMap } from "rxjs/operators";
import { Actions, Socket } from "../MainModules";
import { Routes, Types, UploadConfig, ErrorCodes } from "../Constants";
import {
  IGetEventsResponseError,
  INoteResponseError,
  IPostResponseError,
  IGetLikesResponseError,
  IGetCommentsResponseError,
  IAddLikeResponseError,
  IDeleteLikeResponseError,
  IAddCommentResponseError,
  IDeleteCommentResponseError,
  IGetUserResponseError,
  IGetUserResponseSuccess,
  IAddLikeResponseSuccess,
  IDeleteLikeResponseSuccess,
  IAddCommentResponseSuccess,
  IDeleteCommentResponseSuccess,
  IType,
  IGetEventsProps,
  INoteProps,
  IGetPostsProps,
  IGetPostProps,
  IGetUserProps,
  IGetLikesProps,
  IAddLikeProps,
  IDeleteLikeProps,
  IGetCommentsProps,
  IAddCommentProps,
  IDeleteCommentProps,
  INewSocketIdResponse,
  IMiddlewareSocketData,
  IPropsSocketId,
  IDeleteFileProps,
  IDeleteFileResponseError,
  IDeleteFileResponseSuccess
} from "../Modules/Interfaces";
import {
  GetEvents,
  GetNotes,
  GetPost,
  GetPosts,
  GetUser,
  Like,
  Comment,
  Upload
} from "../Modules";
import { UserUtil } from "../Utils";

const {
  Socket: { API }
} = Routes;
const {
  Socket: {
    API_REQUEST_EVENTS,
    API_REQUEST_POST,
    API_REQUEST_POSTS,
    API_REQUEST_LIKES,
    API_REQUEST_ADD_LIKE,
    API_REQUEST_DELETE_LIKE,
    API_REQUEST_COMMENTS,
    API_REQUEST_ADD_COMMENT,
    API_REQUEST_DELETE_COMMENT,
    API_REQUEST_PROFILE_BY_ID,
    API_REQUEST_CURRENT_USER_BY_ID,
    API_REQUEST_NEW_SOCKET_ID,
    API_REQUEST_ADD_CLIENT,
    API_REQUEST_OPEN_MESSAGE,
    API_REQUEST_DELETE_FILES
  }
} = Types;

const SocketGetEvents = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      // add new param isAllClients
      // it will handle to send to all clients or send to current user clients
      filter(({ type }: IType) => type === API_REQUEST_EVENTS),
      map(({ payload: { UserId, Limit } }: any) => ({
        UserId,
        Limit
      })),
      flatMap(({ UserId, Limit }: IGetEventsProps) => {
        const EventsModule = new GetEvents();
        return from(
          EventsModule.Output({ UserId, Limit })
            .then(res => Actions.GetEventsSuccessResponse(res))
            .catch(error => {
              const errorRes: IGetEventsResponseError = EventsModule.formatErrorResponse(
                error
              );
              return Actions.GetEventsFailedResponse(errorRes);
            })
        );
      })
    )
    .subscribe(msg => Client.emit(API, msg));
};

const SocketGetNotes = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_EVENTS),
      map(({ payload: { UserId, Limit } }: any) => ({
        UserId,
        Limit
      })),
      flatMap(({ UserId, Limit }: INoteProps) => {
        const EventsModule = new GetNotes();
        return from(
          EventsModule.Output({ UserId, Limit })
            .then(res => Actions.GetNotesSuccessResponse(res))
            .catch(error => {
              const errorRes: INoteResponseError = EventsModule.formatErrorResponse(
                error
              );
              return Actions.GetNotesFailedResponse(errorRes);
            })
        );
      })
    )
    .subscribe(msg => Client.emit(API, msg));
};

const SocketGetPosts = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_POSTS),
      map(({ payload: { UserId, LastPostId, Limit } }: any) => ({
        UserId,
        LastPostId,
        Limit
      })),
      flatMap(({ UserId, LastPostId, Limit }: IGetPostsProps) => {
        const PostsModule = new GetPosts();
        return PostsModule.Output({ UserId, LastPostId, Limit })
          .then(res => Actions.GetPostsSuccessResponse(res))
          .catch(error => {
            const errorRes: IPostResponseError = PostsModule.formatErrorResponse(
              error
            );
            return Actions.GetPostsFailedResponse(errorRes);
          });
      })
    )
    .subscribe(msg => Client.emit(API, msg));
};

const SocketGetPost = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_POST),
      map(({ payload: { PostId } }: any) => ({
        PostId
      })),
      flatMap(({ PostId }: IGetPostProps) => {
        const PostModule = new GetPost();
        return PostModule.Output({ PostId })
          .then(res => Actions.GetPostSuccessResponse(res))
          .catch(error => {
            const errorRes: IPostResponseError = PostModule.formatErrorResponse(
              error
            );
            return Actions.GetPostFailedResponse(errorRes);
          });
      })
    )
    .subscribe(msg => Client.emit(API, msg));
};

const SocketGetLikes = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_LIKES),
      map(({ payload: { PostId, Type, Limit } }: any) => ({
        PostId,
        Type,
        Limit
      })),
      flatMap(({ PostId, Type, Limit }: IGetLikesProps) => {
        const LikeModule = new Like();
        return LikeModule.GetLikes({ PostId, Type, Limit })
          .then(res => Actions.GetLikesSuccessResponse(res))
          .catch(error => {
            const errorRes: IGetLikesResponseError = LikeModule.constructGetLikesErrorRes(
              error,
              PostId,
              Type
            );
            return Actions.GetLikesFailedResponse(errorRes);
          });
      })
    )
    .subscribe(msg => Client.emit(API, msg));
};

const SocketAddLike = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_ADD_LIKE),
      map(({ payload: { PostId, Type, SocketId, UserId } }: any) => ({
        PostId,
        Type,
        SocketId,
        UserId
      })),
      flatMap(({ PostId, Type, SocketId, UserId }: IAddLikeProps) => {
        const LikeModule = new Like();
        return LikeModule.AddLike({
          PostId,
          Type,
          SocketId,
          UserId
        })
          .then(res => Actions.AddLikeSuccessResponse(res))
          .catch(error => {
            const errorRes: IAddLikeResponseError = LikeModule.constructAddLikeErrorRes(
              error,
              PostId,
              Type
            );
            return Actions.AddLikeFailedResponse(errorRes);
          });
      })
    )
    .subscribe((msg: { type: string; payload: IAddLikeResponseSuccess }) =>
      Client.emit(API, msg)
    );
};

const SocktDeleteLike = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_DELETE_LIKE),
      map(({ payload: { PostId, Type, LikeId } }: any) => ({
        PostId,
        Type,
        LikeId
      })),
      flatMap(({ PostId, Type, LikeId }: IDeleteLikeProps) => {
        const LikeModule = new Like();
        return LikeModule.DeleteLike({
          PostId,
          Type,
          LikeId
        })
          .then(res => Actions.DeleteLikeSuccessResponse(res))
          .catch(error => {
            const errorRes: IDeleteLikeResponseError = LikeModule.constructDeleteLikeErrorRes(
              error,
              PostId,
              Type
            );
            return Actions.DeleteLikeFailedResponse(errorRes);
          });
      })
    )
    .subscribe((msg: { type: string; payload: IDeleteLikeResponseSuccess }) =>
      Client.emit(API, msg)
    );
};

const SocketGetComments = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_COMMENTS),
      map(({ payload: { PostId, PostType, LastId, Limit } }: any) => ({
        PostId,
        PostType,
        Limit,
        LastId
      })),
      flatMap(({ PostId, PostType, LastId, Limit }: IGetCommentsProps) => {
        const CommentModule = new Comment();
        return CommentModule.GetComments({ PostId, PostType, LastId, Limit, isPaginition: true })
          .then(res => Actions.GetCommentsSuccessResponse(res))
          .catch(error => {
            const errorRes: IGetCommentsResponseError = CommentModule.constructGetCommentsErrorRes(
              error,
              PostId,
              PostType
            );
            return Actions.GetCommentsFailedResponse(errorRes);
          });
      })
    )
    .subscribe(msg => Client.emit(API, msg));
};

const SocketAddComment = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }) => type === API_REQUEST_ADD_COMMENT),
      map(
        ({
          payload: {
            PostId,
            UserId,
            CurrentFirstId,
            PostType,
            Text,
            Images,
            Limit,
            SocketId
          }
        }: {
          type: string;
          payload: IAddCommentProps;
        }): IAddCommentProps => ({
          PostId,
          UserId,
          CurrentFirstId,
          PostType,
          Text,
          Images,
          Limit,
          SocketId
        })
      ),
      flatMap(
        ({
          PostId,
          UserId,
          CurrentFirstId,
          PostType,
          Text,
          Images,
          Limit,
          SocketId
        }: IAddCommentProps) => {
          const CommentModule = new Comment();
          return CommentModule.AddComment({
            PostId,
            UserId,
            CurrentFirstId,
            PostType,
            Text,
            Images,
            Limit,
            SocketId
          })
            .then((res: IAddCommentResponseSuccess) =>
              Actions.AddCommentSuccessResponse(res)
            )
            .catch((error: Error) => {
              const errorRes: IDeleteCommentResponseError = CommentModule.constructAddCommentErrorRes(
                error,
                PostId,
                PostType
              );
              return Actions.AddCommentFailedResponse(errorRes);
            });
        }
      )
    )
    .subscribe(msg => Client.emit(API, msg));
};

const SocktDeleteComment = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_DELETE_COMMENT),
      map(
        ({
          payload: { PostId, PostType, CommentType, CommentId, CurrentFirstId, Limit }
        }: any) => ({
          PostId,
          PostType,
          CommentType,
          CommentId,
          CurrentFirstId,
          Limit
        })
      ),
      flatMap(
        ({
          PostId,
          PostType,
          CommentType,
          CommentId,
          CurrentFirstId,
          Limit
        }: IDeleteCommentProps) => {
          const CommentModule = new Comment();
          return CommentModule.DeleteComment({
            PostId,
            PostType,
            CommentType,
            CommentId,
            CurrentFirstId,
            Limit
          })
            .then(res => Actions.DeleteCommentSuccessResponse(res))
            .catch(error => {
              const errorRes: IDeleteCommentResponseError = CommentModule.constructDeleteCommentErrorRes(
                error,
                PostId,
                PostType
              );
              return Actions.DeleteCommentFailedResponse(errorRes);
            });
        }
      )
    )
    .subscribe(
      (msg: { type: string; payload: IDeleteCommentResponseSuccess }) =>
        Client.emit(API, msg)
    );
};

const SocketGetProfileById = (
  Client: any,
  Data: IMiddlewareSocketData
): void => {
  of(Data)
    .pipe(
      filter(({ type }) => type === API_REQUEST_PROFILE_BY_ID),
      map(({ payload: { UserId, SocketId } }: any) => ({
        UserId,
        SocketId
      })),
      flatMap(({ UserId, SocketId }: IGetUserProps) => {
        const UserModule = new GetUser();
        return UserModule.Output({ UserId, SocketId })
          .then(res =>
            Actions.GetProfileByIdSuccessResponse(
              res.List.OwnProfile
                ? res
                : UserUtil.RefactorProfilePageResponse(res)
            )
          )
          .catch(error => {
            const errorRes: IGetUserResponseError = UserModule.formatErrorResponse(
              error
            );
            return Actions.GetProfileByIdFailedResponse(errorRes);
          });
      })
    )
    .subscribe((msg: { type: string; payload: IGetUserResponseSuccess }) =>
      Client.emit(API, msg)
    );
};

const SocketGetCurrentUserById = (
  Client: any,
  Data: IMiddlewareSocketData
): void => {
  of(Data)
    .pipe(
      filter(({ type }) => type === API_REQUEST_CURRENT_USER_BY_ID),
      map(({ payload: { UserId, SocketId } }: any) => ({
        UserId,
        SocketId
      })),
      flatMap(({ UserId, SocketId }: IGetUserProps) => {
        const UserModule = new GetUser();
        return UserModule.Output({ UserId, SocketId })
          .then(res => Actions.GetCurrentUserByIdSuccessResponse(res))
          .catch(error => {
            const errorRes: IGetUserResponseError = UserModule.formatErrorResponse(
              error
            );
            return Actions.GetCurrentUserByIdFailedResponse(errorRes);
          });
      })
    )
    .subscribe((msg: { type: string; payload: IGetUserResponseSuccess }) =>
      Data.payload.MultipleClients
        ? Socket.emitTo(Data.payload.SocketId, API, msg)
        : Client.emit(API, msg)
    );
};

const NewSocketId = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_NEW_SOCKET_ID),
      flatMap(() =>
        from(
          Socket.makeSocketID(Client)
            .then(SocketId => ({
              msg: Actions.ChangeSocketIdSuccess(SocketId),
              isError: false,
              SocketId
            }))
            .catch(error => ({
              msg: Actions.ChangeSocketIdFailed(error),
              isError: true
            }))
        )
      )
    )
    .subscribe(({ msg, isError, SocketId }: INewSocketIdResponse) =>
      !isError ? Socket.emitTo(SocketId, API, msg) : Client.emit(API, msg)
    );
};

const AddClient = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }) => type === API_REQUEST_ADD_CLIENT),
      flatMap(({ payload: { SocketId } }: IPropsSocketId) =>
        from(
          Socket.setClient(SocketId, Client)
            .then(() => Actions.AddClientSuccess())
            .catch(error => Actions.AddClientFailed(error))
        )
      )
    )
    // after the above implemented emit by the GameSocketId
    .subscribe(msg => Client.emit(API, msg));
};

const openMessage = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }) => type === API_REQUEST_OPEN_MESSAGE),
      map(() => ({
        UploadConfig
      })),
      map(msg => Actions.SendOpenMessage(msg))
    )
    .subscribe(msg => Client.emit(API, msg));
};

const deleteFile = (Client: any, Data: IMiddlewareSocketData): void => {
  of(Data)
    .pipe(
      filter(({ type }: IType) => type === API_REQUEST_DELETE_FILES),
      flatMap(({ payload: { paths, uploadType } }: IDeleteFileProps) => {
        const upload = new Upload();
        return upload
          .setAsDelete(paths, uploadType)
          .DeleteFile()
          .then(() =>
            Actions.DeleteFileSuccessResponse(upload.formatDeleteFileResponse())
          )
          .catch(error => {
            const errorRes: IDeleteFileResponseError = upload.formatDeleteFileErrorResponse(
              error
            );
            return Actions.DeleteFileFailedResponse(errorRes);
          });
      })
    )
    .subscribe(
      (msg: {
        type: string;
        payload: IDeleteFileResponseSuccess | IDeleteFileResponseError;
      }) => Client.emit(API, msg)
    );
};

export default (Client: any, Data: IMiddlewareSocketData) => {
  const epics = {
    SocketGetEvents,
    SocketGetNotes,
    SocketGetPost,
    SocketGetPosts,
    SocketGetComments,
    SocketGetLikes,
    SocketAddLike,
    SocketAddComment,
    SocktDeleteLike,
    SocktDeleteComment,
    SocketGetProfileById,
    SocketGetCurrentUserById,
    NewSocketId,
    AddClient,
    openMessage,
    deleteFile
  };
  Object.keys(epics).map((key: number | string) => {
    epics[key](Client, Data);
  });
};
