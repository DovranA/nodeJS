import Device from '../models/Device.js'
import Room from '../models/Room.js'

export const addRoom = async (req, res, next) => {
  const newRoom = new Room(req.body)
  try {
    const savedRoom = await newRoom.save()
    res.status(200).json(savedRoom)
  } catch (err) {
    next(err)
  }
}
export const getRoomById = async (req, res, next) => {
  try {
    const rooms = await Room.findById(req.params.id)
    const devices = await Promise.all(
      rooms.devices.map((_id) => {
        return Device.findById(_id)
      })
    )
    res.status(200).json({ ...rooms._doc, devices })
  } catch (err) {
    next(err)
  }
}
export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find()
    res.status(200).json(rooms)
  } catch (err) {
    next(err)
  }
}
export const deleteRoom = async (req, res, next) => {
  const roomId = req.params.roomId
  try {
    const rooms = await Room.findById(roomId)
    rooms.devices.map(async (device) => {
      await Device.findByIdAndDelete(device)
    })
    await Room.findByIdAndDelete(roomId)
  } catch (err) {
    next(err)
  }
}

export const updateRoom = async (req, res, next) => {
  const roomId = req.params.roomId
  try {
    await Room.findByIdAndUpdate(roomId, { $set: req.body })
  } catch (err) {
    next(err)
  }
}
