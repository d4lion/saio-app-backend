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

  const transactionData = {
    timeStamp,
    transactionId,
    transactionStatus,
    transactionAmount,
    isVerified,
    user_id:
      req.body.data.transaction.customer_data.customer_references[1]?.value.replace(
        " ",
        ""
      ),
    signature: req.body.signature,
    customer_id: req.body.data.transaction.customer_data.legal_id,
    customer_email: req.body.data.transaction.customer_email,
    user_email:
      req.body.data.transaction.customer_data.customer_references[0]?.value.replace(
        " ",
        ""
      ),
    customer_name: req.body.data.transaction.customer_data.full_name,
    transaction_link: req.body.data.transaction.payment_link_id,
    phoneNumber: req.body.data.transaction.customer_data.phone_number,
  }

  eventBus.emit("wompi.payout.received", transactionData)

  if (transactionStatus !== "APPROVED") {
    return res.status(200).send("Event received")
  }

  eventBus.emit("firebase.create.user", {
    legal_id: transactionData.user_id,
    name: transactionData.customer_name,
    email: transactionData.user_email,
    password: transactionData.user_id,
    transactionId: transactionData.transactionId,
  })

  eventBus.emit("wompi.payout.success.send.mail", transactionData)

  res.status(200).send("Event received")
})

export default wompiRouter
