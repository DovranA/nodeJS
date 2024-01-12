import db from '../utils/db.js'
export const addDevice = async (req, res, next) => {
  const { id, name, type, serial, ip, state } = req.body

  db.query(
    'INSERT INTO `device`(`name`, `type`, `serial`, `ip`, `state`, `roomId`) VALUES(?)',
    [[name, type, serial, ip, state, req.params.id]],
    (err, device) => {
      if (err) {
        return next(err)
      }
      if (device) {
        db.query(
          'DELETE FROM `temporal` WHERE id = ?',
          [id],
          (err, deleted) => {
            if (err) {
              return next(err)
            } else {
              db.query(
                'SELECT * FROM `device` WHERE id = ?',
                [device.insertId],
                (err, added) => {
                  if (err) {
                    return next(err)
                  }
                  const { roomId, ...dev } = added[0]
                  return res.status(200).json(dev)
                }
              )
            }
          }
        )
      }
    }
  )
}

export const newDevices = async (req, res, next) => {
  db.query('SELECT * FROM `temporal`', (err, temporal) => {
    if (err) {
      return next(err)
    }
    if (temporal) {
      return res.status(200).json(temporal)
    }
  })
}

export const allDevices = async (req, res, next) => {
  db.query(
    'SELECT `id`, `name`, `type`, `serial`, `state` FROM `device`',
    (err, device) => {
      if (err) {
        return next(err)
      }
      if (device.length) {
        return res.status(200).json(device)
      }
    }
  )
}

export const activeDevice = async (req, res, next) => {
  db.query(
    'SELECT `id`, `name`, `type`, `serial`, `state` FROM `device` WHERE state = 1',
    (err, active) => {
      if (err) {
        return next(err)
      }
      if (active.length) {
        return res.status(200).json(active)
      }
    }
  )
}

export const deleteDevice = async (req, res, next) => {
  db.query(
    'DELETE FROM `device` WHERE id = ?',
    [req.params.id],
    (err, device) => {
      if (err) {
        return next(err)
      }
      if (device.length) {
        return res.status(200).json('Enjam ustunlikli pozuldy')
      } else {
        return res.status(200).json('Enjam yok')
      }
    }
  )
}

export const updateDevice = (req, res, next) => {
  const { name, id } = req.body
  db.query(
    'UPDATE `device` SET name = ?, roomId = ? WHERE id = ?',
    [name, req.params.id, id],
    (err, updated) => {
      if (err) {
        console.log(err)
        return next(err)
      }
      if (updated) {
        return res.status(200).json('enjama uytgeshme girizildi')
      }
    }
  )
}
