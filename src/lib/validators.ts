import crypto from "crypto"
import { config } from "../config"

const WOMPI_EVENT_KEY = config.wompiEventKey

export function isWompiEventVerified(
  transactionId: string,
  transactionStatus: string,
  transactionAmount: number,
  timeStamp: number,
  checkSum: string
) {
  const dataToSign = `${transactionId}${transactionStatus}${transactionAmount}${timeStamp}${WOMPI_EVENT_KEY}`

  const hashCalculado = crypto
    .createHash("sha256")
    .update(dataToSign)
    .digest("hex")

  return hashCalculado === checkSum
}
