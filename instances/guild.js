const Queue = require('./queue')
const Player = require('./player')
const { ms, s, m, h } = require('time-convert')
const format = (s, m, h) => {
  if (isNaN(s) || isNaN(m) || isNaN(h)) return '00:00:00'
  s = s < 10 ? `0${s}` : s
  m = m < 10 ? `0${m}` : m
  h = h < 10 ? `0${h}` : h
  return `${h}:${m}:${s}`
}

class LavalinkServer {
  constructor (manager, gID) {
    this.manager = manager
    this.guild = gID
    this.queue = new Queue()
    this.player = new Player(this)
    this.connection = null
    this.loop = false
    this.loopQueue = false
    this.volume = 0.5
  }

  async join (voiceChannel) {
    if (!voiceChannel) return
    this.connection = await this.manager.join({
      guild: this.guild,
      channel: voiceChannel,
      host: this.manager.client.config.lavalink[0].host
    })

    return true
  }

  disconnect () {
    if (!this.connection) return
    this.connection.disconnect()
    delete this.connection
    return true
  }

  setVolume (vol) {
    if (!vol || isNaN(vol)) return
    this.connection.volume(this.vol = vol)
    return vol
  }

  toggleLoop () {
    return (this.loop = !this.loop)
  }

  toggleLoopQueue () {
    return (this.loopQueue = !this.loopQueue)
  }

  stop () {
    delete this.queue
    this.queue = new Queue()
    if (!this.connection) return
    this.connection.stop()
    return true
  }

  skip () {
    if (!this.connection) return
    this.connection.stop()
    return true
  }

  pause () {
    if (!this.connection) return
    this.connection.pause(!this.connection.paused)
    return this.connection.paused
  }

  seek (s, m = 0, h = 0) {
    if (isNaN(s) || isNaN(m) || isNaN(h)) return
    const time = (s * 1000) + (m * 60 * 1000) + (h * 60 * 60 * 1000)
    this.connection.seek(time)
    return format(s, m, h)
  }

  toSongDuration (a) {
    const [hour, min, sec] = ms.to(h, m, s)(a || this.queue[0].info.length)
    return format(sec, min, hour)
  }

  songProgress (count = 20) {
    const result = new Array(count).fill('=')
    if (!this.connection) return result
    result[Math.floor((this.connection.state.position / this.queue[0].info.length) * count)] = '■'
    return result.join('')
  }
}

module.exports = LavalinkServer
