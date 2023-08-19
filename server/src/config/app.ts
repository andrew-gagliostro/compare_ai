import correlator from "express-correlation-id";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { RegisterRoutes } from "../routes/routes";
import logger from "../utils/logger.util";
import * as swaggerUi from "swagger-ui-express";
import { requestInterceptor } from "../utils/requestInterceptor.util";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    dotenv.config();

    this.config();

    this.routeHandler();
  }

  private config(): void {
    nextApp.prepare().then(() => {
      this.app.use(bodyParser.json({ limit: "50mb" }));

      this.app.use(bodyParser.urlencoded({ extended: false }));

      this.app.use(cors());

      this.app.use(cookieParser());

      this.app.use(correlator());

      this.app.use(requestInterceptor);
      this.app.get("*", (req, res) => {
        return handle(req, res);
      });
    });
  }

  private routeHandler(): void {
    RegisterRoutes(this.app); // tsoa generated routes

    try {
      const YAML = require("yamljs");
      const swaggerDoc = YAML.load("./openapi.yaml"); // yamljs requires path to be supplied w/ single quotes
      //exposing endpoint for Identity Provider's Swagger UI API Documentation
      this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    } catch (err) {
      logger.error(null, "Unable to load swagger-ui for openapi.yaml", err);
    }
  }
}

export default new App().app;
