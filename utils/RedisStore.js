const session = require('express-session');

class RedisStore extends session.Store {
  constructor(client, opts = {}) {
    super();
    this.client = client;
    this.prefix = opts.prefix || 'sess:';
    this.ttl = opts.ttl || 86400; // one day
  }

  async get(sid, cb) {
    try {
      const data = await this.client.get(this.prefix + sid);
      if (!data) return cb(null, null);
      cb(null, JSON.parse(data));
    } catch (err) {
      cb(err);
    }
  }

  async set(sid, sess, cb) {
    try {
      await this.client.set(
        this.prefix + sid,
        JSON.stringify(sess),
        {
          EX: this.ttl,
        }
      );
      cb(null);
    } catch (err) {
      cb(err);
    }
  }

  async destroy(sid, cb) {
    try {
      await this.client.del(this.prefix + sid);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }
}

module.exports = RedisStore;
