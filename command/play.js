const Model = require('./model')
const SmallRichEmbed = require('../utils/embed.js')
const Player = require('../instances/player')
const Music = require('../instances/music')

module.exports = class Play extends Model {
  constructor () {
    super({
      cmds: ['p', 'play', '재생'],
      description: 'cmd_play_desc',
      category: 'category_music',
      commandname: 'cmd_play',
      isownercmd: false,
      voiceChannel: true
    })
  }

  async run (pkg) {
    const Embed = new SmallRichEmbed()
    const player = Player.playerInstance(pkg.client, pkg.msg.guild.id)

    if (!pkg.args.length) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('cannot_play'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    if (this.voiceChannel && !pkg.msg.member.voiceChannel) {
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('use_in_voice'))
      Embed.setColor(14217046)
      return pkg.msg.channel.send(Embed.get())
    }

    await player.join(pkg.msg.guild.id, pkg.msg.member.voiceChannel.id)
    const { queue } = player
    const search = pkg.args.join(' ')

    Embed.addField(
      pkg.lang.get('searching'),
      pkg.lang.get('searching_', [search])
    )
    pkg.msg.channel.send(Embed.get())
    
    const music = new Music(pkg.client)
    const searchResult = await music.findSongs(search).catch(err => {
      player.stop()
      Embed.init()
      Embed.setColor(14217046)
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('err_loading_track', [err]))
      return pkg.msg.channel.send(Embed.get())
    })
    const track = searchResult.tracks[0]
    try {
      await player.join(pkg.msg.guild.id, pkg.msg.member.voiceChannel.id)
      if (searchResult.loadType == 'PLAYLIST_LOADED') {
        await searchResult.tracks.forEach(function(temp) {
          player.play(temp, pkg.msg.author)
        }) 
      } else if (searchResult.loadType == 'LOAD_FAILED') {
        Embed.init()
        Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('no_result'))
        Embed.setColor(14217046)
        return pkg.msg.channel.send(Embed.get())
      } else if (searchResult.loadType == 'NO_MATCHES') {
        Embed.init()
        Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('no_result'))
        Embed.setColor(14217046)
        return pkg.msg.channel.send(Embed.get())
      } else {
        await player.play(track, pkg.msg.author)
      }

    const { identifier, length, isStream, title, uri } = track.info
    if (queue.queue.length > 1) {
      const Embed = new SmallRichEmbed()
      Embed.setUrl(pkg.lang.get('added_', [title]), `${uri}`)
      Embed.addField(
        pkg.lang.get('length'),
        `${
          isStream ? pkg.lang.get('streaming') : Music.toSongDuration(length)
        }`,
        true
      )
      if (!isNaN(queue.totalLength - length - player.currentSeek)) {
        Embed.addField(
          pkg.lang.get('time_to_play'),
          queue.includesLiveStream
            ? pkg.lang.get('queue_including_streaming')
            : Music.toSongDuration(
              queue.totalLength - length - player.currentSeek
            ),
          true
        )
      }
      Embed.addField(pkg.lang.get('queue_length'), `${queue.queue.length - 1}`, true)

      Embed.setThumbnail(`https://img.youtube.com/vi/${identifier}/default.jpg`)
      return pkg.msg.channel.send(Embed.get())
    } else {
      const Embed = new SmallRichEmbed()
      Embed.setUrl(pkg.lang.get('now_play', [title]), `${uri}`)

      Embed.addField(
        pkg.lang.get('length'),
        `${
          isStream ? pkg.lang.get('streaming') : Music.toSongDuration(length)
        }`,
        true
      )

      Embed.setThumbnail(`https://img.youtube.com/vi/${identifier}/default.jpg`)
      return pkg.msg.channel.send(Embed.get())
    }
  } catch (e) {
      player.stop()
      Embed.init()
      Embed.setColor(14217046)
      Embed.addField(pkg.lang.get('cmd_warning'), pkg.lang.get('err_loading_track', [e]))
      return pkg.msg.channel.send(Embed.get())
    }
  }
}
