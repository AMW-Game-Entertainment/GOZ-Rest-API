export default {
  MakeSocketId() {
    // declare
    let text = "";
    const currentDate = Date.now();
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    []
      .fill("", 0, Math.floor(Math.random() * possible.length + 5) || 10)
      .map(() => {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        return undefined;
      });
    return (
      Math.round(currentDate) +
      Math.floor(Math.random() * 1000000000000 + 10000000) +
      text
    );
  }
};
