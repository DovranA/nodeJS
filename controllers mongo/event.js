const Event = async (deviceId, eventType) => {
  try {
    await Event({ deviceId, eventType }).save()
    console.log('first')
  } catch (err) {
    next(err)
  }
}
