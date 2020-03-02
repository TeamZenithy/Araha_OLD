const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class Volume extends Model {
  constructor () {
    super({
      cmds: ['vol', 'volume', '볼륨', '음량'],
      description: 'cmd_vol_desc',
      category: 'category_music',
      commandname: 'cmd_vol',
      isownercmd: false,
      voiceChannel: true
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    const player = Player.playerInstance(pkg.client, pkg.msg.guild.id)
    const { queue } = player

    if (this.voiceChannel && !pkg.msg.member.voiceChannel) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('use_in_voice'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (!player.player || queue.empty) {
      Embed.addField(
        pkg.lang.get('cmd_warning'),
        pkg.lang.get('no_music_playing')
      )
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    let value = pkg.args[0]/*
    if (!pkg.args.length) {
      Embed.addField(pkg.lang.get('vol_current'), pkg.lang.get('vol_current_desc', player.volume))
      return pkg.msg.channel.send(Embed.get())
    }
*/
    if (isNaN(value)) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('vol_error'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (value > 200 || value < 1) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('vol_error'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get()) 
    }

    value = parseInt(value)
    player.setVolume(value)

    Embed.addField(pkg.lang.get('cmd_success'), pkg.lang.get('vol_adjust', [value]))
    pkg.msg.channel.send(Embed.get())
  }
}
