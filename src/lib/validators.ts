import crypto from "crypto"
import { config } from "../config"
import { WompiPayoutEvent } from "../interfaces/IWompi"

const WOMPI_EVENT_KEY = config.wompiEventKey

export function isWompiEventVerified(wompiRequest: WompiPayoutEvent) {
  const { data, timestamp, signature } = wompiRequest
  const { transaction } = data

  const { id, status, amount_in_cents } = transaction

  const dataToSign = `${id}${status}${amount_in_cents}${timestamp}${WOMPI_EVENT_KEY}`

  const hashCalculado = crypto
    .createHash("sha256")
    .update(dataToSign)
    .digest("hex")

  return hashCalculado === signature.checksum
}
