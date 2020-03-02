const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Invite extends Model {
  constructor () {
    super({
      cmds: ['초대', 'invite'],
      description: 'cmd_invite_desc',
      category: 'category_general',
      commandname: 'cmd_invite',
      isownercmd: false,
      voiceChannel: false
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    Embed.addField(
      pkg.lang.get('invite'),
      pkg.lang.get('invite_desc', [
        `https://discordapp.com/api/oauth2/authorize?client_id=${
          pkg.client.user.id
        }&permissions=${pkg.client.config.bot.permission}&scope=bot`
      ]),
      true
    )
    pkg.msg.channel.send(Embed.get())
  }
}
