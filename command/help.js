const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const checkOwner = require('../utils/checkOwner')
const unique = require('uuniquets')

module.exports = class Help extends Model {
  constructor () {
    super({
      cmds: ['도움', 'help', '도움말', 'manual'],
      description: 'cmd_help_desc',
      category: 'category_general',
      commandname: 'cmd_help',
      isownercmd: false,
      voiceChannel: false
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    if (pkg.args.length < 1) {
      const sorted = {}
      unique(pkg.client.commands).forEach((command) => {
        if (command.commandname && !sorted[command.category]) {
            sorted[`${command.category}`] = `\`${command.commandname.replace(
              'cmd_',
              ''
            )}\``
          } else if (command.commandname) {
            sorted[`${command.category}`] += `, \`${command.commandname.replace(
              'cmd_',
              ''
            )}\``
          }
      })

      Object.keys(sorted).forEach((sortedKey) => {
        if (sortedKey && sorted[sortedKey]) {
          Embed.addField(
            pkg.lang.get(sortedKey) || pkg.lang.get('desc_none'),
            sorted[sortedKey],
            true
          )
        }
      })

      Embed.addField(
        pkg.lang.get('tip'),
        pkg.lang.get('tip_desc', [pkg.client.config.bot.prefix])
      )
      pkg.msg.channel.send(Embed.get())
    } else {
      const cmd = pkg.client.commands.get(pkg.args[0])
      if (!cmd) {
        Embed.addField(
          pkg.lang.get('cmd_warning'),
          pkg.lang.get('cmd_not_found'),
          true
        )
        Embed.setColor(16713993)
        return pkg.msg.channel.send(Embed.get())
      }

      if (cmd.isownercmd && !checkOwner(pkg.msg.author.id)) {
        Embed.addField(
          pkg.lang.get('cmd_warning'),
          pkg.lang.get('cmd_owners_only_warn'),
          true
        )
        Embed.setColor(14217046)
        return pkg.msg.channel.send(Embed.get())
      }

      Embed.addField(
        pkg.lang.get(cmd.commandname),
        pkg.lang.get(cmd.description, [pkg.client.config.bot.prefix]) ||
          pkg.lang.get('desc_none')
      )
      pkg.msg.channel.send(Embed.get())
    }
  }
}
