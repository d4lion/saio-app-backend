import express, { Request, Response } from "express"

// Routes
import wompiEvents from "./routes/events/wompi.routes"

const app = express()

// Middleware
app.use(express.json())

app.use("/events/wompi", wompiEvents)

app.get("/", (req: Request, res: Response) => {
  res.send("App is running just fine in " + process.env.ENVIROMENT)
})

export default app
