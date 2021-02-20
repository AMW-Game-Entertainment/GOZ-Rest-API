import { IGetUserResponseSuccess } from "../Modules/Interfaces/Users";

export default {
  RefactorProfilePageResponse: (profile: IGetUserResponseSuccess) => {
    const { Username, Email, ...newProfile } = profile.List[0];
    return {
      ...profile,
      List: [newProfile]
    };
  }
};
