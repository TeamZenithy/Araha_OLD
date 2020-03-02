const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class Skipto extends Model {
  constructor () {
    super({
      cmds: ['st', 'skipto', '스킵투'],
      description: 'cmd_skipto_desc',
      category: 'category_music',
      commandname: 'cmd_skipto',
      isownercmd: false,
      voiceChannel: true
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    const player = Player.playerInstance(pkg.client, pkg.msg.guild.id)
    const { queue } = player
    const position = pkg.args[0];

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

    if (!position || isNaN(pkg.args[0])) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('cannot_skip_to_1'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (position < 1 || queue.queue.length - 1 < position) {
        Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('cannot_skip_to_2'))
        Embed.setColor(14217046)
        return pkg.msg.channel.send(Embed.get())
      }

    player.remove(0, position - 1);
    player.skip();
    Embed.addField(
      pkg.lang.get('cmd_success'),
      `${pkg.lang.get('skipped')}`
    )
    pkg.msg.channel.send(Embed.get())
  }
}
