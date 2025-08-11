import { createLogger } from "../lib/logger"

const logger = createLogger("EMAIL SERVICE")

class EmailService {
  constructor() {
    logger.info("Email service initialized")
  }

  sendEmail(from: string, to: string, subject: string, body: string) {
    console.log("Email sent", from, to, subject, body)
  }
}

export default EmailService
