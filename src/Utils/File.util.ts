import { existsSync, unlinkSync } from "fs";

export default {
  deleteFile(path: string): Boolean {
    if (path && existsSync(path)) {
      unlinkSync(path);
      return true;
    } else {
      return false;
    }
  },
};
