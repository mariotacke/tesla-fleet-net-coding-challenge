class JobStatus {
  constructor (type) {
    this.type = type;
    this.createdAt = Date.now();
  }

  toJSON () {
    const jobStatus = Object.assign({}, this);

    jobStatus.createdAt = new Date(jobStatus.createdAt).toISOString();

    return jobStatus;
  }
}

module.exports = JobStatus;
