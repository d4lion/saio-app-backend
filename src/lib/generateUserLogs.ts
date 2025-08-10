import { db } from "./firabase"

interface SimpleUser {
  legal_id: string
  email: string
  password?: string
  name?: string
}

function obtenerFecha() {
  const fecha = new Date()
  const dia = String(fecha.getDate()).padStart(2, "0")
  const mes = String(fecha.getMonth() + 1).padStart(2, "0") // Enero = 0
  const anio = fecha.getFullYear()

  return `${dia}-${mes}-${anio}`
}

function obtenerHora() {
  const fecha = new Date()
  const horas = String(fecha.getHours()).padStart(2, "0")
  const minutos = String(fecha.getMinutes()).padStart(2, "0")
  const segundos = String(fecha.getSeconds()).padStart(2, "0")

  return `${horas}:${minutos}:${segundos}`
}

export function generateLogs(
  user: SimpleUser,
  event: {} = {
    event: "",
    status: "",
    message: "",
    metadata: {},
    createdAt: new Date(),
  },
  eventName: string,
  doc_id: string
) {
  try {
    db.collection("payouts")
      .doc(doc_id)
      .collection("logs")
      .doc(obtenerFecha())
      .collection(eventName)
      .doc(obtenerHora())
      .set(event)

    return true
  } catch (error) {
    return false
  }
}
