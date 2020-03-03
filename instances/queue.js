class LavalinkQueue extends Array {
  add(item) {
    if (!item) return
    this.push(item)
    return true
  }

  del(index, counts) {
    if (this.isLast) return
    return this.splice(index, counts || 1)
  }

  shuffle () {
    // this = [this[0], ...this.slice(1).sort(() => Math.random() - 0.5)]
  }

  get isLast() {
    return !this.length
  }

  get totalLength () {
    return this.reduce((acc, curr) => acc + curr.info.length, 0)
  }
}

module.exports = LavalinkQueue
