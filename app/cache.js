const NodeCache = require('node-cache');

const ttl = 604800; // 7 days
const cache = new NodeCache({ stdTTL: ttl });

module.exports = { cache, ttl };
