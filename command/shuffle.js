const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class Shuffle extends Model {
  constructor () {
    super({
      cmds: ['shuffle', '셔플'],
      description: 'cmd_shuffle_desc',
      category: 'category_music',
      commandname: 'cmd_shuffle',
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

    queue.shuffle()
    Embed.addField(pkg.lang.get('cmd_success'), pkg.lang.get('shuffled_queue'))
    pkg.msg.channel.send(Embed.get())
  }
}
