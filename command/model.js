module.exports = class CommandModel {
  // 같은 구조의 객체들을 여러개 만들 때 쓰인다
  constructor (info) {
    if (!info) return
    this.cmds = info.cmds
    this.description = info.description
    this.category = info.category
    this.commandname = info.commandname
    this.isownercmd = info.isownercmd
    this.voiceChannel = info.voiceChannel
    console.log(`Successfully Loaded ${this.commandname}.\nCommand Structure:
┗─Commands: ${this.cmds}
┗─Description: ${this.description}
┗─Category: ${this.category}\n`)
  }

  run () {
    throw new Error('Error! There was nothing in run() method!')
  }
}
