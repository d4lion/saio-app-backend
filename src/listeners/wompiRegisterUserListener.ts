import { eventBus } from "../lib/eventBus"
import { auth, db } from "../lib/firabase"

// Interface
import { WompiPayoutEvent } from "../interfaces/IWompi"

// Logger
import { createLogger } from "../lib/logger"

const logger = createLogger("WOMPI CREATE USER LISTENER")

logger.info("Initialized")

eventBus.on("wompi.event.firebase.create.user", (event: WompiPayoutEvent) => {
  const { data } = event
  const { transaction } = data

  const email = transaction.customer_data.customer_references[0]?.value
  const id = transaction.customer_data.customer_references[1]?.value

  // Por defecto el password es el id
  const password = id

  if (!email || !password) {
    return
  }

  auth
    .createUser({
      email,
      password,
    })
    .then((user) => {
      const userObject = {
        email,
        id,
        role: "user",
        name: transaction.customer_data.full_name,
        userUpdated: false,
        ticket:
          process.env.BOLETA_PREMIUM_SHORT_LINK === transaction.payment_link_id
            ? "premium"
            : "estandar",
        customer: {
          email: transaction.customer_email,
          name: transaction.customer_data.full_name,
          id: transaction.customer_data.legal_id,
        },
        transaction: {
          id: transaction.id,
          status: transaction.status,
          payment: {
            method: transaction.payment_method.type,
            description: transaction.payment_method,
            amount: transaction.amount_in_cents,
            link_id: transaction.payment_link_id,
          },
          created_at: transaction.created_at,
          finalized_at: transaction.finalized_at,
          reference: transaction.reference,
        },
        createdAt: new Date(),
      }

      db.collection("users").doc(user.uid).set(userObject)
    })
    .catch((error) => {
      db.collection("logs").add({
        error: error.errorInfo,
        email,
        createdAt: new Date(),
      })

      logger.error(error)
    })
})
