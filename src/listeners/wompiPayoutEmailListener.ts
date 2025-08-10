import { eventBus } from "../lib/eventBus"

// Interface
import { WompiPayoutEvent } from "../interfaces/IWompi"

// Email service
import { sendMail } from "../lib/sendMail"

eventBus.on("wompi.payout.success.send.mail", (event: WompiPayoutEvent) => {
  const email =
    event.data.transaction.customer_data.customer_references[0]?.value.replace(
      " ",
      ""
    )

  if (!email) {
    return
  }

  sendMail.sendEmail("saio.com", email, "Prueba", "Hola cuerpo de la prueba")
})
