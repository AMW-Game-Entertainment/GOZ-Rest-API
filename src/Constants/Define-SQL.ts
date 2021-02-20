import { DefineTable } from ".";

const {
  EVENTS,
  NOTES,
  POSTS,
  POST_IMAGES,
  POST_VIDEOS,
  POST_ACTION,
  ALBUMS,
  LIKES,
  COMMENTS,
  COMMENT_IMAGES,
  SHARES,
  HISTORY,
  USERS_PROFILE,
  USERS,
  ADVERTS
} = DefineTable;

export default {
  GET_EVENT: (EventId: number, PostId: number) =>
    EventId > 0
      ? `SELECT *
      FROM ${EVENTS}
      WHERE id = ${EventId}`
      : `SELECT *
         FROM ${EVENTS}
         WHERE KeyID = ${PostId}`,
  GET_EVENTS: (userId: number, limit: number) => `SELECT *
    FROM ${EVENTS}
    WHERE UserID = ${userId}
    ORDER BY id DESC
    LIMIT ${limit}`,
  GET_NOTES: (
    userId: number,
    limit: number
  ) => `SELECT ${NOTES}.*, ${POST_IMAGES}.Image, ${POST_IMAGES}.AlbumID
    FROM ${NOTES}
    JOIN ${POST_IMAGES} ON ${POST_IMAGES}.PostID = ${NOTES}.KeyID
    WHERE ${NOTES}.UserID = ${userId}
    ORDER BY ${NOTES}.id DESC
    LIMIT ${limit}`,
  GET_USER: (userId: number) => `SELECT
  ${USERS}.*,
  ${USERS_PROFILE}.*
  FROM ${USERS}
  JOIN ${USERS_PROFILE} AS ${USERS_PROFILE} ON ${USERS_PROFILE}.UserID = ${USERS}.id
  WHERE ${USERS}.id = ${userId}
  `,
  GET_POST: (postId: number) => `SELECT
   ${POSTS}.*,
   COUNT(${COMMENTS}.id) AS hasComments,
   COUNT(${LIKES}.id) AS hasLikes,
   COUNT(${SHARES}.id) AS hasShares,
   COUNT(${HISTORY}.id) AS hasHistory,
   ${POST_IMAGES}.Image AS PostImageSrc, ${POST_IMAGES}.AlbumID AS ImageAlbumID, ${POST_IMAGES}.id AS ImageID,
   ${POST_VIDEOS}.VideoID AS VideoSrc, ${POST_VIDEOS}.AlbumID AS VideoAlbumID, ${POST_VIDEOS}.id AS VideoID,
   ${POST_ACTION}.Type AS ActionType, ${POST_ACTION}.Action_Text AS ActionText, ${POST_ACTION}.Action_Link AS ActionLink,
   ${POST_ACTION}.Action_Link_Name AS ActionLinkName, ${POST_ACTION}.PostID AS ActionID,
   ${EVENTS}.id as EventID, ${EVENTS}.Type as EventType, ${EVENTS}.Title as EventTitle, ${EVENTS}.Cover as CoverImageSrc, ${EVENTS}.Price_Item,
   ${EVENTS}.Price_Berries_1 AS EventPrice_Berries_1, ${EVENTS}.Price_Berries_2 AS EventPrice_Berries_2, ${EVENTS}.Price_Berries_3 AS EventPrice_Berries_3,
   ${EVENTS}.End_Date AS Event_EndDate, ${EVENTS}.Start_Date AS Event_StartDate, ${EVENTS}.isEdited as isEventEdited,
   ${NOTES}.Title AS NotesTitle, ${NOTES}.Type AS NotesType, ${NOTES}.id AS NoteID,
   ${ALBUMS}.Type AS AlbumType, ${ALBUMS}.Title AS AlbumTitle, ${ALBUMS}.id AS AlbumID,
   ${ADVERTS}.id AS AdvertID, ${ADVERTS}.Title AS AdvertTitle, ${ADVERTS}.Type AS AdvertType, ${ADVERTS}.Status AS AdvertStatus, ${ADVERTS}.Created AS AdvertCreated,
   From_UserProfile.Profile_Image as FromProfile_Image,
   From_Profile.Char_Name as FromProfile_CharName,
   To_UserProfile.Profile_Image as ToProfile_Image,
   To_Profile.Char_Name as ToProfile_CharName
   FROM ${POSTS}
   LEFT JOIN (SELECT * FROM ${POST_IMAGES}) AS ${POST_IMAGES} ON ${POST_IMAGES}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${POST_VIDEOS}) AS ${POST_VIDEOS} ON ${POST_VIDEOS}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${POST_ACTION}) AS ${POST_ACTION} ON ${POST_ACTION}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${ALBUMS}) AS ${ALBUMS} ON ${ALBUMS}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${EVENTS}) AS ${EVENTS} ON ${EVENTS}.KeyID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${NOTES}) AS ${NOTES} ON ${NOTES}.KeyID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${ADVERTS}) AS ${ADVERTS} ON ${ADVERTS}.KeyID = ${ADVERTS}.id
   LEFT JOIN (SELECT * FROM ${COMMENTS} WHERE Type IN(25, 26, 27, 28, 29)) AS ${COMMENTS} ON ${COMMENTS}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${LIKES} WHERE Type IN(25, 26, 27, 28, 29)) AS ${LIKES} ON ${LIKES}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${SHARES} WHERE Type IN(25, 26, 27, 28, 29)) AS ${SHARES} ON ${SHARES}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${HISTORY} WHERE Type IN(25, 26, 27, 28, 29)) AS ${HISTORY} ON ${HISTORY}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${USERS_PROFILE}) AS From_UserProfile ON From_UserProfile.UserID = Posts.UserID
   LEFT JOIN (SELECT * FROM ${USERS_PROFILE}) AS To_UserProfile ON From_UserProfile.UserID = Posts.FromID
   LEFT JOIN (SELECT * FROM ${USERS}) AS From_Profile ON From_Profile.id = Posts.UserID
   LEFT JOIN (SELECT * FROM ${USERS}) AS To_Profile ON To_Profile.id = Posts.FromID
   WHERE ${POSTS}.id = ${postId}
   GROUP BY ${POSTS}.id`,
  GET_POSTS: (userId: number, lastId: number, limit: number) =>
    lastId > 0
      ? `SELECT
   ${POSTS}.*,
   COUNT(${COMMENTS}.id) AS hasComments,
   COUNT(${LIKES}.id) AS hasLikes,
   COUNT(${SHARES}.id) AS hasShares,
   COUNT(${HISTORY}.id) AS hasHistory,
   ${POST_IMAGES}.Image AS PostImageSrc, ${POST_IMAGES}.AlbumID AS ImageAlbumID, ${POST_IMAGES}.id AS ImageID,
   ${POST_VIDEOS}.VideoID AS VideoSrc, ${POST_VIDEOS}.AlbumID AS VideoAlbumID, ${POST_VIDEOS}.id AS VideoID,
   ${POST_ACTION}.Type AS ActionType, ${POST_ACTION}.Action_Text AS ActionText, ${POST_ACTION}.Action_Link AS ActionLink,
   ${POST_ACTION}.Action_Link_Name AS ActionLinkName, ${POST_ACTION}.PostID AS ActionID,
   ${EVENTS}.id as EventID, ${EVENTS}.Type as EventType, ${EVENTS}.Title as EventTitle, ${EVENTS}.Cover as CoverImageSrc, ${EVENTS}.Price_Item,
   ${EVENTS}.Price_Berries_1 AS EventPrice_Berries_1, ${EVENTS}.Price_Berries_2 AS EventPrice_Berries_2, ${EVENTS}.Price_Berries_3 AS EventPrice_Berries_3,
   ${EVENTS}.End_Date AS Event_EndDate, ${EVENTS}.Start_Date AS Event_StartDate, ${EVENTS}.isEdited as isEventEdited,
   ${NOTES}.Title AS NotesTitle, ${NOTES}.Type AS NotesType, ${NOTES}.id AS NoteID,
   ${ALBUMS}.Type AS AlbumType, ${ALBUMS}.Title AS AlbumTitle, ${ALBUMS}.id AS AlbumID,
   ${ADVERTS}.id AS AdvertID, ${ADVERTS}.Title AS AdvertTitle, ${ADVERTS}.Type AS AdvertType, ${ADVERTS}.Status AS AdvertStatus, ${ADVERTS}.Created AS AdvertCreated,
   From_UserProfile.Profile_Image as FromProfile_Image,
   From_Profile.Char_Name as FromProfile_CharName,
   To_UserProfile.Profile_Image as ToProfile_Image,
   To_Profile.Char_Name as ToProfile_CharName
   FROM ${POSTS}
   LEFT JOIN (SELECT * FROM ${POST_IMAGES}) AS ${POST_IMAGES} ON ${POST_IMAGES}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${POST_VIDEOS}) AS ${POST_VIDEOS} ON ${POST_VIDEOS}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${POST_ACTION}) AS ${POST_ACTION} ON ${POST_ACTION}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${ALBUMS}) AS ${ALBUMS} ON ${ALBUMS}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${EVENTS}) AS ${EVENTS} ON ${EVENTS}.KeyID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${NOTES}) AS ${NOTES} ON ${NOTES}.KeyID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${ADVERTS}) AS ${ADVERTS} ON ${ADVERTS}.KeyID = ${ADVERTS}.id
   LEFT JOIN (SELECT * FROM ${COMMENTS} WHERE Type IN(25, 26, 27, 28, 29)) AS ${COMMENTS} ON ${COMMENTS}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${LIKES} WHERE Type IN(25, 26, 27, 28, 29)) AS ${LIKES} ON ${LIKES}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${SHARES} WHERE Type IN(25, 26, 27, 28, 29)) AS ${SHARES} ON ${SHARES}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${HISTORY} WHERE Type IN(25, 26, 27, 28, 29)) AS ${HISTORY} ON ${HISTORY}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${USERS_PROFILE}) AS From_UserProfile ON From_UserProfile.UserID = Posts.UserID
   LEFT JOIN (SELECT * FROM ${USERS_PROFILE}) AS To_UserProfile ON From_UserProfile.UserID = Posts.FromID
   LEFT JOIN (SELECT * FROM ${USERS}) AS From_Profile ON From_Profile.id = Posts.UserID
   LEFT JOIN (SELECT * FROM ${USERS}) AS To_Profile ON To_Profile.id = Posts.FromID
   WHERE ${POSTS}.id < ${lastId} AND ${POSTS}.UserID = ${userId}
   GROUP BY ${POSTS}.id
   ORDER BY ${POSTS}.id DESC
   LIMIT ${limit}`
      : `SELECT
   ${POSTS}.*,
   COUNT(${COMMENTS}.id) AS hasComments,
   COUNT(${LIKES}.id) AS hasLikes,
   COUNT(${SHARES}.id) AS hasShares,
   COUNT(${HISTORY}.id) AS hasHistory,
   ${POST_IMAGES}.Image AS PostImageSrc, ${POST_IMAGES}.AlbumID AS ImageAlbumID, ${POST_IMAGES}.id AS ImageID,
   ${POST_VIDEOS}.VideoID AS VideoSrc, ${POST_VIDEOS}.AlbumID AS VideoAlbumID, ${POST_VIDEOS}.id AS VideoID,
   ${POST_ACTION}.Type AS ActionType, ${POST_ACTION}.Action_Text AS ActionText, ${POST_ACTION}.Action_Link AS ActionLink,
   ${POST_ACTION}.Action_Link_Name AS ActionLinkName, ${POST_ACTION}.PostID AS ActionID,
   ${EVENTS}.id as EventID, ${EVENTS}.Type as EventType, ${EVENTS}.Title as EventTitle, ${EVENTS}.Cover as CoverImageSrc, ${EVENTS}.Price_Item,
   ${EVENTS}.Price_Berries_1 AS EventPrice_Berries_1, ${EVENTS}.Price_Berries_2 AS EventPrice_Berries_2, ${EVENTS}.Price_Berries_3 AS EventPrice_Berries_3,
   ${EVENTS}.End_Date AS Event_EndDate, ${EVENTS}.Start_Date AS Event_StartDate, ${EVENTS}.isEdited as isEventEdited,
   ${NOTES}.Title AS NotesTitle, ${NOTES}.Type AS NotesType, ${NOTES}.id AS NoteID,
   ${ALBUMS}.Type AS AlbumType, ${ALBUMS}.Title AS AlbumTitle, ${ALBUMS}.id AS AlbumID,
   ${ADVERTS}.id AS AdvertID, ${ADVERTS}.Title AS AdvertTitle, ${ADVERTS}.Type AS AdvertType, ${ADVERTS}.Status AS AdvertStatus, ${ADVERTS}.Created AS AdvertCreated,
   From_UserProfile.Profile_Image as FromProfile_Image,
   From_Profile.Char_Name as FromProfile_CharName,
   To_UserProfile.Profile_Image as ToProfile_Image,
   To_Profile.Char_Name as ToProfile_CharName
   FROM ${POSTS}
   LEFT JOIN (SELECT * FROM ${POST_IMAGES}) AS ${POST_IMAGES} ON ${POST_IMAGES}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${POST_VIDEOS}) AS ${POST_VIDEOS} ON ${POST_VIDEOS}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${POST_ACTION}) AS ${POST_ACTION} ON ${POST_ACTION}.PostID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${ALBUMS}) AS ${ALBUMS} ON ${ALBUMS}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${EVENTS}) AS ${EVENTS} ON ${EVENTS}.KeyID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${NOTES}) AS ${NOTES} ON ${NOTES}.KeyID = ${POSTS}.id
   LEFT JOIN (SELECT * FROM ${ADVERTS}) AS ${ADVERTS} ON ${ADVERTS}.KeyID = ${ADVERTS}.id
   LEFT JOIN (SELECT * FROM ${COMMENTS} WHERE Type IN(25, 26, 27, 28, 29)) AS ${COMMENTS} ON ${COMMENTS}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${LIKES} WHERE Type IN(25, 26, 27, 28, 29)) AS ${LIKES} ON ${LIKES}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${SHARES} WHERE Type IN(25, 26, 27, 28, 29)) AS ${SHARES} ON ${SHARES}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${HISTORY} WHERE Type IN(25, 26, 27, 28, 29)) AS ${HISTORY} ON ${HISTORY}.KeyID = Posts.id
   LEFT JOIN (SELECT * FROM ${USERS_PROFILE}) AS From_UserProfile ON From_UserProfile.UserID = Posts.UserID
   LEFT JOIN (SELECT * FROM ${USERS_PROFILE}) AS To_UserProfile ON From_UserProfile.UserID = Posts.FromID
   LEFT JOIN (SELECT * FROM ${USERS}) AS From_Profile ON From_Profile.id = Posts.UserID
   LEFT JOIN (SELECT * FROM ${USERS}) AS To_Profile ON To_Profile.id = Posts.FromID
   WHERE ${POSTS}.UserID = ${userId}
   GROUP BY ${POSTS}.id
   ORDER BY ${POSTS}.id DESC
   LIMIT ${limit}`,
  GET_LIKES: (PostId: number, Type: number, Limit: number = 0) =>
    Limit
      ? `SELECT ${LIKES}.*, ${USERS}.Char_Name, ${USERS_PROFILE}.Profile_Image, ${USERS_PROFILE}.Cover_Image
       FROM ${LIKES}
      JOIN ${USERS} ON ${USERS}.id = ${LIKES}.UserID
      JOIN ${USERS_PROFILE} ON ${USERS_PROFILE}.UserID = ${LIKES}.UserID
      WHERE KeyID = ${PostId} AND Type = ${Type}
      ORDER BY ${LIKES}.id DESC
      LIMIT ${Limit}`
      : `SELECT ${LIKES}.*, ${USERS}.Char_Name, ${USERS_PROFILE}.Profile_Image, ${USERS_PROFILE}.Cover_Image
       FROM ${LIKES}
     JOIN ${USERS} ON ${USERS}.id = ${LIKES}.UserID
     JOIN ${USERS_PROFILE} ON ${USERS_PROFILE}.UserID = ${LIKES}.UserID
     WHERE KeyID = ${PostId} AND Type = ${Type}
     ORDER BY ${LIKES}.id DESC`,
  ADD_LIKE: (PostId: number, UserId: number, Type: number) =>
    `INSERT INTO ${LIKES} (KeyID, UserID, Type) VALUES (${PostId}, ${UserId}, ${Type})`,
  DELETE_LIKE: (LikeId: number) => `DELETE FROM ${LIKES} WHERE id = ${LikeId}`,
  DELETE_LIKES: (KeyId: number, Type: number) =>
    `DELETE FROM ${LIKES} WHERE KeyID = ${KeyId} AND Type = ${Type}`,
  GET_COMMENTS: (
    PostId: number,
    Type: number,
    CurrentFirstId: number,
    Limit: number = 0
  ) =>
  CurrentFirstId > 0
      ? `SELECT ${COMMENTS}.*, ${USERS}.Char_Name, ${USERS_PROFILE}.Profile_Image, ${USERS_PROFILE}.Cover_Image
       FROM ${COMMENTS}
      JOIN ${USERS} ON ${USERS}.id = ${COMMENTS}.UserID
      JOIN ${USERS_PROFILE} ON ${USERS_PROFILE}.UserID = ${COMMENTS}.UserID
      WHERE ${COMMENTS}.KeyID = ${PostId} AND ${COMMENTS}.Type = ${Type} AND ${COMMENTS}.id >= ${CurrentFirstId}
      ORDER BY ${COMMENTS}.id DESC
      LIMIT ${Limit}`
      : `SELECT ${COMMENTS}.*, ${USERS}.Char_Name, ${USERS_PROFILE}.Profile_Image, ${USERS_PROFILE}.Cover_Image
      FROM ${COMMENTS}
     JOIN ${USERS} ON ${USERS}.id = ${COMMENTS}.UserID
     JOIN ${USERS_PROFILE} ON ${USERS_PROFILE}.UserID = ${COMMENTS}.UserID
     WHERE ${COMMENTS}.KeyID = ${PostId} AND ${COMMENTS}.Type = ${Type}
     ORDER BY ${COMMENTS}.id DESC
     LIMIT ${Limit}`,
  GET_COMMENTS_PAGINITION: (
       PostId: number,
       Type: number,
       LastId: number,
       Limit: number = 0
     ) =>
       LastId > 0
         ? `SELECT ${COMMENTS}.*, ${USERS}.Char_Name, ${USERS_PROFILE}.Profile_Image, ${USERS_PROFILE}.Cover_Image
          FROM ${COMMENTS}
         JOIN ${USERS} ON ${USERS}.id = ${COMMENTS}.UserID
         JOIN ${USERS_PROFILE} ON ${USERS_PROFILE}.UserID = ${COMMENTS}.UserID
         WHERE ${COMMENTS}.KeyID = ${PostId} AND ${COMMENTS}.Type = ${Type} AND ${COMMENTS}.id < ${LastId}
         ORDER BY ${COMMENTS}.id DESC
         LIMIT ${Limit}`
         : `SELECT ${COMMENTS}.*, ${USERS}.Char_Name, ${USERS_PROFILE}.Profile_Image, ${USERS_PROFILE}.Cover_Image
         FROM ${COMMENTS}
        JOIN ${USERS} ON ${USERS}.id = ${COMMENTS}.UserID
        JOIN ${USERS_PROFILE} ON ${USERS_PROFILE}.UserID = ${COMMENTS}.UserID
        WHERE ${COMMENTS}.KeyID = ${PostId} AND ${COMMENTS}.Type = ${Type}
        ORDER BY ${COMMENTS}.id DESC
        LIMIT ${Limit}`,
  GET_FIRST_COMMENT: (PostId: number, Type: number) =>
    `SELECT ${COMMENTS}.id
         FROM ${COMMENTS}
        WHERE ${COMMENTS}.KeyID = ${PostId} AND ${COMMENTS}.Type = ${Type}
       ORDER BY ${COMMENTS}.id ASC
       LIMIT 1`,
  ADD_COMMENT: (PostId: number, Text: string, UserId: number, Type: number) =>
    `INSERT INTO ${COMMENTS} (KeyID, UserID, Type, Comment) VALUES (${PostId}, ${UserId}, ${Type}, '${Text}')`,
  DELETE_COMMENT: (CommentId: number) =>
    `DELETE FROM ${COMMENTS} WHERE id = ${CommentId}`,
  ADD_COMMENT_IMAGE: (CommentId: number, Image: string) =>
    `INSERT INTO ${COMMENT_IMAGES} (CommentID, Image) VALUES (${CommentId}, '${Image}')`,
  DELETE_COMMENT_IMAGE: (CommentId: number) =>
    `DELETE FROM ${COMMENT_IMAGES} WHERE CommentID = ${CommentId}`,
  GET_COMMENT_IMAGES: (CommentId: number) =>
    `SELECT Image FROM ${COMMENT_IMAGES} WHERE CommentID = ${CommentId}`
};
