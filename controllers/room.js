import db from '../utils/db.js'
export const addRoom = async (req, res, next) => {
  db.query(
    'INSERT INTO `room`(`name`) VALUES(?)',
    [req.body.name],
    (err, room) => {
      if (err) {
        next(err)
      }
      if (room) {
        db.query(
          'SELECT * FROM `room` WHERE id = ?',
          [room.insertId],
          (err, addedRoom) => {
            return res.status(200).json(addedRoom[0])
          }
        )
      }
    }
  )
}
export const getRoomById = async (req, res, next) => {
  db.query(
    'SELECT * FROM `room` WHERE id = ?',
    [req.params.id],
    (err, room) => {
      if (err) {
        return next(err)
      }
      if (room.length) {
        db.query(
          'SELECT `id`, `name`, `type`, `serial`, `state` FROM `device` WHERE roomId = ?',
          [req.params.id],
          (err, devices) => {
            if (err) {
              return next(err)
            }
            return res.status(200).json({ ...room[0], devices })
          }
        )
      }
    }
  )
}
export const getAllRooms = (req, res, next) => {
  db.query('SELECT * FROM `room`', (err, rooms) => {
    if (err) {
      return next(err)
    }
    if (rooms.length) {
      return res.status(200).json(rooms)
    }
  })
}
export const deleteRoom = (req, res, next) => {
  db.query('DELETE FROM `room` WHERE id = ?', [req.params.id], (err, room) => {
    if (err) {
      return next(err)
    }
    if (room) {
      return res.status(200).json('otag ustunlikli posuldy')
    }
  })
}

export const updateRoom = async (req, res, next) => {
  db.query(
    'UPDATE `room` SET `name` = ? WHERE id = ?',
    [req.body.name, req.params.id],
    (err, room) => {
      if (err) {
        return next(err)
      }
      if (room) {
        return res.status(200).json(room)
      }
    }
  )
}
