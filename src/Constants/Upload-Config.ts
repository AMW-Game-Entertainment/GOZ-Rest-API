export default {
  CommentImage: {
    dir: "Comments_Images",
    ext: [".png", ".jpg", ".jpeg", ".gif"],
    maxSize: 150000,
    maxFiles: 7,
    resize: {
      w: 1200,
      h: 628
    },
    quality: 80,
    allowAlpha: false
  }
};
