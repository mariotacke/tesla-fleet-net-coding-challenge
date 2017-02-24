const JobStatus = require('./job-status');

class Job {
  constructor (name, vehicle, version) {
    this.name = name;
    this.vehicle = vehicle;
    this.version = version;
    this.createdAt = Date.now();

    this.statusHistory = [];

    this.changeStatus('created');
  }

  getStatus () {
    return this.statusHistory[this.statusHistory.length - 1];
  }

  changeStatus (status) {
    const jobStatus = new JobStatus(status);

    this.statusHistory.push(jobStatus);
  }

  toJSON () {
    const job = Object.assign({}, this);

    job.status = this.getStatus().type;
    job.createdAt = new Date(job.createdAt).toISOString();

    return job;
  }
}

module.exports = Job;
