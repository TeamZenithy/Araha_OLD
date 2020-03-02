const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class Loop extends Model {
  constructor () {
    super({
      cmds: ['l', 'loop', '반복'],
      description: 'cmd_loop_desc',
      category: 'category_music',
      commandname: 'cmd_loop',
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
    const isLooped = player.toggleLoop()
    player.loopQueue = false

    Embed.addField(
      pkg.lang.get('cmd_success'),
      `:repeat_one: **${
        isLooped
          ? pkg.lang.get('toggle_loop_one_enabled')
          : pkg.lang.get('toggle_loop_one_disabled')
      }**`
    )
    pkg.msg.channel.send(Embed.get())
  }
}
