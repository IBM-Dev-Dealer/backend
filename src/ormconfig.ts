import {ConnectionOptions} from "typeorm";
import path from "path";
import * as dotenv from 'dotenv';
dotenv.config();
console.log("DB_HOST=", process.env.DB_HOST);

const isCompiled = path.extname(__filename).includes('js');
console.log("isCompiled", isCompiled);

export default {
  type: "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "dev_dealer",
  synchronize: !process.env.DB_NO_SYNC,
  logging: false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  entities: [
    `src/entity/**/*.${isCompiled ? "js" : "ts"}`
  ],
  migrations: [
    `src/migration/**/*.${isCompiled ? "js" : "ts"}`
  ],
  cli: {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
  },
} as ConnectionOptions;
