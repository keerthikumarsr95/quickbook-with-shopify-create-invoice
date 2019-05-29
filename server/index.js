const express = require('express');
const webhooks = require('./routes/webhooks');
const oauth = require('./routes/oauth');
const bodyParser = require('body-parser');
const quickBooks = require('node-quickbooks');

quickBooks.setOauthVersion('2.0');

const app = express();

const port = 8000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/webhooks', webhooks);
app.use('/api/oauth', oauth);

app.listen(port, () => {
  console.log('Running at port ' + port);
})

process.on('unhandledRejection', async (reason, promise) => {
  console.log('Unhandled Rejection at:', reason);
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
});