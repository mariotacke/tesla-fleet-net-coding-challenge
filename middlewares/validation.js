const { Validator } = require('koa-validate');

Validator.prototype.addError = function (code) {
  this.goOn = false;

  if (!this.context.errors) {
    this.context.errors = [];
  }

  const error = {
    field: this.key,
    code
  };

  this.context.errors.push(error);
};

module.exports = require('koa-validate');
