const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const percent = require('percent')

module.exports = class Np extends Model {
  constructor () {
    super({
      cmds: ['np', 'now', '현재재생중'],
      description: 'cmd_np_desc',
      category: 'category_music',
      commandname: 'cmd_np',
      isownercmd: false,
      voiceChannel: true
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    const player = pkg.client.m.get(pkg.msg.guild.id)

    if (this.voiceChannel && !pkg.msg.member.voiceChannel) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('use_in_voice'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (!player.connection || player.queue.isLast) {
      Embed.addField(
        pkg.lang.get('cmd_warning'),
        pkg.lang.get('no_music_playing')
      )
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    const {
      title: song,
      uri,
      identifier: id,
      length,
      isStream
    } = player.queue[0].info
    const { position } = player.connection.state

    const status = player.songProgress()
    const desc = isStream
      ? pkg.lang.get('streaming')
      : `\`${status}\`\n\n\`${player.toSongDuration(
        position
      )}/${player.toSongDuration(length)} (${percent.calc(
        position,
        length,
        0
      )}%)\``

    Embed.setUrl(`${song}`, `${uri}`)
    Embed.setDescription(desc)
    Embed.setThumbnail(`https://img.youtube.com/vi/${id}/default.jpg`)
    pkg.msg.channel.send(Embed.get())
  }
}
