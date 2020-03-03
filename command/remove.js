const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Remove extends Model {
  constructor () {
    super({
      cmds: ['rm', 'remove', '삭제'],
      description: 'cmd_remove_desc',
      category: 'category_music',
      commandname: 'cmd_remove',
      isownercmd: false,
      voiceChannel: true
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    const position = pkg.args[0]

    if (!position || isNaN(pkg.args[0])) {
      Embed.addField(
        pkg.lang.get('cmd_warning'),
        pkg.lang.get('cannot_remove_1')
      )
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (position < 1) {
      Embed.addField(
        pkg.lang.get('cmd_warning'),
        pkg.lang.get('cannot_remove_2')
      )
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

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

    if (queue.length - 1 < position) {
      Embed.addField(
        pkg.lang.get('cmd_warning'),
        pkg.lang.get('cannot_remove_2')
      )
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    const removed = player.remove(position)
    Embed.addField(
      pkg.lang.get('cmd_success'),
      pkg.lang.get('removed', [removed])
    )
    pkg.msg.channel.send(Embed.get())
  }
}
