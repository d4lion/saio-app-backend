import { eventBus } from "../lib/eventBus"

import { generateLogs } from "../lib/generateUserLogs"

eventBus.on("wompi.payout.success.send.mail", (event) => {
  generateLogs(
    {
      legal_id: event.transactionId,
      email: event.customer_email,
      name: event.customer_name,
    },
    {
      event: "send_email",
      status: "success",
      metadata: {
        legal_id: event.legal_id,
      },
      createdAt: new Date(),
    },
    "send_email",
    event.transactionId
  )
})
