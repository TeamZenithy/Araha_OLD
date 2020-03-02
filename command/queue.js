const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')

module.exports = class Queue extends Model {
  constructor () {
    super({
      cmds: ['q', 'queue', '큐'],
      description: 'cmd_queue_desc',
      category: 'category_music',
      commandname: 'cmd_queue',
      isownercmd: false,
      voiceChannel: true
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    const page = pkg.args[0] || 1

    if (!page || isNaN(page) || page < 1) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('invalid_page'))
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

    const part = queue.slice((parseInt(page) - 1) * 5, (parseInt(page) * 5) + 1)
    if (!part.length) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('invalid_page'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    const index = (page - 1) * 6
    Embed.init()

    let temp_ = 0
    if (page - 1 === 0) {
      temp_ = index + 1
    } else {
      temp_ = index
    }

    let songFormated = ''
    if (part.slice(1).length) {
      songFormated = `
    > ${pkg.lang.get('queue_queued_songs')}:
    ${part
    .slice(1)
    .map(({ info }) => `\`${temp_++}.\` ${`[${info.title}](${info.uri}) | \`${
      info.isStream ? pkg.lang.get('streaming') : player.toSongDuration(info.length)
    }\``}`)
    .join('\n')}
    ${pkg.lang.get('queue_deatil', [queue.length - 1]) +
      `${player.toSongDuration(queue.totalLength)}**`}
    `
    }

    Embed.addField(
      pkg.lang.get('queue'),
      `
    > ${pkg.lang.get('queue_playing')}:
    ${`[${queue[0].info.title}](${queue[0].info.uri}) | \`${
      queue[0].info.isStream ? pkg.lang.get('streaming') : player.toSongDuration(queue[0].info.length)
    }\``}
    ${songFormated}
        `
    )
    pkg.msg.channel.send(Embed.get())
  }
}
