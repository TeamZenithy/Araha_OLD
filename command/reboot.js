const Model = require('./model')
const SmallRichEmbed = require('../utils/embed')
const checkOwner = require('../utils/checkOwner')

module.exports = class Reboot extends Model {
  constructor () {
    super({
      cmds: ['reboot', 'restart', '재시작', '재시동'],
      description: 'cmd_reboot_desc',
      category: 'category_owners',
      commandname: 'cmd_reboot',
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

    Embed.addField(pkg.lang.get('reboot'), pkg.lang.get('reboot_desc'), true)
    pkg.msg.channel.send(Embed.get()).then(() => {
      pkg.client.logger.info(`${pkg.msg.author.tag}(${pkg.msg.author.id}) has rebooted bot.`)
      process.exit(0)
    })
  }
}
