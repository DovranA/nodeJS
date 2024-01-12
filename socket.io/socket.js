import Server from 'socket.io'
import {
  addTemporal,
  updateDeviceId,
  updateDeviceSerial,
} from '../controllers/socket.js'
export const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  })
  io.on('connection', (socket) => {
    console.log('A user connected', socket.handshake.address)
    if (socket.handshake.query.type === 'device') {
      socket.on('newDevice', (data) => {
        addTemporal(data, socket.handshake.address)
      })
      socket.on('deviceSend', async (data) => {
        console.log('d', data)
        updateDeviceSerial(data, (err, result) => {
          if (err) {
            console.error('Error:', err)
          } else {
            io.sockets.emit('userReceiver', result)
          }
        })
      })
    }
    if (socket.handshake.query.type === 'user') {
      socket.on('userSend', async (data) => {
        console.log('u', data)
        updateDeviceId(data, (err, result) => {
          if (err) {
            console.log('2', err)
          } else {
            // console.log('first')
            io.sockets.emit('deviceReceiver', result)
            io.sockets.emit('userReceiver', data)
          }
        })
      })
    }
    socket.on('message', (data) => {
      console.log(data)
    })
    socket.on('disconnect', () => {
      console.log('A user disconnected', socket.handshake.address)
    })
  })
}
