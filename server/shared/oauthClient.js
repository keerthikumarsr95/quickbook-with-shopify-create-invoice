const config = require('../config');
const OAuthClient = require('intuit-oauth');

const oauthClient = new OAuthClient({
  clientId: config.quickBooks.clientId,
  clientSecret: config.quickBooks.clientSecret,
  environment: config.quickBooks.environment,
  redirectUri: config.quickBooks.redirectUri,
});

module.exports = oauthClient;
