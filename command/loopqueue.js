const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class LoopQueue extends Model {
  constructor () {
    super({
      cmds: ['lq', 'loopqueue', '큐반복'],
      description: 'cmd_loopqueue_desc',
      category: 'category_music',
      commandname: 'cmd_loopqueue',
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
    const isLooped = player.toggleLoopQueue()
    player.loop = false

    Embed.addField(
      pkg.lang.get('cmd_success'),
      `:repeat: **${
        isLooped
          ? pkg.lang.get('toggle_loop_queue_enabled')
          : pkg.lang.get('toggle_loop_queue_disabled')
      }**`
    )
    pkg.msg.channel.send(Embed.get())
  }
}
