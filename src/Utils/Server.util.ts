export default {
  /**
   * Event listener for HTTP server "error" event.
   */

  onError: (serverPort: number | boolean) => (error: any): void => {
    console.log(error);
    if (!serverPort) {
      return error;
    }

    if (error.syscall !== "listen") {
      throw error;
    }

    const bind =
      typeof serverPort === "string"
        ? `Pipe ${serverPort}`
        : `Port ${serverPort}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  },

  /**
   * Event listener for HTTP server "listening" event.
   */

  onListening: (server: any, debugServer: any) => (): void => {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debugServer("Listening on " + bind);
  },

  /**
   * Normalize a port into a number, string, or false.
   */

  normalizePort: (val: string | number): boolean | number => {
    const port = Number(val);

    if (isNaN(port)) {
      // named pipe
      return port;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }
};
