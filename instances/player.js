class LavalinkPlayer {
  constructor(server) {
    this.server = server
    this.playing = false
  }

  start() {
    const cT = this.server.queue[0]
    if (!cT || this.playing) return
    this.play(cT)
  }

  play(cT) {
    this.playing = true
    this.server.connection.play(cT.track)
    this.server.connection.once('end', this.end.bind(this))
  }

  end(data) {
    this.playing = false
    if (data.reason === 'REPLACED') return
    if (!this.server.loop) this.server.queue.shift()
    if (this.server.loopQueue) this.server.queue.add(this.server.currentTrack)
    if (this.server.queue.isLast) return this.server.disconnect()
    this.start()
  }
}

module.exports = LavalinkPlayer
