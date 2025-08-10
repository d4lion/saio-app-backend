import { Router, Request, Response, NextFunction } from "express"

// Import interfaces
import { WompiPayoutEvent } from "../../interfaces/IWompi"

// Import validators
import { isWompiEventVerified } from "../../lib/validators"

// Event bus
import { eventBus } from "../../lib/eventBus"

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
    return res.status(200).send("Invalid event")
  }

  if (
    transaction.payment_link_id != premiumPaymentLink &&
    transaction.payment_link_id != standardPaymentLink
  ) {
    return res.status(200).send("Invalid payment link")
  }

  if (transaction.status !== "APPROVED") {
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

    res.status(200).send("Event received")
  }
)

export default wompiRouter
