import { Router, Request, Response, NextFunction } from "express"

// Import interfaces
import { WompiPayoutEvent } from "../../interfaces/IWompi"

// Import validators
import { isWompiEventVerified } from "../../lib/validators"

// Event bus
import { eventBus } from "../../lib/eventBus"

// Logger
import { createLogger } from "../../lib/logger"

const logger = createLogger("WOMPI ROUTES")

const wompiRouter = Router()

const middleware = (
  req: Request<{}, {}, WompiPayoutEvent>,
  res: Response,
  next: NextFunction
) => {
  const WompiRequest = req.body

  const { data } = WompiRequest
  const { transaction } = data

  // Payment links
  const premiumPaymentLink = process.env.BOLETA_PREMIUM_SHORT_LINK
  const standardPaymentLink = process.env.BOLETA_ESTANDAR_SHORT_LINK

  const isVerified = isWompiEventVerified(WompiRequest)

  if (!isVerified) {
    logger.warn("Invalid event", transaction.id)
    return res.status(200).send("Invalid event")
  }

  if (
    transaction.payment_link_id != premiumPaymentLink &&
    transaction.payment_link_id != standardPaymentLink
  ) {
    logger.warn("Invalid payment link", transaction.id)
    return res.status(200).send("Invalid payment link")
  }

  if (transaction.status == "DECLINED") {
    logger.warn("Payment declined", transaction.id)
    eventBus.emit("wompi.payout.declined", WompiRequest)

    return res.status(200).send("Payment declined")
  }

  if (transaction.status !== "APPROVED") {
    logger.warn("Payment not approved", transaction.id)
    return res.status(200).send("Payment not approved")
  }

  next()
}

wompiRouter.post(
  "/payouts",
  middleware,
  (req: Request<{}, {}, WompiPayoutEvent>, res: Response) => {
    const WompiRequest = req.body

    eventBus.emit("wompi.payout.received", WompiRequest)
    eventBus.emit("wompi.event.firebase.create.user", WompiRequest)
    //eventBus.emit("wompi.payout.success.send.mail", WompiRequest)

    logger.info("Event received", WompiRequest.data.transaction.id)

    res.status(200).send("Event received")
  }
)

export default wompiRouter
