const PandoraStorage = require('./helpers/storage/pandora-storage')
const GoWebworker = require('./helpers/go-webworker')
GoWebworker()

PandoraStorage.exportStorage()

