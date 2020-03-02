const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class Seek extends Model {
  constructor () {
    super({
      cmds: ['seek', '이동'],
      description: 'cmd_seek_desc',
      category: 'category_music',
      commandname: 'cmd_seek',
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

    if (
      !pkg.args.length ||
      !pkg.args[0].split(':').length ||
      pkg.args[0].split(':').some((t) => isNaN(t))
    ) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('provide_plz'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    const seekedTo = player.seek(
      ...pkg.args[0]
        .split(':')
        .reverse()
        .map((t) => parseInt(t))
    )
    Embed.addField(
      pkg.lang.get('cmd_success'),
      pkg.lang.get('moved_to', [seekedTo])
    )
    pkg.msg.channel.send(Embed.get())
  }
}
