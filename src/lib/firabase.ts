import admin from "firebase-admin"

// Import config
import { config } from "../config"

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    privateKey: config.firebase.privateKey,
    clientEmail: config.firebase.clientEmail,
  }),
  storageBucket: `${config.firebase.projectId}.appspot.com`,
})

export const db = admin.firestore()
export const auth = admin.auth()
export const storage = admin.storage()
