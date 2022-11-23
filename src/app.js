import express from 'express'
import session from 'express-session'
import userRouter from "./routes/user.router.js";
import cors from "cors"
import morgan from "morgan";

const app = express()
app.use(express.json())
app.use(morgan("common"))
app.use(cors());

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
app.use(userRouter)

app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint Not Found'
    })
})

export default app;
