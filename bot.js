const Discord = require('discord.js')
const fs = require('fs')
const UlangTS = require('ulangts')
const { PlayerManager } = require('discord.js-lavalink')
const MySQL = require('mysql2/promise')

const config = require('./data/config')
const logger = require('./utils/logger')

class Araha extends Discord.Client {
  constructor(_config) {
    super()
    this.config = _config
    this.commands = new Map()
    this.players = new Map()
    this.logger = logger
    this.languages = new UlangTS(require('./lang'))
    //this.ready = false // 봇이 준비되기 전에 다른 이벤트가 진행이 되어 오류가 발생 하는 것을 막는 변수
    this.db

    this.on('debug', async debugInfo => {
      this.logger.debug(debugInfo)
    })

    this.on('ready', async () => {
      const pool = new MySQL.createPool({
        host: config.db.host,
        user: _config.db.id,
        password: _config.db.pw,
        database: _config.db.schema
      })

      this.db = await pool.getConnection(async conn => conn)

      const activitiesList = [
        `${this.guilds.size} Servers | ${this.config.bot.prefix}help`,
        `Shard ID:${this.shard.id} | ${this.config.bot.prefix}help`,
        `${this.config.bot.candidate} v.${this.config.bot.version} | ${this.config.bot.prefix}help`,
        `${this.shard.count} Shards | ${this.config.bot.prefix}help`
      ]
      this.player = new PlayerManager(
        this,
        [
          {
            host: config.lavalink.host,
            port: config.lavalink.port,
            password: config.lavalink.pw
          }
        ],
        {
          user: this.user.id,
          shards: 0
        }
      )

      setInterval(() => {
        this.db.query('SELECT 1')
        const index = Math.floor(
          Math.random() * (activitiesList.length - 1) + 1
        )
        this.user.setActivity(activitiesList[index])
      }, 10000)

      this.logger.info(`Login Success!
Bot id: ${this.user.id}
Bot Name: ${this.user.username}
Invite URL: https://discordapp.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=${this.config.bot.permission}&scope=bot
Shard id: ${this.shard.id}
      `)
    })

    this.on('error', async err => {
      this.logger.error(err.message)
    })

    fs.readdir('./event/', (err, files) => {
      if (err) return this.logger.error(err)

      files.forEach(file => {
        const event = require(`./event/${file}`)
        const eventName = file.split('.')[0]

        client.on(eventName, (a, b, c) => event(this, a, b, c))
      })
    })

    fs.readdir('./command/', (err, files) => {
      if (err) return this.logger.error(err)

      files.forEach(file => {
        try {
          if (!file.endsWith('.js') || file.startsWith('model')) return
          const Prop = require(`./command/${file}`)
          const temp = new Prop()

          temp.cmds.forEach(alia => {
            this.commands.set(alia, temp)
          })
        } catch (error) {
          this.logger.debug(`Failed to loading commands: ${file} ${error}`)
        }
      })
    })

    this.login(this.config.bot.token)
  }
}

const client = new Araha(config)
