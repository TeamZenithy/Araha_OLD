const config = require('./data/config.json')
const { ShardingManager } = require('discord.js')

const shardMgr = new ShardingManager('./bot.js', {
  token: config.bot.token,
  totalShards: config.bot.shard.count,
  respawn: config.bot.shard.respawn
})

shardMgr.spawn(
  config.bot.shard.count === 'auto' ? shardMgr.totalShards : config.bot.shard.count,
  config.bot.shard.delay
)

shardMgr.on('launch', (shard) =>
  console.log(`#${shard.id} shard has been launched.`)
)
