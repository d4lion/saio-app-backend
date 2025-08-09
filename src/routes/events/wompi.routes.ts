import { Router, Request } from "express"

// Import interfaces
import { WompiPayoutEvent } from "../../interfaces/IWompi"

// Import validators
import { isWompiEventVerified } from "../../lib/validators"

// Event bus
import { eventBus } from "../../lib/eventBus"

const wompiRouter = Router()

wompiRouter.post("/payouts", (req: Request<{}, {}, WompiPayoutEvent>, res) => {
  // Step 1
  const transactionId = req.body.data.transaction.id
  const transactionStatus = req.body.data.transaction.status
  const transactionAmount = req.body.data.transaction.amount_in_cents

  // Step 2
  const timeStamp = req.body.timestamp

  const isVerified = isWompiEventVerified(
    transactionId,
    transactionStatus,
    transactionAmount,
    timeStamp,
    req.body.signature.checksum
  )

  if (!isVerified) {
    return res.status(400).send("Invalid event")
  }

  eventBus.emit("wompi.payout.received", {
    timeStamp,
    transactionId,
    transactionStatus,
    transactionAmount,
    isVerified,
    legal_id: req.body.data.transaction.customer_data.legal_id,
    signature: req.body.signature,
  })

  eventBus.emit("wompi.payout.success.send.mail", {
    legal_id: req.body.data.transaction.customer_data.legal_id,
  })

  res.status(200).send("Event received")
})

export default wompiRouter
