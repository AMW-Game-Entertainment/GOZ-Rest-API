import { IPostResponse } from "./Posts";
export interface IPostDB {
  id: number;
  ImageID: string;
  VideoID: string;
  NoteID: number;
  EventID: number;
  AlbumID: number;
  ActionID: number;
  ImageAlbumID: number;
  VideoAlbumID: number;
  PostImageSrc: string;
  CoverImageSrc: string;
  VideoSrc: string;
  FromID: number;
  UserID: number;
  Category: string;
  Privacy: string;
  Post: string;
  Scheduled: number;
  Created: string;
  hasComments: number;
  hasLikes: number;
  hasShares: number;
  hasHistory: number;
  ActionType: string;
  ActionText: string;
  ActionLink: string;
  ActionLinkName: string;
  EventType: number;
  EventTitle: string;
  Price_Item: number;
  EventPrice_Berries_1: number;
  EventPrice_Berries_2: number;
  EventPrice_Berries_3: number;
  Event_EndDate: string;
  Event_StartDate: string;
  isEventEdited: number;
  NotesTitle: string;
  NotesType: number;
  AlbumType: number;
  AlbumTitle: string;
  AdvertID: number;
  AdvertType: number;
  AdvertStatus: number;
  AdvertTitle: string;
  AdvertCreated: string;
  FromProfile_Image: string;
  ToProfile_Image: string;
  FromProfile_CharName: string;
  ToProfile_CharName: string;
}

export interface IPostsDB {
  [index: number]: IPostDB;

  map: (event: object) => IPostResponse;
}

interface IPostResponseCount {
  hasPost: boolean;
  hasComments: boolean;
  hasLikes: boolean;
  hasShares: boolean;
  hasHistory: boolean;
  hasAlumImage: boolean;
  hasAlumVideo: boolean;
  hasAction: boolean;
  isEvent: boolean;
  issNote: boolean;
  isAdvert: boolean;
  isAlbum: boolean;
}

interface IPostResponsePost {
  Id: number;
  ImageId: number;
  VideoId: number;
  ImageSrc: string;
  VideoSrc: string;
  UserId: number;
  FromId: number;
  isByOwner: boolean;
  Type: number;
  Privacy: string;
  Text: string;
  Scheduled: number;
  Created: number;
}

interface IPostResponseAction {
  Id: number;
  Type: number;
  Text: string;
  Link: string;
  LinkText: string;
}

interface IPostResponseEvent {
  Id: number;
  Type: number;
  Title: string;
  Price_Item: number;
  Price_Berries_1: number;
  Price_Berries_2: number;
  Price_Berries_3: number;
  isSameDate: boolean;
  EndDate: string;
  StartDate: string;
  isEdited: number;
}

interface IPostResponseNote {
  Id: number;
  Type: number;
  Title: string;
}

interface IPostResponseAlbum {
  Id: number;
  Type: number;
  Title: string;
  ImageAlbumID: number;
  VideoAlbumID: number;
}

interface IPostResponseAdvert {
  Id: number;
  Type: number;
  Title: string;
  Status: number;
  Created: number;
}

interface IPostResponseProfile {
  From_Image: string;
  To_Image: string;
  From_CharName: string;
  To_CharName: string;
}

export interface IPostResponse {
  Count: {
    [key: string]: IPostResponseCount;
  };
  Post: {
    [key: string]: IPostResponsePost;
  };
  Action: {
    [key: string]: IPostResponseAction;
  };
  Event: {
    [key: string]: IPostResponseEvent;
  };
  Note: {
    [key: string]: IPostResponseNote;
  };
  Album: {
    [key: string]: IPostResponseAlbum;
  };
  Advert: {
    [key: string]: IPostResponseAdvert;
  };
  Profile: {
    [key: string]: IPostResponseProfile;
  };
}

export interface IPostResponseSuccess {
  List: IPostResponse;
  isError: false;
}

export interface IPostResponseError {
  List: Array<IPostResponse>;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IGetPostsProps {
  UserId: number;
  LastPostId: number;
  Limit: number;
}

export interface IGetPostProps {
  PostId: number;
}