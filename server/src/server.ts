import App from "./config/app";
import logger from "./utils/logger.util";

const PORT = process.env.PORT || 8080;

App.listen(PORT, () => {
  logger.info(null, `Server listening on port ${PORT}!`);
});
