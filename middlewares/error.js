const { Conflict } = require('../lib/errors');

module.exports = () => function * (next) {
  this.validate = () => {
    if (Array.isArray(this.errors)) {
      this.throw(400);
    }
  };

  try {
    yield next;
  } catch (e) {
    this.status = e.status || e.statusCode || 500;

    let body = {
      message: e.message,
      code: e.code
    };

    if (e instanceof Conflict) {
      this.status = 409;
    }

    if (this.status === 400) {
      body = {
        code: 'validation_failed',
        errors: this.errors
      };
    }

    if (this.status >= 500) {
      if (process.env.NODE_ENV !== 'production') {
        body.stack = e.stack;
      }
    }

    this.body = body;
  }
};
