import { DB } from "../../MainModules";
import { DefineSQL, ErrorCodes } from "../../Constants";
import { DateUtil, UrlUtil } from "../../Utils";
import {
  INoteProps,
  INoteResponseError,
  INoteResponseSuccess,
  INoteResponse,
  INotesDB,
  INoteDB
} from "../Interfaces/Notes";

const { GET_NOTES } = DefineSQL;

class GetNotes extends DB {
  constructor() {
    super();
  }

  refactorNotes = (Notes: INotesDB): INoteResponse =>
    Notes.map((Note: INoteDB) => ({
      Id: Note.id,
      UserId: Note.UserID,
      PostId: Note.KeyID,
      Type: Note.Type,
      Image: UrlUtil.toEndPoint(Note.Image),
      AlbumId: Note.AlbumID,
      Title: Buffer.from(Note.Title, "base64").toString("ascii"),
      Created: DateUtil.ConvertDateToMilliseconds(Note.Created)
    }));

  formatSuccessResponse = (events: INotesDB): INoteResponseSuccess => ({
    List: this.refactorNotes(events),
    isError: false
  });

  formatErrorResponse = (error: any): INoteResponseError => ({
    List: [],
    isError: true,
    ErrorCode: ErrorCodes.GetNotes,
    ErrorMessage: error
  });

  Output({ UserId, Limit }: INoteProps) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(GET_NOTES(UserId, Limit)))
      .then((response: any) => response[0] || [])
      .then(
        (formattedNotes: INotesDB): INoteResponseSuccess =>
          this.formatSuccessResponse(formattedNotes)
      );
  }
}

export default GetNotes;
