const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')

module.exports = class Resume extends Model {
  constructor () {
    super({
      cmds: ['resume', '이어재생'],
      description: 'cmd_resume_desc',
      category: 'category_music',
      commandname: 'cmd_resume',
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
    player.resume()

    const { title } = queue.first.info
    Embed.addField(
      pkg.lang.get('cmd_success'),
      `:pause_button: ${pkg.lang.get('resume')}: **${title}**`
    )
    pkg.msg.channel.send(Embed.get())
  }
}
