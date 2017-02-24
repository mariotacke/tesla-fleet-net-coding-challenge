const db           = require('../lib/db');
const { Job }      = require('../models');
const { Conflict } = require('../lib/errors');

const router = require('koa-router')({
  prefix: '/jobs'
});

router.post('/', function* () {
  this.checkBody('rollout_name').notEmpty('cannot_be_blank');
  this.checkBody('vehicle_name').notEmpty('cannot_be_blank');
  this.checkBody('job_name').notEmpty('cannot_be_blank');
  this.checkBody('version').notEmpty('cannot_be_blank');

  this.validate();

  const { body } = this.request;
  const jobName = body.job_name;
  const vehicle = body.vehicle_name;
  const version = body.version;
  const rolloutName = body.rollout_name;

  const rollout = yield db.getRollout(rolloutName);

  if (!rollout) {
    throw new Conflict(`Rollout '${rolloutName}' not found.`);
  }

  const jobExists = yield db.getJob(rolloutName, jobName);

  if (jobExists) {
    throw new Conflict(`Job '${jobName}' already exists in Rollout '${rolloutName}'`);
  }

  const job = new Job(jobName, vehicle, version);

  yield db.addJob(rolloutName, job);

  this.status = 201;
  this.body = job;
});

module.exports = router;
