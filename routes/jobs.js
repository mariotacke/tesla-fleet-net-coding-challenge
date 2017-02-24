const db           = require('../lib/db');
const { Job }      = require('../models');
const { Conflict } = require('../lib/errors');

const router = require('koa-router')({
  prefix: '/jobs'
});

router.get('/:job_name', function* () {
  this.checkParams('job_name').notEmpty('cannot_be_blank');

  this.validate();

  const { params } = this;
  const jobName = params.job_name;

  const job = yield db.getJob(jobName);

  if (!job) {
    throw new Conflict(`Job '${jobName}' not found.`);
  }

  this.body = job;
});

// this route is somewhat unnecessary since a regular GET returns all of the
// information including status history. This is an additional route to cover
// the specifications.
router.get('/:job_name/history', function* () {
  this.checkParams('job_name').notEmpty('cannot_be_blank');

  this.validate();

  const { params } = this;
  const jobName = params.job_name;

  const job = yield db.getJob(jobName);

  if (!job) {
    throw new Conflict(`Job '${jobName}' not found.`);
  }

  this.body = {
    name: job.name,
    statusHistory: job.statusHistory
  };
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

  const jobExists = yield db.getJob(jobName);

  if (jobExists) {
    throw new Conflict(`Job '${jobName}' already exists in Rollout '${rolloutName}'`);
  }

  const job = new Job(jobName, vehicle, version);

  yield db.addJob(rolloutName, job);

  this.status = 201;
  this.body = job;
});

router.put('/:job_name', function* () {
  const allowedStatuses = ['downloading', 'installing', 'succeeded', 'failed'];

  this.checkQuery('status').in(allowedStatuses, 'invalid_status');
  this.checkParams('job_name').notEmpty('cannot_be_blank');

  this.validate();

  const { params, query } = this;
  const status = query.status;
  const jobName = params.job_name;

  const job = yield db.getJob(jobName);

  if (!job) {
    throw new Conflict(`Job '${jobName}' not found.`);
  }

  job.changeStatus(status);

  yield db.save();

  this.body = job;
});

router.delete('/:job_name', function* () {
  this.checkParams('job_name').notEmpty('cannot_be_blank');

  this.validate();

  const { params } = this;
  const jobName = params.job_name;

  const job = yield db.getJob(jobName);

  if (!job) {
    throw new Conflict(`Job '${jobName}' not found.`);
  }

  const cancelableStatuses = ['created', 'downloading'];
  const status = job.getStatus().type;

  if (!cancelableStatuses.includes(status)) {
    throw new Conflict(`Cannot cancel '${jobName}'.`);
  }

  job.changeStatus('canceled');

  yield db.save();

  this.body = job;
});

module.exports = router;
