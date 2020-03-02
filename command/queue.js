const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')
const Music = require('../instances/music')

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

    const part = queue.part((parseInt(page) - 1) * 5, parseInt(page) * 5)
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
    .map(({ info }) => `\`${temp_++}.\` ${Queue.formatSong(info)}`)
    .join('\n')}
    ${pkg.lang.get('queue_deatil', [queue.queue.length - 1]) +
      `${Music.toSongDuration(queue.totalLength)}**`}
    `
    }

    Embed.addField(
      pkg.lang.get('queue'),
      `
    > ${pkg.lang.get('queue_playing')}:
    ${Queue.formatSong(queue.first.info, pkg)}
    ${songFormated}
        `
    )
    pkg.msg.channel.send(Embed.get())
  }

  static formatSong ({ length, title, uri, isStream }, pkg) {
    return `[${title}](${uri}) | \`${
      isStream ? pkg.lang.get('streaming') : Music.toSongDuration(length)
    }\``
  }
}
