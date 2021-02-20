import { isEmpty } from "lodash";
import { resolve } from "path";
import { URL } from "url";
import { Config } from "../Constants";

const {
  Server: { MainDomain }
} = Config;

export default {
  toEndPoint(url: string): string {
    if (isEmpty(url)) {
      return url;
    }
    if (url.includes("../")) {
      return `${MainDomain}/${url.replace(/^.+\.\//, "")}`;
    } else if (!url.includes("http")) {
      return `${MainDomain}/${url}`;
    }
    return url;
  },
  toResourcesPath(path: string): string {
    const imageRegex: RegExp = /((http(s?):\/\/)|(www?)?).([a-zA-Z0-9-_.:]+).([a-z])?(\/)?(public\/)?(Images\/)/g;
    if (isEmpty(path)) {
      return path;
    }
    if (path.includes("../")) {
      return resolve(__dirname, `../../public/${path.replace(/^.+\.\//, "")}`);
    } else if (imageRegex.test(path)) {
      return resolve(__dirname, `../../public/${path.replace(imageRegex, "")}`);
    }
    return path;
  },
  getImagesPath(path: string): string {
    return resolve(__dirname, `../../public/Images/${path}`);
  },
  toEndPointImage(fileName: string, dir: string): string {
    return `${MainDomain}/Images/${dir}/${fileName}`;
  },
  toResourcesRelativePathDB(url: string): string {
    if (isEmpty(url)) {
      return url;
    }
    return `../../${new URL(url).pathname}`;
  }
};
