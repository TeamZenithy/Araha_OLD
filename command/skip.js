const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Skip extends Model {
  constructor () {
    super({
      cmds: ['s', 'skip', '스킵'],
      description: 'cmd_skip_desc',
      category: 'category_music',
      commandname: 'cmd_skip',
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

    player.skip()
    Embed.addField(
      pkg.lang.get('cmd_success'),
      `${pkg.lang.get('skipped')}: **${queue[0].info.title}**`
    )
    pkg.msg.channel.send(Embed.get())
  }
}
