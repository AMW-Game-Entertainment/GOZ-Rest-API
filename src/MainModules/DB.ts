import Sequelize from "sequelize";
import { Config } from "../Constants";

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

export default class DB {
  private connection: any;

  connect(): this {
    /* eslint-disable indent */
    const { database, username, password, options } = Config.Connection;
    /* eslint-enable indent */
    this.connection = new Sequelize(database, username, password, {
      ...options,
      operatorsAliases
    });

    this.connection
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err: object) => {
        console.error("Unable to connect to the database:", err);
      });

    return this;
  }

  execute(sqlQuery: string): any {
    return this.connection.query(sqlQuery);
  }
}
