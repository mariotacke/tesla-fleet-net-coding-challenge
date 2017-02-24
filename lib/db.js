// this in-memory database uses promises to mimic a real database backend
// in a real backend we would write sql queries to facilitate the operations

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

  getJob (jobName) {
    return new Promise((resolve) => {
      // build array of all jobs from all rollouts
      const jobs = this._rollouts.reduce((previous, current) => {
        return previous.concat(current._jobs);
      }, []);

      const job = jobs.filter((j) => j.name === jobName)[0];

      resolve(job || null);
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

  save () {
    // mock method to simulate sync of changed records
    return new Promise((resolve) => {
      resolve();
    });
  }
}

const db = new InMemoryDatabase();

module.exports = db;
