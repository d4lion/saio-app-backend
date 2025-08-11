import { eventBus } from "../lib/eventBus"
import { db } from "../lib/firabase"

// Interface
import { WompiPayoutEvent } from "../interfaces/IWompi"

// Logger
import { createLogger } from "../lib/logger"

const logger = createLogger("WOMPI PAYOUT LISTENER")

logger.info("Initialized")

eventBus.on("wompi.payout.received", (event: WompiPayoutEvent) => {
  const { data } = event

  const { transaction } = data

  db.collection("payouts")
    .doc(transaction.id)
    .set({
      customer: {
        email: transaction.customer_email,
        name: transaction.customer_data.full_name,
        id: transaction.customer_data.legal_id,
      },
      user: {
        id: transaction.customer_data.customer_references[1]?.value.replace(
          " ",
          ""
        ),
        email: transaction.customer_data.customer_references[0]?.value.replace(
          " ",
          ""
        ),
      },
      transaction: {
        id: transaction.id,
        link: transaction.payment_link_id,
        status: transaction.status,
        payment: {
          method: transaction.payment_method.type,
          description: transaction.payment_method,
          amount: transaction.amount_in_cents,
        },
        created_at: transaction.created_at,
        finalized_at: transaction.finalized_at,
        reference: transaction.reference,
      },
      timestamp: event.timestamp,
      signature: event.signature,
      createdAt: new Date(),
    })
})

eventBus.on("wompi.payout.declined", (event: WompiPayoutEvent) => {
  logger.warn("Payout declined: " + event.data.transaction.id)
  db.collection("declined-payouts").doc(event.data.transaction.id).set(event)
})
