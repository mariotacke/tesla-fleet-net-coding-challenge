const router = require('koa-router')({
  prefix: '/auth'
});

router.post('/', function* () {
  this.body = {};
});

module.exports = router;
