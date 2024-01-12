import Server from 'socket.io'
import Device from './models/Device.js'
import Temporal from './models/Temporal.js'
const socketio = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    console.log('A user connected', socket.handshake)
    if (socket.handshake.query.type === 'device') {
      socket.on('newDevice', async (data) => {
        try {
          const oldDevice = await Device.find({ serial: data.serial })
          if (!oldDevice.length) {
            console.log(data)
            try {
              const temporal = new Temporal({
                ...data,
                ip: socket.handshake.address,
              })
              await temporal.save()
              io.emit('radar', 'newDevice')
            } catch (err) {
              console.log(err)
            }
          }
        } catch (error) {
          console.log(err)
        }
      })
    }
    if (socket.handshake.query.type === 'user') {
      socket.userId = socket.id
    }
    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })
}

export default socketio
