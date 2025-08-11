import winston from "winston"

export function createLogger(label: string) {
  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.label({ label }),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message, label }) => {
        return `[${label}] ${timestamp} ${level}: ${message}`
      })
    ),
    transports: [new winston.transports.Console()],
  })
}
