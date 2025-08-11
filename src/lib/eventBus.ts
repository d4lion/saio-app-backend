import { EventEmitter } from "events"

import { createLogger } from "./logger"

const logger = createLogger("EVENT BUS")

logger.info("Initialized")

export const eventBus = new EventEmitter()
