const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Support extends Model {
  constructor () {
    super({
      cmds: ['지원', 'support'],
      description: 'cmd_support_desc',
      category: 'category_general',
      commandname: 'cmd_support',
      isownercmd: false,
      voiceChannel: false
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    Embed.addField(
      pkg.lang.get('support'),
      pkg.lang.get('support_desc'),
      true
    )
    pkg.msg.channel.send(Embed.get())
  }
}
