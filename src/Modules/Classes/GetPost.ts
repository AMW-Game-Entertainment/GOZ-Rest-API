import { DB } from "../../MainModules";
import { DefineSQL, ErrorCodes, PostModel } from "../../Constants";
import { DateUtil, UrlUtil } from "../../Utils";
import {
  IGetPostProps,
  IPostResponseError,
  IPostResponseSuccess,
  IPostResponse,
  IPostsDB,
  IPostDB
} from "../Interfaces";

const { GET_POST } = DefineSQL;

class GetPost extends DB {
  constructor() {
    super();
  }

  refactorPosts(posts: IPostsDB): IPostResponse {
    return posts.map((post: IPostDB) => ({
      Count: {
        hasPost: post.id && post.id > 0,
        hasComments: post.hasComments,
        hasLikes: post.hasLikes,
        hasShares: post.hasShares,
        hasHistory: post.hasHistory,
        hasAlumImage: post.ImageAlbumID && post.ImageAlbumID > 0,
        hasAlumVideo: post.VideoAlbumID && post.VideoAlbumID > 0,
        hasAction: post.ActionID && post.ActionID > 0,
        isEvent: post.EventID && post.EventID > 0,
        isNote: post.NoteID && post.NoteID > 0,
        isAlbum: post.AlbumID && post.AlbumID > 0
      },
      Post: {
        Id: post.id,
        ImageId: post.ImageID,
        VideoId: post.VideoID,
        ImageSrc: UrlUtil.toEndPoint(post.CoverImageSrc || post.PostImageSrc),
        VideoSrc: post.VideoSrc,
        UserId: post.UserID,
        FromId: post.FromID,
        isByOwner: post.FromID === post.UserID,
        Type: PostModel[post.Category] || 0,
        Privacy: post.Privacy,
        Text: Buffer.from(post.Post, "base64").toString("ascii"),
        Scheduled: post.Scheduled,
        Created: DateUtil.ConvertDateToMilliseconds(post.Created)
      },
      Action: {
        Id: post.ActionID,
        Type: post.ActionType,
        Text: post.ActionText,
        Link: post.ActionLink,
        LinkText: post.ActionLinkName
      },
      Event: {
        Id: post.EventID,
        Type: post.EventType,
        Title: post.EventTitle
          ? Buffer.from(post.EventTitle, "base64").toString("ascii")
          : "",
        Price_Item: post.Price_Item,
        Price_Berries_1: post.EventPrice_Berries_1,
        Price_Berries_2: post.EventPrice_Berries_2,
        Price_Berries_3: post.EventPrice_Berries_3,
        isSameDate: post.Event_EndDate === post.Event_StartDate,
        EndDate: post.Event_EndDate,
        StartDate: post.Event_StartDate,
        isEdited: post.isEventEdited
      },
      Note: {
        Id: post.NoteID,
        Type: post.NotesType,
        Title: post.NotesTitle
          ? Buffer.from(post.NotesTitle, "base64").toString("ascii")
          : ""
      },
      Album: {
        Id: post.AlbumID,
        Type: post.AlbumType,
        Title: post.AlbumTitle
          ? Buffer.from(post.AlbumTitle, "base64").toString("ascii")
          : "",
        ImageAlbumID: post.ImageAlbumID,
        VideoAlbumID: post.VideoAlbumID
      },
      Advert: {
        Id: post.AdvertID,
        Type: post.AdvertType,
        Title: post.AdvertTitle
          ? Buffer.from(post.AdvertTitle, "base64").toString("ascii")
          : "",
        Status: post.AdvertStatus,
        Created: DateUtil.ConvertDateToMilliseconds(
          post.AdvertCreated || post.Created
        )
      },
      Profile: {
        From_Image: UrlUtil.toEndPoint(post.FromProfile_Image),
        To_Image: UrlUtil.toEndPoint(post.ToProfile_Image),
        From_CharName: post.FromProfile_CharName,
        To_CharName: post.ToProfile_CharName
      }
    }));
  }

  formatSuccessResponse = (posts: IPostsDB): IPostResponseSuccess => ({
    List: this.refactorPosts(posts),
    isError: false
  });

  formatErrorResponse = (error: any): IPostResponseError => ({
    List: [],
    isError: true,
    ErrorCode: ErrorCodes.GetPosts,
    ErrorMessage: error
  });

  Output({ PostId }: IGetPostProps) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(GET_POST(PostId)))
      .then((response: any) => response[0] || [])
      .then(
        (formattedResponse: IPostsDB): IPostResponseSuccess =>
          this.formatSuccessResponse(formattedResponse)
      );
  }
}

export default GetPost;
