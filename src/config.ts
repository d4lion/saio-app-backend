export const config = {
  wompiEventKey:
    process.env.ENVIROMENT === "prod"
      ? process.env.WOMPI_PROD_EVENTS_KEY
      : process.env.WOMPI_SANDBOX_EVENTS_KEY,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY || "",
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  },
}
