import dotenv from "dotenv"
dotenv.config()

// Import listeners
import "./listeners/listeners"

// Import app
import app from "./index"

// Config
import { config } from "./config"

// Logger
import { createLogger } from "./lib/logger"

const logger = createLogger("SERVER")

app.listen(3000, () => {
  logger.info(`Enviroment: ${process.env.ENVIROMENT}`)
  logger.info(`Wompi event key: ${config.wompiEventKey}`)
  logger.info(`PAYMENT PREMIUM LINK: ${process.env.BOLETA_PREMIUM_SHORT_LINK}`)
  logger.info(
    `PAYMENT STANDARD LINK: ${process.env.BOLETA_ESTANDAR_SHORT_LINK}`
  )
  logger.info("App running on port 3000")
})
