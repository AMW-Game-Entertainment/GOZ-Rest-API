import express from "express";
import { Upload } from "../Modules";
import { Actions } from ".";
import { Routes } from "../Constants";
import { IUploadFileResponse } from "../Modules/Interfaces";

// const RouteGetEvents = (app: any): any =>
//   app.get(EventsList, ({ query }: any, response: any) => {
//     const { Limit, UserId } = query;
//     const EventsModule = new GetEvents();

//     EventsModule.Output({ UserId, Limit })
//       .then(res => response.send(Actions.GetEventsSuccessResponse(res)))
//       .catch(
//         (error): IGetEventsResponseError =>
//           response.send(
//             Actions.GetEventsFailedResponse(
//               EventsModule.formatErrorResponse(error)
//             )
//           )
//       );
//   });

const RouteUpload = (app: express.Application) =>
  app.post(
    Routes.UploadFiles,
    (req: express.Request, response: express.Response) => {
      const { uploadType, files } = req.body;
      const upload = new Upload();
      upload
        .setAsUpload(files, uploadType)
        .UploadFile()
        .then((result: IUploadFileResponse[]) =>
          response.send(
            Actions.UploadSuccessResponse(
              upload.formatUploadResponseSuccess(result)
            )
          )
        )
        .catch((error: Error) =>
          response.send(
            Actions.UploadFailedResponse(
              upload.formatUploadResponseFailed(error)
            )
          )
        );
    }
  );

export default (App: express.Application) => {
  const routes = { RouteUpload };
  Object.keys(routes).map((key: number | string) => routes[key](App));
};
