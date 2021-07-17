const NodeStorage = typeof process.env.BROWSER === "undefined" ? require('./node-storage') : undefined
const BrowserStorage = typeof process.env.BROWSER !== "undefined" ? require('./browser-storage') : undefined;

module.exports = NodeStorage || BrowserStorage;
