const Koa        = require('koa');
const body       = require('koa-bodyparser');
const config     = require('config');
const debug      = require('debug')('tesla:fleet-api');
const routes     = require('./routes');
const error      = require('./middlewares/error');
const validation = require('./middlewares/validation');

const app = new Koa();
const port = process.env.PORT || config.api.port;

app.use(error());
app.use(body());

validation(app);
routes(app);

app.listen(port, () => debug(`Fleet API running on ${port}`));
