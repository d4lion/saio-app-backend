import { eventBus } from "../lib/eventBus"
import { db } from "../lib/firabase"

interface WompiPayoutEvent {
  timeStamp: number
  transactionId: string
  transactionStatus: string
  transactionAmount: number
  isVerified: boolean
  legal_id: string
  signature: string
}

eventBus.on("wompi.payout.received", (event: WompiPayoutEvent) => {
  console.log(event)

  const {
    timeStamp,
    transactionId,
    transactionStatus,
    transactionAmount,
    isVerified,
    legal_id,
  } = event

  db.collection("payouts").doc(legal_id).set({
    transactionId,
    transactionStatus,
    transactionAmount,
    timeStamp,
    isVerified,
    createdAt: new Date(),
    signature: event.signature,
  })

  db.collection("payouts")
    .doc(legal_id)
    .collection("logs")
    .doc("register_payout")
    .set({
      event: "register_payout",
      status: "success",
      metadata: {
        transactionId: transactionId,
        amount: transactionAmount,
      },
      createdAt: new Date(),
    })
})
