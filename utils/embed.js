const config = require('../data/config.json')

module.exports = class SmallRichEmbed {
  constructor () {
    this.result = {
      embed: {
        color: config.bot.color,
        fields: [],
        timestamp: Date.now(),
        footer: {
          text:`${config.bot.name} ${config.bot.candidate} v.${config.bot.version}`,
          iconURL: ``
        },
        description: '',
        author: {
          name: '',
          iconURL: '',
          url: ''
        },
        image: {
          uri: ''
        },
        url: '',
        title: '',
        thumbnail: {
          url: ''
        }
      }
    }
  }

  addField (title, value, inline) {
    this.result.embed.fields.push({
      name: title || null,
      value: value || null,
      inline: inline || false
    })
  }

  setAuthor (name, iconURL, url) {
    this.result.embed.author.name = name || null
    this.result.embed.author.iconURL = iconURL || null
    this.result.embed.author.url = url || null
  }

  setColor (color) {
    this.result.embed.color = color || this.result.embed.color
  }

  setDescription (text) {
    this.result.embed.description = text || null
  }

  setImage (uri) {
    this.result.embed.image.uri = uri || null
  }

  setThumbnail (uri) {
    this.result.embed.thumbnail.url = uri || null
  }

  setTitle (text) {
    this.result.embed.title = text || null
  }

  setUrl (text, url) {
    this.result.embed.title = text || null
    this.result.embed.url = url || null
  }

  setFooter (text, image) {
    this.result.embed.footer.text =
      text ||
      config.bot.name +
        ' ' +
        config.bot.candidate +
        ' ' +
        'Version' +
        ' ' +
        config.bot.version
    this.result.embed.footer.iconURL = image || null
  }

  init () {
    this.result = {
      embed: {
        color: config.bot.color,
        fields: [],
        timestamp: Date.now(),
        footer: {
          text:
            config.bot.name +
            ' ' +
            config.bot.candidate +
            ' ' +
            'Version' +
            ' ' +
            config.bot.version,
          iconURL: ``
        },
        description: '',
        author: {
          name: '',
          iconURL: '',
          url: ''
        },
        image: {
          uri: ''
        },
        url: '',
        title: '',
        thumbnail: {
          url: ''
        }
      }
    }
  }

  get () {
    return this.result
  }
}
