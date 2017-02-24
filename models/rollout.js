class Rollout {
  constructor (name) {
    this.name = name;
    this.createdAt = Date.now();

    this._jobs = [];
  }

  addJob (job) {
    this._jobs.push(job);
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
