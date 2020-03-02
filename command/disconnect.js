const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class Disconnect extends Model {
  constructor () {
    super({
      cmds: ['disconnect', 'dc', 'leave', '나가'],
      description: 'cmd_disconnect_desc',
      category: 'category_music',
      commandname: 'cmd_disconnect',
      isownercmd: false,
      voiceChannel: true
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    if (this.voiceChannel && !pkg.msg.member.voiceChannel) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('use_in_voice'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    const player = Player.playerInstance(pkg.client, pkg.msg.guild.id)
    player.loop = false
    player.loopQueue = false
    player.stop()
    await player.disconnect(pkg.msg.guild.id, pkg.msg.member.voiceChannel.id)
    pkg.msg.member.voiceChannel.leave()

    Embed.addField(
      pkg.lang.get('cmd_success'),
      pkg.lang.get('disconnected_voicechannel')
    )
    pkg.msg.channel.send(Embed.get())
  }
}
