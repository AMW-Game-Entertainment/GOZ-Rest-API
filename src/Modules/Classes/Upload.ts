import uuid from "uuid/v4";
import { read as jimpRead } from "jimp";
import { extname, normalize, basename } from "path";
import { ReadStream, statSync } from "fs";
import { ErrorCodes, UploadModel, UploadConfig } from "../../Constants";
import { UrlUtil, FileUtil } from "../../Utils";
import {
  IUploadConfig,
  IUploadFileResult,
  IUploadFileResponse,
  IUploadResponseSuccess,
  IUploadResponseFailed,
  IDeleteFileResponseError,
  IDeleteFileResponseSuccess,
  IValidateError
} from "../Interfaces";

type UploadType = keyof UploadModel;

class Upload {
  private uploadedFiles: ReadStream[] = [];
  private allowedFiles: ReadStream[] = [];
  private type: UploadType;
  private pathsList: string[];
  private destinations: string;
  private config: IUploadConfig;
  private Id: number = 0;
  private errors: IValidateError[] = [];

  public setAsUpload(files: ReadStream[], type: UploadType): this {
    this.uploadedFiles = Array.isArray(files) ? files : [files];
    this.allowedFiles = [];
    this.type = type;
    this.config = UploadConfig[type];
    this.errors = [];
    this.destinations = UrlUtil.getImagesPath(<string>this.config.dir);

    return this;
  }

  public setAsDelete(pathsList: string[], type: UploadType): this {
    this.pathsList = pathsList;
    this.allowedFiles = [];
    this.type = type;
    this.config = UploadConfig[type];
    this.errors = [];
    this.destinations = UrlUtil.getImagesPath(<string>this.config.dir);
    return this;
  }

  public DeleteFile(): Promise<any> {
    return new Promise(resolve => resolve(this.pathsList))
      .then((fileNames: string[]) =>
        fileNames.map((fileName: string) => this.getFullPath(fileName))
      )
      .then((paths: string[]) =>
        Promise.all(
          paths.map((path: string) => {
            console.log(path);
            const res = FileUtil.deleteFile(path);
            return res
              ? Promise.resolve(`Deleted ${path}`)
              : Promise.reject(Error(`Unable to delete file ${path}`));
          })
        )
      );
  }

  private getFullPath(fileName: string) {
    const { dir } = this.config;
    return UrlUtil.getImagesPath(`${dir}/${fileName}`);
  }

  public formatDeleteFileResponse = (): IDeleteFileResponseSuccess => ({
    paths: this.pathsList,
    uploadType: this.type,
    isError: false
  });

  public formatDeleteFileErrorResponse = (
    error: Error
  ): IDeleteFileResponseError => ({
    isError: true,
    ErrorCode: ErrorCodes.DeleteFile,
    ErrorMessage: error
  });

  private isValidFile(file: ReadStream): Promise<boolean> {
    const { size } = statSync(file.path);
    const { maxSize, ext } = this.config;
    const currentFileExt = extname(<string>file.path);
    if (!ext.includes(currentFileExt)) {
      this.errors.push({
        isError: true,
        Search: {
          type: currentFileExt,
          ext
        },
        ErroCodes: ErrorCodes.Upload.Extension
      });
      return Promise.resolve(false);
    }
    if (size > maxSize) {
      this.errors.push({
        isError: true,
        Search: {
          name: basename(<string>file.path),
          maxSize
        },
        ErroCodes: ErrorCodes.Upload.MaxSize
      });
      return Promise.resolve(false);
    }
    // passing through here will allow the file
    this.allowedFiles.push(file);
    return Promise.resolve(true);
  }

  private isValidParams(): Promise<boolean> {
    const { maxFiles } = this.config;
    if (this.uploadedFiles.length > maxFiles) {
      this.errors.push({
        isError: true,
        Search: {
          maxFiles
        },
        ErroCodes: ErrorCodes.Upload.MaxFiles
      });
      return Promise.resolve(false);
    } else {
      return Promise.resolve(true);
    }
  }

  private UploadImage(tmpPath: string): Promise<IUploadFileResult | any> {
    const { resize, quality, allowAlpha } = this.config;
    return jimpRead(tmpPath)
      .then(img => img.resize(resize.w, resize.h).quality(quality))
      .then(img => {
        this.Id += 1;
        const ext =
          img.hasAlpha() && allowAlpha
            ? ".png"
            : extname(tmpPath) === ".gif"
            ? ".gif"
            : ".jpg";
        const fileName = `${uuid()}${ext}`;
        const dest = normalize(`${this.destinations}/${fileName}`);
        img.write(dest);
        console.log(`Added new file at ${dest}`);

        return {
          Id: this.Id,
          fileName
        };
      });
  }

  private formatFileResponse = ({
    fileName,
    Id
  }: IUploadFileResult): IUploadFileResponse => ({
    Id,
    fileName,
    UploadedPath: UrlUtil.toEndPointImage(fileName, this.config.dir)
  });

  public formatUploadResponseSuccess = (
    Files: IUploadFileResponse[]
  ): IUploadResponseSuccess => ({
    isError: this.errors.length,
    uploadType: this.type,
    Files,
    Errors: this.errors
  });

  public formatUploadResponseFailed = (
    error: Error
  ): IUploadResponseFailed => ({
    isError: true,
    ErrorCode: ErrorCodes.UploadFile,
    ErrorMessage: error,
    uploadType: this.type
  });

  public UploadFile(): Promise<IUploadFileResponse[]> {
    return (
      new Promise(resolve => resolve(true))
        // validations for files
        .then(() =>
          Promise.all(
            // validate params and merge the files validations
            // this should not effect the next .then() it must be always fired with or without error.
            [this.isValidParams()].concat(
              this.uploadedFiles.map((file: ReadStream) =>
                this.isValidFile(file)
              ) || []
            )
          )
        )
        // handle upload for those files that are allowed
        .then(() => {
          const uploadedFiles =
            this.allowedFiles.map((file: ReadStream) =>
              this.UploadImage(<string>file.path)
            ) || [];

          return Promise.all(uploadedFiles).then(uploadFiles => {
            if (uploadFiles.length) {
              return Promise.all(uploadFiles).then(
                (res: IUploadFileResult[]): IUploadFileResponse[] =>
                  res.map(
                    (currentRes: IUploadFileResult): IUploadFileResponse =>
                      this.formatFileResponse(currentRes)
                  )
              );
            }
            return Promise.resolve([]);
          });
        })
    );
  }
}

export default Upload;
