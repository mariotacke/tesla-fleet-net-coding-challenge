const auth     = require('./auth');
const jobs     = require('./jobs');
const rollouts = require('./rollouts');

module.exports = (app) => {
  app.use(auth.routes());
  app.use(jobs.routes());
  app.use(rollouts.routes());
};
