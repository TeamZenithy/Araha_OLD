const Model = require('./model')
const SmallRichEmbed = require('../utils/embed')
const checkOwner = require('../utils/checkOwner')
const child = require('child_process')

module.exports = class Shell extends Model {
  constructor () {
    super({
      cmds: ['shell', 'cmd'],
      description: 'cmd_shell_desc',
      category: 'category_owners',
      commandname: 'cmd_shell',
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

    if (!pkg.args.length) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('no_cmd'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }
    const args = pkg.args.join(' ')
    pkg.client.logger.info(`${pkg.msg.author.tag}(${pkg.msg.author.id}) Executed follwing command:${args}`)
    const process = child.exec(args)
    process.stdout.on('data', (content) => {
      pkg.msg.channel.send(content, { code: 'sh', split: '\n' })
    })
    process.stderr.on('data', (content) => {
      pkg.msg.channel.send(content, { code: 'sh', split: '\n' })
    })
  }
}
