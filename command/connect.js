const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Connect extends Model {
  constructor () {
    super({
      cmds: ['connect', 'c', 'join', '들어와', '접속'],
      description: 'cmd_connect_desc',
      category: 'category_music',
      commandname: 'cmd_connect',
      isownercmd: false,
      voiceChannel: true
    })
  }

  run (pkg) {
    const Embed = new SmallRichEmbed()
    if (this.voiceChannel && !pkg.msg.member.voiceChannel) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('use_in_voice'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    const player = pkg.client.m.get(pkg.msg.guild.id)
    player.join(pkg.msg.member.voiceChannel.id)
    pkg.client.logger.info(`Joined voice channel: ${pkg.msg.member.voiceChannel.id}`)

    Embed.addField(
      pkg.lang.get('cmd_success'),
      pkg.lang.get('joined_voicechannel')
    )
    pkg.msg.channel.send(Embed.get())
  }
}
