const koa    = require('koa');
const body   = require('koa-bodyparser');
const config = require('config');
const debug  = require('debug')('tesla:fleet-api');
const routes = require('./routes');

const app = koa();
const port = process.env.PORT || config.api.port;

app.use(body());

routes(app);

app.listen(port, () => debug(`Fleet API running on ${port}`));
