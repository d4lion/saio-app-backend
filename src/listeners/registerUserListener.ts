import { eventBus } from "../lib/eventBus"
import { auth, db } from "../lib/firabase"

import { generateLogs } from "../lib/generateUserLogs"

interface SimpleUser {
  legal_id: string
  email: string
  password: string
  name: string
  phoneNumber: string
  transactionId: string
}

eventBus.on("firebase.create.user", (user: SimpleUser) => {
  auth
    .createUser({
      email: user.email,
      password: user.password,
    })
    .then((userCredential) => {
      db.collection("users").doc(userCredential.uid).set({
        legal_id: user.legal_id,
        email: user.email,
        name: user.name,
        role: "user",
        createdAt: new Date(),
      })

      generateLogs(
        user,
        {
          event: "register_user",
          status: "success",
          message: "User created successfully",
          user: {
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            legal_id: user.legal_id,
            uid: userCredential.uid,
          },
          metadata: {
            legal_id: user.legal_id,
          },
          createdAt: new Date(),
        },
        "register_user",
        user.transactionId
      )
    })
    .catch((error) => {
      generateLogs(
        user,
        {
          event: "register_user",
          status: "error",
          message: error.message,
          metadata: {
            legal_id: user.legal_id,
          },
          createdAt: new Date(),
        },
        "register_user",
        user.transactionId
      )
    })
})
