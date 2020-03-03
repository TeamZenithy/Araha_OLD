const Guild = require('./guild')
class LavalinkGuilds extends Map {
  constructor (manager) {
    super()
    this.manager = manager
  }

  get (gID) {
    const here = super.get(gID)
    if (!here) return this.set(gID)
    return here
  }

  set (gID) {
    const here = new Guild(this.manager, gID)
    super.set(gID, here)
    return here
  }
}
module.exports = LavalinkGuilds
