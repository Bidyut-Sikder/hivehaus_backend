/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config/config";
import app from "./app";

let server: Server;

async function main() {
  try {
    if (process.env.NODE_ENV === "development") {
      await mongoose.connect(
        process.env.MONGODB_CONNECTION_STRING_DEV as string
      );
      console.log("Connecting to MongoDB Development");

      server = app.listen(process.env.PORT, () => {
        console.log(`Workspace is listing on port ${config.port}`);
      });
      return;
    }

    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("connected to production");

    server = app.listen(process.env.PORT, () => {
      console.log(`Workspace is listing on port ${config.port}`);
    });
    console.log("Mongodb is connected");
  } catch (error) {
    console.log(error);
  }
}

main();
