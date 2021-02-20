import { DB } from "../../MainModules";
import { DefineSQL, ErrorCodes } from "../../Constants";
import { DateUtil, UrlUtil } from "../../Utils";
import {
  IGetEventProps,
  IGetEventsResponseError,
  IGetEventsResponseSuccess,
  IGetEventsResponse,
  IEventsDB,
  IEventDB
} from "../Interfaces";

const { GET_EVENT } = DefineSQL;

class GetEvent extends DB {
  constructor() {
    super();
  }

  refactorEvents = (Events: IEventsDB): IGetEventsResponse =>
    Events.map((Event: IEventDB) => ({
      Id: Event.id,
      UserId: Event.UserID,
      PostId: Event.KeyID,
      Type: Event.Type,
      Title: Buffer.from(Event.Title, "base64").toString("ascii"),
      CoverPhoto: UrlUtil.toEndPoint(Event.Cover),
      isSameDate: Event.End_Date === Event.Start_Date,
      EndDate: Event.End_Date,
      StartDate: Event.Start_Date,
      Created: DateUtil.ConvertDateToMilliseconds(Event.Created)
    }));

  formatSuccessResponse = (events: IEventsDB): IGetEventsResponseSuccess => ({
    List: this.refactorEvents(events),
    isError: false
  });

  formatErrorResponse = (error: any): IGetEventsResponseError => ({
    List: [],
    isError: true,
    ErrorCode: ErrorCodes.GetEvents,
    ErrorMessage: error
  });

  Output({ EventId, PostId }: IGetEventProps) {
    return new Promise(resolve => resolve(this.connect()))
      .then((db: any) => db.execute(GET_EVENT(EventId, PostId)))
      .then((response: any) => response[0] || [])
      .then(
        (formattedEvents: IEventsDB): IGetEventsResponseSuccess =>
          this.formatSuccessResponse(formattedEvents)
      );
  }
}

export default GetEvent;
