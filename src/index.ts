import express, { Request, Response } from "express"

// Routes
import wompiEvents from "./routes/events/wompi.routes"

const app = express()

// Middleware
app.use(express.json({ limit: "50mb" }))

app.use("/events/wompi", wompiEvents)

app.get("/", (req: Request, res: Response) => {
  res.send("App is running just fine")
})

export default app
