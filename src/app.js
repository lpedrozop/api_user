import express from 'express'
import session from 'express-session'
import userRouter from "./routes/user.router.js";

const app = express()
app.use(express.json())

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
app.use(userRouter)

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint Not Found'
    })
})

export default app;