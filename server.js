import express from 'express'
import http from 'http'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
const app = express()
dotenv.config()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('Mongo db connected')
  } catch (err) {
    throw err
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('mongo db disconnected')
})

mongoose.connection.on('connected', () => {
  console.log('mongo connected')
})
import deviceRouter from './routes/device.js'
import roomRouter from './routes/room.js'
import { socket } from './socket.io/socket.js'
app.use('/api/device', deviceRouter)
app.use('/api/room', roomRouter)

const server = http.createServer(app)

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong!'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

socket(server)

server.listen(8000, '0.0.0.0', () => {
  // connect()
  console.log('server is ranning')
})
