import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './routers/authRouter.js'
import userRouter from './routers/userRouter.js'
import attendanceRouter from './routers/attendanceRouter.js'
import eventRouter from './routers/eventRouter.js'
import personalSummaryRouter from './routers/personalSummaryRouter.js'

import pool from './config/db.js' 

dotenv.config()

const PORT = process.env.SERVER_PORT || 5000
const HOST = process.env.SERVER_HOST || 'localhost'

const app = express()

app.use(cors())
app.use(express.json())

// log ทุก request (debug ง่ายมาก)
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`)
  next()
})
// ----------------------------------------------------------------------------

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/attendance', attendanceRouter)
app.use('/events', eventRouter)


// ----------------------------------------------------------------------------
// เติม ; ดักหน้าวงเล็บเพื่อป้องกัน Error 
;(async () => {
  try {
    await pool.execute('SELECT 1')
    console.log('Database Connected')
  } catch (err) {
    console.error('Database Error:', err.message)
  }
})()


app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/attendance', attendanceRouter)
app.use('/events', eventRouter)
app.use('/personal-summary', personalSummaryRouter)


app.get('/', (req, res) => {
  res.send('EasyCheck API is running')
})

app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500).json({ message: 'Something went wrong' })
})

// ================== start server ==================
app.listen(PORT, HOST, () => {
  console.log(`Server http://${HOST}:${PORT} is running ...`)
})