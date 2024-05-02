import mongoose from "mongoose";
import { Mutex } from "async-mutex";
import { MongoMemoryServer } from "mongodb-memory-server";

const { MONGO_HOST, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;

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
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null, mongoServer: null };
  // @ts-ignore
  global.mongoose = cached;
}

const connect = async () => {
  const release = await mutex.acquire();

  try {
    // Check if we're already connected or currently connecting to any kind of DB
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      let connectionString;

      if (process.env.USE_MOCK_DB) {
        console.log("USING MOCK DB");
        // If using a mock DB, initiate MongoMemoryServer
        if (!cached.mongoServer) {
          cached.mongoServer = await MongoMemoryServer.create();
        }
        connectionString = cached.mongoServer.getUri();
      } else {
        console.log("USING REAL DB");
        // Else construct the real DB connection string
        connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?authSource=admin`;
      }

      cached.promise = mongoose.connect(connectionString).then((mongoose) => {
        console.log(
          `Connected to ${process.env.USE_MOCK_DB ? "Mock" : "Mongo"} DB`
        );
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } finally {
    release();
  }
};

export default connect;
