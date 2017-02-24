const db           = require('../lib/db');
const { Rollout }  = require('../models');
const { Conflict } = require('../lib/errors');

const router = require('koa-router')({
  prefix: '/rollouts'
});

router.post('/', function* () {
  this.checkBody('rollout_name').notEmpty('cannot_be_blank');

  this.validate();

  const { body } = this.request;
  const rolloutName = body.rollout_name;

  const rolloutExists = yield db.getRollout(rolloutName);

  if (rolloutExists) {
    throw new Conflict(`Rollout '${rolloutName}' already exists.`);
  }

  const rollout = new Rollout(rolloutName);

  yield db.addRollout(rollout);

  this.status = 201;
  this.body = rollout;
});

module.exports = router;
