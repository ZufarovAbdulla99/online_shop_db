import express from "express"
import { appConfig } from "./config/app.config.js"
import morgan from "morgan"
import bodyParser from "body-parser"
import { routes } from "./routes/index.js"

const app = express()

// Middleware
app.use(morgan("tiny"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Routes
app.use("/api/v1", routes)

// app listening
app.listen(appConfig.port, appConfig.host, () => {
    console.log(`Server running on ${appConfig.port} port...`);
})