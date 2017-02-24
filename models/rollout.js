class Rollout {
  constructor (name) {
    this.name = name;
    this.createdAt = Date.now();

    this._jobs = [];
  }

  addJob (job) {
    this._jobs.push(job);
  }

  summarize () {
    const rollout = {
      name: this.name,
      summary: {

      }
    };

    const statuses = [
      'created',
      'downloading',
      'installing',
      'succeeded',
      'failed',
      'canceled'
    ];

    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      rollout.summary[status] = this._jobs
        .filter((j) => j.getStatus().type === status)
        .reduce((previous) => previous + 1, 0);
    }

    return rollout;
  }

  toJSON () {
    const rollout = Object.assign({}, this);

    delete rollout._jobs;

    rollout.jobs = this._jobs;
    rollout.createdAt = new Date(rollout.createdAt).toISOString();

    return rollout;
  }
}

module.exports = Rollout;
