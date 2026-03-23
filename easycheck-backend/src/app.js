import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './routers/authRouter.js'
// import userRouter from './routers/userRouter.js'
// import attendanceRouter from './routers/attendanceRouter.js'
// import eventRouter from './routers/eventRouter.js'

dotenv.config()

const PORT = process.env.SERVER_PORT || 5000
const HOST = process.env.SERVER_HOST || 'localhost'

const app = express()
// middleware
app.use(cors())
app.use(express.json())

// routers
app.use('/auth', authRouter)
// app.use('/users', userRouter)
// app.use('/attendance', attendanceRouter)
// app.use('/events', eventRouter)


app.listen(PORT, HOST, () => {
    console.log(`Server http://${HOST}:${PORT} is running ...`)
})