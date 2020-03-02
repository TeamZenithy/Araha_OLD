const owners = require('../data/config.json').owners
module.exports = (id) => owners.includes(id)
