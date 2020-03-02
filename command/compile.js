const Model = require('./model')
const SmallRichEmbed = require('../utils/embed')
const checkOwner = require('../utils/checkOwner')

module.exports = class Compile extends Model {
  constructor () {
    super({
      cmds: ['eval', 'code', 'compile'],
      description: 'cmd_compile_desc',
      category: 'category_owners',
      commandname: 'cmd_compile',
      isownercmd: true,
      voiceChannel: false
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    Embed.init()
    function JSONchecker (json) {
      try {
        JSON.parse(json)
        return true
      } catch (err) {
        return false
      }
    }

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
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('no_code'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }
    const args = pkg.args.join(' ')
    pkg.client.logger.info(`[INFO] ${pkg.msg.author.tag}(${pkg.msg.author.id}) Compiled follwing code:${args}`)
    let inputCode = `
const child = require('child_process')
const Discord = require('discord.js')\n` + args
    let type
    try {
      const result = new Promise((resolve) => resolve(eval(inputCode)))
      result.then(res => {
        let code = type = res
        if (typeof(code) !== 'string') { 
          code = require('util').inspect(code, {
            depth: 0
          }) 
        }
          Embed.setAuthor(pkg.lang.get('compile_compiling'))
          Embed.setColor(4873670)
        if (inputCode.length > 1000) {
          inputCode = inputCode.substr(0, 1000) + '...'
        }
        Embed.addField(pkg.lang.get('compile_input'), `\`\`\`js\n${inputCode} \`\`\``)
        if (JSONchecker(code) === true) {
          code = JSON.stringify(code)
        }
        if (typeof type === 'function') {
          code = type.toString()
        }
        if (code.length > 1000) {
          code = code.substr(0, 1000) + '...'
        }
        Embed.addField(pkg.lang.get('compile_output'), `\`\`\`js\n${code} \n\`\`\``)
        pkg.msg.channel.send(Embed.get())
      }).catch(e => {
        sendError(e)
      })
    } catch (e) {
      sendError(e)
    }
    function sendError (e) {
      Embed.setAuthor(pkg.lang.get('compile_err'))
      Embed.setColor(16711680)
      if (inputCode.length > 1000) {
        inputCode = inputCode.substr(0, 1000) + '...'
      }
      Embed.addField(pkg.lang.get('compile_input'), `\`\`\`js\n${inputCode} \`\`\``)
      Embed.addField(pkg.lang.get('compile_output_error'), `\`\`\`js\n${e} \n\`\`\``)
      pkg.msg.channel.send(Embed.get())
    }
  }
}
