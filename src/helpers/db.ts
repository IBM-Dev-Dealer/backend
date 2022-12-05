import {Connection, createConnection, getConnection} from "typeorm";
import { Logger, LoggerTypes } from '../common/Logger';

import ORMConfig from "../ormconfig";

export const DBConnect = async () => {
  const logger = new Logger();
  let connection: Connection | undefined;
  try {
    connection = getConnection();
  } catch (connectionGetError) {
    logger.log(`Error while trying to get the DB connection ${connectionGetError}`, LoggerTypes.error);
  }

  try {
    if (connection) {
      if (!connection.isConnected) {
        await connection.connect();
      }
    } else {
      await createConnection(ORMConfig);
    }
    logger.log(`Database connection was successful!`, LoggerTypes.info);
  } catch (connectionError) {
    logger.log(`ERROR: Database connection failed!`, LoggerTypes.error);
    throw connectionError;
  }
};

export const TryDBConnect = async (onError: Function, next?: Function) => {
  try {
    await DBConnect();
    if (next) {
      next();
    }
  } catch (error) {
    onError();
  }
};

