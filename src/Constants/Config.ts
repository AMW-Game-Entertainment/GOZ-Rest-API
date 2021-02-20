export default {
  Common: {
    env: process.env.NODE_ENV
  },
  Server: {
    Port: process.env.PORT,
    SocketIoPort: process.env.SOCKET_PORT,
    corsDomain: process.env.CORS_DOMAIN || "*",
    MainDomain: process.env.DOMAIN,
    SESSION_TOKEN: "A9435BB242~@##545FDSFB=====43245HB$21=0"
  },
  Connection: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    options: {
      host: process.env.DB_HOST || '',
      // port:     2087,
      logging: (data: object) => console.log(data),
      omitNull: true,
      dialect: "mysql",
      define: {
        underscored: true,
        freezeTableName: false,
        charset: "utf8",
        dialectOptions: {
          collate: "utf8_general_ci"
        },
        timestamps: true
      },
      pool: {
        max: 5,
        min: 0,
        idle: 1 // Keep this very low or it'll make all Lambda requests take longer
      }
    }
  }
};
