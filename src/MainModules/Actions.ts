import { Types } from "../Constants";

const {
  API_RESPONSE_NEW_SOCKET_ID,
  API_FAILED_NEW_SOCKET_ID,
  API_RESPONSE_EVENTS,
  API_FAILED_EVENTS,
  API_RESPONSE_NOTES,
  API_FAILED_NOTES,
  API_RESPONSE_PROFILE_BY_ID,
  API_FAILED_PROFILE_BY_ID,
  API_RESPONSE_CURRENT_USER_BY_ID,
  API_FAILED_CURRENT_USER_BY_ID,
  API_RESPONSE_POSTS,
  API_FAILED_POSTS,
  API_RESPONSE_POST,
  API_FAILED_POST,
  API_RESPONSE_LIKES,
  API_FAILED_LIKES,
  API_RESPONSE_ADD_LIKE,
  API_FAILED_ADD_LIKE,
  API_RESPONSE_DELETE_LIKE,
  API_FAILED_DELETE_LIKE,
  API_RESPONSE_COMMENTS,
  API_FAILED_COMMENTS,
  API_RESPONSE_ADD_COMMENT,
  API_FAILED_ADD_COMMENT,
  API_RESPONSE_DELETE_COMMENT,
  API_FAILED_DELETE_COMMENT,
  API_RESPONSE_ADD_CLIENT,
  API_FAILED_ADD_CLIENT,
  API_RESPONSE_UPLOAD_FILES,
  API_FAILED_UPLOAD_FILES,
  API_RESPONSE_OPEN_MESSAGE,
  API_RESPONSE_DELETE_FILES,
  API_FAILED_DELETE_FILES,
} = Types.Socket;

export default {
  ChangeSocketIdSuccess(SocketId: string) {
    return {
      type: API_RESPONSE_NEW_SOCKET_ID,
      payload: { SocketId }
    };
  },
  ChangeSocketIdFailed(error: any) {
    return {
      type: API_FAILED_NEW_SOCKET_ID,
      payload: error
    };
  },

  AddClientSuccess() {
    return {
      type: API_RESPONSE_ADD_CLIENT
    };
  },
  AddClientFailed(error: any) {
    return {
      type: API_FAILED_ADD_CLIENT,
      payload: error
    };
  },
  ChangedSession(Session: object) {
    return {
      type: API_RESPONSE_NEW_SOCKET_ID,
      payload: Session
    };
  },
  GetEventsSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_EVENTS,
      payload
    };
  },
  GetEventsFailedResponse(payload: object) {
    return {
      type: API_FAILED_EVENTS,
      payload
    };
  },
  GetNotesSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_NOTES,
      payload
    };
  },
  GetNotesFailedResponse(payload: object) {
    return {
      type: API_FAILED_NOTES,
      payload
    };
  },
  GetProfileByIdSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_PROFILE_BY_ID,
      payload
    };
  },
  GetProfileByIdFailedResponse(payload: object) {
    return {
      type: API_FAILED_PROFILE_BY_ID,
      payload
    };
  },
  GetCurrentUserByIdSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_CURRENT_USER_BY_ID,
      payload
    };
  },
  GetCurrentUserByIdFailedResponse(payload: object) {
    return {
      type: API_FAILED_CURRENT_USER_BY_ID,
      payload
    };
  },
  GetPostsSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_POSTS,
      payload
    };
  },
  GetPostsFailedResponse(payload: object) {
    return {
      type: API_FAILED_POSTS,
      payload
    };
  },
  GetPostSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_POST,
      payload
    };
  },
  GetPostFailedResponse(payload: object) {
    return {
      type: API_FAILED_POST,
      payload
    };
  },
  GetLikesSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_LIKES,
      payload
    };
  },
  GetLikesFailedResponse(payload: object) {
    return {
      type: API_FAILED_LIKES,
      payload
    };
  },
  AddLikeSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_ADD_LIKE,
      payload
    };
  },
  AddLikeFailedResponse(payload: object) {
    return {
      type: API_FAILED_ADD_LIKE,
      payload
    };
  },
  DeleteLikeSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_DELETE_LIKE,
      payload
    };
  },
  DeleteLikeFailedResponse(payload: object) {
    return {
      type: API_FAILED_DELETE_LIKE,
      payload
    };
  },
  GetCommentsSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_COMMENTS,
      payload
    };
  },
  GetCommentsFailedResponse(payload: object) {
    return {
      type: API_FAILED_COMMENTS,
      payload
    };
  },
  AddCommentSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_ADD_COMMENT,
      payload
    };
  },
  AddCommentFailedResponse(payload: object) {
    return {
      type: API_FAILED_ADD_COMMENT,
      payload
    };
  },
  DeleteCommentSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_DELETE_COMMENT,
      payload
    };
  },
  DeleteCommentFailedResponse(payload: object) {
    return {
      type: API_FAILED_DELETE_COMMENT,
      payload
    };
  },
  UploadFailedResponse(payload: object) {
    return {
      type: API_FAILED_UPLOAD_FILES,
      payload,
    };
  },
  UploadSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_UPLOAD_FILES,
      payload,
    };
  },
  DeleteFileSuccessResponse(payload: object) {
    return {
      type: API_RESPONSE_DELETE_FILES,
      payload,
    };
  },
  DeleteFileFailedResponse(payload: object) {
    return {
      type: API_FAILED_DELETE_FILES,
      payload,
    };
  },
  SendOpenMessage(payload: object) {
    return {
      type: API_RESPONSE_OPEN_MESSAGE,
      payload,
    };
  }
};
