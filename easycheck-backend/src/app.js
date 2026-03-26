import express from 'express'
import cors from 'cors' // ทำให้ฟ้อนเอนกับแบคเอนคุยกันรู้เรื่อง
import dotenv from 'dotenv'

import authRouter from './routers/authRouter.js'
import userRouter from './routers/userRouter.js'
import attendanceRouter from './routers/attendanceRouter.js'
import eventRouter from './routers/eventRouter.js'

import leaveRouter from './routers/leaveRouter.js'
import personalSummaryRouter from './routers/personalSummaryRouter.js'

import adminRouter from './routers/adminRouter.js'


import pool from './config/db.js'

dotenv.config()

const PORT = 5000
const HOST = '0.0.0.0'
const app = express()

// middleware
app.use(cors())
app.use(express.json()) // แปลง JSON มาเปนภาษาที่เราอ่านรู้เรื่อง
app.use(express.urlencoded({ extended: true }))
// ---------------------------------------------------------------------------------------------


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})


// router
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/attendance', attendanceRouter)
app.use('/events', eventRouter)

app.use('/leave', leaveRouter)
app.use('/personal-summary', personalSummaryRouter)

app.use('/admin', adminRouter)


// ---------------------------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('EasyCheck API is running 🚀')
})

;(async () => {
  try {
    await pool.execute('SELECT 1')
    console.log('✅ Database Connected')
  } catch (err) {
    console.error('❌ Database Error:', err.message)
  }
})()

app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err)
  res.status(500).json({
    message: 'Server Error',
    error: err.message
  })
})


app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
})