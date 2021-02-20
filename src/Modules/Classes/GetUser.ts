import { DB, Session } from "../../MainModules";
import { DefineSQL, ErrorCodes } from "../../Constants";
import { UrlUtil } from "../../Utils";
import {
  IGetUserProps,
  IGetUserResponseError,
  IGetUserResponseSuccess,
  IGetUserResponse,
  IUsersDB,
  IUserDB
} from "../Interfaces";

const { GET_USER } = DefineSQL;

class GetUser extends DB {
  constructor() {
    super();
  }

  refactorUser = (Users: IUsersDB, SocketId: string): IGetUserResponse =>
    Users.map((User: IUserDB) => ({
      UserId: User.UserID,
      Username: User.Username,
      Email: User.Email,
      Nickname: User.Char_Name,
      Rank: User.Char_Rank,
      Created: User.Char_Registered,
      Last_Visit: User.Char_Latest_Visit,
      TotalVisits: User.Char_Total_Visits,
      OwnProfile: Session.getUserID(SocketId) === User.UserID,
      ProfileImage: UrlUtil.toEndPoint(User.Profile_Image),
      CoverImage: UrlUtil.toEndPoint(User.Cover_Image)
    }));

  formatSuccessResponse = (user: IUsersDB, SocketId: string): IGetUserResponseSuccess => ({
    List: this.refactorUser(user, SocketId),
    isError: false
  });

  formatErrorResponse = (error: any): IGetUserResponseError => ({
    List: [],
    isError: true,
    ErrorCode: ErrorCodes.GetUser,
    ErrorMessage: error
  });

  Output({ UserId, SocketId }: IGetUserProps) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(GET_USER(UserId)))
      .then((response: any) => response[0] || [])
      .then(
        (formattedUser: IUsersDB): IGetUserResponseSuccess =>
          this.formatSuccessResponse(formattedUser, SocketId)
      );
  }
}

export default GetUser;
