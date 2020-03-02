const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Ping extends Model {
  constructor () {
    super({
      cmds: ['핑', 'ping', 'pong', '퐁'],
      description: 'cmd_ping_desc',
      category: 'category_general',
      commandname: 'cmd_ping',
      isownercmd: false,
      voiceChannel: false
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    Embed.addField(
      pkg.lang.get('ping'),
      pkg.lang.get('ping_content', [Math.round([pkg.client.ping])]),
      true
    )
    pkg.msg.channel.send(Embed.get())
  }
}
