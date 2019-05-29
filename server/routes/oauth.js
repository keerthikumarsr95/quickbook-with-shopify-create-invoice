const express = require('express');
const cache = require('global-cache');

const OAuthClient = require('intuit-oauth');
const oauthClient = require('../shared/oauthClient');
const router = express.Router();

router.get('/register', async (req, res) => {
  var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId], state: 'testState' });
  console.log('authUri: ', authUri);
  res.json({ success: true, authUri });
});
router.get('/callback', (req, res) => {
  var parseRedirect = req.url;

  // Exchange the auth code retrieved from the **req.url** on the redirectUri
  oauthClient.createToken(parseRedirect)
    .then(function (authResponse) {
      console.log('The Token is  ' + JSON.stringify(authResponse.getJson()));
      cache.set('oauthToken', authResponse.getJson());
    })
    .catch(function (e) {
      console.error("The error message is :" + e.originalMessage);
      console.error(e.intuit_tid);
    });
  res.send('');
});

module.exports = router;