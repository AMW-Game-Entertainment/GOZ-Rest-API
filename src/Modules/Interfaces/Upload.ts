import { UploadModel } from "../../Constants";
type UploadType = keyof UploadModel;
export interface IUploadConfig {
  dir: string;
  ext: Array<string>;
  maxSize: number;
  maxFiles: number;
  resize: {
    w: number;
    h: number;
  };
  quality: number;
  allowAlpha: boolean;
}

export interface IUploadFileResult {
  Id: number;
  fileName: string;
}

export interface IUploadFileResponse {
  Id: number;
  fileName: string;
  UploadedPath: string;
}

export interface IUploadResponseSuccess {
  uploadType: UploadType;
  Files: IUploadFileResponse[];
  Errors: IValidateError[];
  isError: number;
}

export interface IUploadResponseFailed {
  isError: boolean;
  uploadType: UploadType;
  ErrorCode: string;
  ErrorMessage: Error;
}

export interface IValidateError {
  isError: boolean;
  ErroCodes?: string;
  Search?: object;
}

export interface IDeleteFileProps {
  type: string;
  payload: {
    paths: string[];
    uploadType: UploadType;
  };
}

export interface IDeleteFileResponseError {
  isError: true;
  ErrorCode: string;
  ErrorMessage: Error;
}

export interface IDeleteFileResponseSuccess {
  paths: string[];
  uploadType: UploadType;
  isError: false;
}