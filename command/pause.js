const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Pause extends Model {
  constructor () {
    super({
      cmds: ['pause', '일시정지', 'resume'],
      description: 'cmd_pause_desc',
      category: 'category_music',
      commandname: 'cmd_pause',
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

    const { title } = queue[0].info
    const paused = player.pause()

    Embed.addField(
      pkg.lang.get('cmd_success'),
      `:pause_button: ${paused ? pkg.lang.get('paused') : pkg.lang.get('resume')}: **${title}**`
    )
    pkg.msg.channel.send(Embed.get())
  }
}
