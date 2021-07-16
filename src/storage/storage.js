const NodeStorage = typeof BROWSER === "undefined" ? require('./node-storage') : undefined
const BrowserStorage = typeof BROWSER !== "undefined" ? require('./browser-storage') : undefined;

module.exports = NodeStorage || BrowserStorage;
