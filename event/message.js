module.exports = async (client, msg) => {
  if (msg.author.bot) return
  if (!msg.content.startsWith(client.config.bot.prefix)) return

  //const raw = client.db.query(`SELECT * FROM users WHERE aid="${msg.author.id}"`).catch(console.error)
  const userData = (await client.db.query(`SELECT * FROM users WHERE aid="${msg.author.id}"`))[0][0];
  client.logger.info(`${JSON.stringify(userData)}, Requested Command : ${msg}`)
  if (!userData) {
    client.db.query(`INSERT INTO users (aid) VALUES ("${msg.author.id}")`)
    client.db.release()
    return module.exports(client, msg)
  }

  const lang = client.languages.get(userData.lang)
  const args = msg.content
    .slice(client.config.bot.prefix.length)
    .trim()
    .split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command)
  if (!cmd) return

  const compress = {
    client: client,
    msg: msg,
    args: args,
    data: userData,
    lang: lang
  }
  cmd.run(compress)
}
