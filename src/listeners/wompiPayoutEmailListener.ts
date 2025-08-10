import { eventBus } from "../lib/eventBus"
import { db } from "../lib/firabase"

eventBus.on("wompi.payout.success.send.mail", (event) => {
  db.collection("payouts")
    .doc(event.legal_id)
    .collection("logs")
    .doc("send_email")
    .set({
      event: "send_email",
      status: "success",
      metadata: {
        legal_id: event.legal_id,
      },
      createdAt: new Date(),
    })
})
