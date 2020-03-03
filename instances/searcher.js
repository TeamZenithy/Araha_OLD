const fetch = require('node-fetch')
class LavalinkSearcher {
  constructor(lavalink) {
    this.host = lavalink.host
    this.port = lavalink.port
    this.pass = lavalink.pw
  }

  fetch (query) {
    return new Promise((res, rej) => {
      fetch(
        `http://${this.host}:${this.port}/loadtracks?identifier=${query}`,
        { headers: { Authorization: this.pass } }
      )
        .then(result => res(result.json()))
        .catch(rej)
    })
  }
}

module.exports = LavalinkSearcher
