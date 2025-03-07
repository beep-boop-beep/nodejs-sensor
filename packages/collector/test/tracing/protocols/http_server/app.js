/* eslint-disable no-console */

'use strict';

require('../../../../')({
  agentPort: process.env.AGENT_PORT,
  level: 'info',
  tracing: {
    forceTransmissionStartingAt: 1
  }
});

const logPrefix = `HTTP: Server (${process.pid}):\t`;

const http = require('http');
const url = require('url');
const port = process.env.APP_PORT || 3000;
const app = new http.Server();

app.on('request', (req, res) => {
  if (process.env.WITH_STDOUT) {
    log(`${req.method} ${req.url}`);
  }
  const query = url.parse(req.url, true).query || {};

  if (query.responseStatus) {
    res.statusCode = parseInt(query.responseStatus || 200, 10);
  }

  const delay = parseInt(query.delay || 0, 10);

  if (delay === 0) {
    res.end();
  } else {
    setTimeout(() => {
      res.end();
    }, delay);
  }
});

app.listen(port, () => {
  log(`Listening on port: ${port}`);
});

function log() {
  const args = Array.prototype.slice.call(arguments);
  args[0] = logPrefix + args[0];
  console.log.apply(console, args);
}
