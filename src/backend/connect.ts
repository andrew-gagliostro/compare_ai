import mongoose from "mongoose";
import { Mutex } from "async-mutex";
import { MongoMemoryServer } from "mongodb-memory-server";

const {
  MONGO_HOST,
  MONGO_DB,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_CONNECTION_STRING,
} = process.env;

const errorMessage = (missing: string) =>
  `Please define the ${missing} environment variable inside .env.local`;

if (!MONGO_HOST) {
  throw new Error(errorMessage("MONGO_HOST"));
}

if (!MONGO_DB) {
  throw new Error(errorMessage("MONGO_DB"));
}

if (!MONGO_USER) {
  throw new Error(errorMessage("MONGO_USER"));
}

if (!MONGO_PASSWORD) {
  throw new Error(errorMessage("MONGO_PASSWORD"));
}

const mutex = new Mutex();
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  // @ts-ignore
  global.mongoose = { conn: null, promise: null };
}

let seeded = false;

const connect = async () => {
  const release = await mutex.acquire();
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      let connectionString = "";
      if (MONGO_CONNECTION_STRING) {
        connectionString = MONGO_CONNECTION_STRING;
      } else {
        connectionString = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}?authsource=admin`;
      }

      cached.promise = mongoose.connect(connectionString).then((res) => res);
      console.log(connectionString);
      console.trace("CONNECTED TO MONGO");
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } finally {
    release();
  }
};

export default connect;
