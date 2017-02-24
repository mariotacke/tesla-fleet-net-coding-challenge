// this in-memory database uses promises to mimic a real database backend

class InMemoryDatabase {
  constructor () {
    this._rollouts = [];
  }

  getRollout (rolloutName) {
    return new Promise((resolve) => {
      const rollout = this._rollouts.filter((r) => r.name === rolloutName)[0];

      resolve(rollout || null);
    });
  }

  addRollout (rollout) {
    return new Promise((resolve) => {
      this._rollouts.push(rollout);

      resolve(rollout);
    });
  }

  getJob (rolloutName, jobName) {
    return new Promise((resolve) => {
      const rollout = this._rollouts.filter((r) => r.name === rolloutName)[0];

      if (rollout) {
        const job = rollout._jobs.filter((j) => j.name === jobName)[0];

        resolve(job || null);
      }

      resolve(null);
    });
  }

  addJob (rolloutName, job) {
    return new Promise((resolve, reject) => {
      const rollout = this._rollouts.filter((r) => r.name = rolloutName)[0];

      if (rollout) {
        rollout.addJob(job);

        return resolve(job);
      } else {
        return reject();
      }
    });
  }
}

const db = new InMemoryDatabase();

module.exports = db;
