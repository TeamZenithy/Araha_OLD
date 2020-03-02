const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

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
    const player = pkg.client.m.get(pkg.msg.guild.id)
    const { queue } = player

    if (this.voiceChannel && !pkg.msg.member.voiceChannel) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('use_in_voice'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (!player.connection || queue.isLast) {
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
