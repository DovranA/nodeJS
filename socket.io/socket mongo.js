import Server from 'socket.io'
import Device from '../models/Device.js'
import Temporal from '../models/Temporal.js'
import db from '../utils/db.js'
export const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  })
  const types = ['akylly chyra']
  io.on('connection', (socket) => {
    console.log('A user connected', socket.handshake.address)
    if (socket.handshake.query.type === 'device') {
      socket.on('newDevice', async (data) => {
        try {
          const oldDevice = await Device.findOne({ serial: data.serial })
          if (!oldDevice) {
            const oldTemp = await Temporal.findOne({ serial: data.serial })
            if (!oldTemp) {
              try {
                const type = types[Math.round(data.serial / 100) - 1]
                const temporal = new Temporal({
                  serial: data.serial,
                  ip: socket.handshake.address,
                  type,
                })
                await temporal.save()

                io.sockets.emit('radar', 'newDevice')
                console.log('radar')
              } catch (err) {
                console.log(err)
              }
            }
          }
        } catch (error) {
          console.log(error)
        }
      })
      socket.on('deviceSend', async ({ serial, state }) => {
        console.log(serial, state)
        try {
          const device = await Device.findOneAndUpdate(
            { serial: serial },
            { state: state },
            { returnDocument: 'after' }
          )
          io.sockets.emit('userReceiver', {
            _id: device._id,
            state: device.state,
          })
        } catch (err) {
          console.log(err)
        }
      })
    }

    if (socket.handshake.query.type === 'user') {
      console.log('test')
      socket.on('userSend', async ({ _id, state }) => {
        console.log(_id, state)
        try {
          const device = await Device.findByIdAndUpdate(
            _id,
            { state: state },
            { returnDocument: 'after' }
          )
          io.sockets.emit('userReceiver', {
            _id: device._id,
            state: device.state,
          })
          io.sockets.emit('deviceReceiver', {
            serial: device.serial,
            state: device.state,
          })
        } catch (err) {
          console.log(err)
        }
      })
    }
    socket.on('disconnect', () => {
      console.log('A user disconnected', socket.handshake.address)
    })
  })
}
