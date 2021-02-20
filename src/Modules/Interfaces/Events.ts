export interface IEventDB {
    id: number;
    UserID: number;
    KeyID: number;
    Type: number;
    Title: string;
    Cover: string;
    End_Date: string;
    Start_Date: string;
    Created: string;
}

export interface IEventsDB {
    [index: number]: IEventDB;

    map: (event: object) => IGetEventsResponse;
}

export interface IGetEventsResponse {
    Id: number;
    UserId: number;
    PostId: number;
    Type: number;
    Title: string;
    CoverPhoto: string;
    isSameDate: boolean;
    EndDate: string;
    StartDate: string;
    Created: number;
}

export interface IGetEventsResponseSuccess {
    List: IGetEventsResponse;
    isError: false;
}

export interface IGetEventsResponseError {
    List: Array<IGetEventsResponse>;
    isError: true;
    ErrorCode: string;
    ErrorMessage: object;
}

export interface IGetEventsProps {
    UserId: number;
    Limit: number;
}

export interface IGetEventProps {
    PostId: number;
    EventId: number;
}

