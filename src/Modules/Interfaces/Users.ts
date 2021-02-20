export interface IUserDB {
  id: number;
  Username: string;
  Email: string;
  Passenc: string;
  IP_Registered: string;
  IP_Logged: string;
  Char_Name: string;
  Char_Rank: number;
  Char_Registered: number;
  Char_Latest_Visit: number;
  Char_Total_Visits: number;
  Char_Emblem: string;
  Char_Emblem_Image: string;
  UserID: number;
  Real_Name: string;
  Real_Surname: string;
  Nickname: string;
  TownID: number;
  Birthday: string;
  FB_Profile: string;
  FB_Page: string;
  YT_Channel: string;
  Gender: string;
  Favorite_Genre: string;
  Favorite_Anime: string;
  Favorite_Manga: string;
  About: string;
  Profile_Image: string;
  Cover_Image: string;
}

export interface IUsersDB {
  [index: number]: IUserDB;

  map: (event: object) => IGetUserResponse;
}

export interface IGetUserResponse {
  UserId: number;
  Username: string;
  Email: string;
  Nickname: string;
  Rank: number;
  Created: number;
  Last_Visit: number;
  TotalVisits: number;
  ProfileImage: string;
  CoverImage: string;
  OwnProfile: boolean;
}

export interface IGetUserResponseSuccess {
  List: IGetUserResponse;
  isError: false;
}

export interface IGetUserResponseError {
  List: Array<IGetUserResponse>;
  isError: true;
  ErrorCode: string;
  ErrorMessage: object;
}

export interface IGetUserProps {
  UserId: number;
  SocketId: string;
}
