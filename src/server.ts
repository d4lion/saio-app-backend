import dotenv from "dotenv"
dotenv.config()

// Import listeners
import "./listeners/listeners"

// Import app
import app from "./index"

app.listen(3000, () => {
  console.log("App running on port 3000")
})
