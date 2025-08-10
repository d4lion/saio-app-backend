import { eventBus } from "../lib/eventBus"
import { db } from "../lib/firabase"

import { generateLogs } from "../lib/generateUserLogs"

interface WompiPayoutEvent {
  timeStamp: number
  transactionId: string
  transactionStatus: string
  transactionAmount: number
  isVerified: boolean
  user_id: string
  signature: string
  customer_email: string
  customer_name: string
  customer_id: string
  user_email: string
  transaction_link: string
}

eventBus.on("wompi.payout.received", (event: WompiPayoutEvent) => {
  const {
    timeStamp,
    transactionId,
    transactionStatus,
    transactionAmount,
    isVerified,
    user_id,
    customer_email,
    customer_name,
    customer_id,
    user_email,
    transaction_link,
  } = event

  db.collection("payouts")
    .doc(transactionId)
    .set({
      customer: {
        email: customer_email,
        name: customer_name,
        id: customer_id,
      },
      user: {
        id: user_id,
        email: user_email,
      },
      transaction: {
        id: transactionId,
        link: transaction_link,
        status: transactionStatus,
        amount: transactionAmount,
        is_verified: isVerified,
      },
      timestamp: timeStamp,
      signature: event.signature,
      createdAt: new Date(),
    })

  generateLogs(
    {
      legal_id: user_id,
      email: customer_email,
      name: customer_name,
    },
    {
      event: "register_payout",
      status: "success",
      metadata: {
        legal_id: user_id,
        amount: transactionAmount,
      },
      createdAt: new Date(),
    },
    "register_payout",
    transactionId
  )
})
