const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const checkOwner = require('../utils/checkOwner')

module.exports = class Notice extends Model {
  constructor () {
    super({
      cmds: ['공지', 'notice'],
      description: 'cmd_notice_desc',
      category: 'category_owners',
      commandname: 'cmd_notice',
      isownercmd: true,
      voiceChannel: false
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    if (this.isownercmd && !checkOwner(pkg.msg.author.id)) {
      Embed.addField(
        pkg.lang.get('cmd_warning'),
        pkg.lang.get('cmd_owners_only_warn'),
        true
      )
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (!pkg.args[0]) {
      Embed.addField(
        pkg.lang.get('cmd_warning'),
        pkg.lang.get('no_notice_msg'),
        true
      )
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }
    let notice = /(araha-공지|봇-공지|공지|notice|announce|announcement)/gi
    //    let notice = /(testing)/gi
    let content = pkg.args.join(' ') + ' '
    Embed.addField('📣 **공지 / Notice**', content)
    Embed.setFooter(
      `✓ Notice sent by ${pkg.msg.author.tag}`,
      pkg.msg.author.avatarURL
    )
    pkg.client.logger.info(`${pkg.msg.author.tag}(${pkg.msg.author.id}) has noticed following content:\n${content}`)
    pkg.client.guilds.forEach(async guild => {
      const textchannels = guild.channels
        .filter(ch => ch.type == 'text')
        .array()
      const noticeChannels = []
      for (const item of textchannels) {
        if (notice.test(item.name) && noticeChannels.length == 0) {
          noticeChannels.push(item)
          await item.send(Embed.get())
        }
      }
    })
  }
}
