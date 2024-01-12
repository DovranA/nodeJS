import { ObjectId } from 'mongodb'
import Device from '../models/Device.js'
import Room from '../models/Room.js'
import Temporal from '../models/Temporal.js'
import db from '../utils/db.js'
export const addDevice = async (req, res, next) => {
  const roomId = req.params.roomId
  console.log('roomid', roomId)
  const newDevice = new Device(req.body)
  try {
    const savedDevice = await newDevice.save()
    try {
      await Room.findByIdAndUpdate(
        roomId,
        {
          $push: {
            devices: savedDevice._id,
          },
        },
        { new: true }
      )

      await Temporal.findByIdAndDelete(req.body._id)
        .then((deletedTemporal) => {
          console.log('Deleted Temporal:', deletedTemporal)
        })
        .catch((err) => {
          console.log('Error deleting Temporal:', err)
        })

      res.status(200).json(savedDevice)
    } catch (err) {
      console.log('Error updating Room:', err)
      next(err)
    }
  } catch (err) {
    console.log('Error saving Device:', err)
    next(err)
  }
}

export const allDevices = async (req, res, next) => {
  try {
    const device = await Device.find()
    res.status(200).json(device)
  } catch (err) {
    next(err)
  }
}
export const newDevices = async (req, res, next) => {
  try {
    const devices = await Temporal.find()
    res.status(200).json(devices)
  } catch (err) {
    next(err)
  }
}

export const activeDevice = async (req, res, next) => {
  try {
    const active = await Device.find({ state: true })
    res.status(200).json(active)
  } catch (err) {
    next(err)
  }
}

export const deleteDevice = async (req, res, next) => {
  const deviceId = req.params.deviceId
  console.log(deviceId)
  try {
    const rooms = await Room.find()
    let roomId
    rooms.map((room) => {
      if (room.devices.includes(deviceId)) {
        roomId = room._id
      }
    })
    try {
      await Room.findByIdAndUpdate(
        roomId,
        {
          $pull: {
            devices: deviceId,
          },
        },
        { new: true }
      )
    } catch (error) {
      next(error)
    }
    await Device.findByIdAndDelete(deviceId)
    res.status(200).json(`device with id ${deviceId} is deleted`)
  } catch (err) {
    next(err)
  }
}

export const updateDevice = async (req, res, next) => {
  const roomId = req.params.roomId
  try {
    await Device.findByIdAndUpdate(req.body._id, { $set: req.body })
  } catch (error) {
    next(error)
  }
  try {
    const rooms = await Room.find()
    let oldRoomId
    rooms.map((room) => {
      if (room.devices.includes(req.body._id)) {
        oldRoomId = room._id
      }
    })
    try {
      await Room.findByIdAndUpdate(
        oldRoomId,
        {
          $pull: {
            devices: req.body._id,
          },
        },
        { new: true }
      )
    } catch (error) {
      next(error)
    }
    try {
      await Room.findByIdAndUpdate(
        roomId,
        {
          $push: {
            devices: req.body._id,
          },
        },
        { new: true }
      )
    } catch (error) {
      next(error)
    }
    const room = await Room.findById(oldRoomId)
    const devices = await Promise.all(
      room.devices.map((_id) => {
        return Device.findById(_id)
      })
    )
    // console.log({ ...room._doc, devices })
    // res.status(200).json({ ...room, devices })
  } catch (err) {
    next(err)
  }
}
