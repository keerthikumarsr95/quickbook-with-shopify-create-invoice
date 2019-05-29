const baseurl = 'https://7009b04d.ngrok.io';

const config = {
  baseurl: baseurl,
  quickBooks: {
    clientId: 'Q0MIDbXxFCsUWyc8gAYvmc0nyIVEgswUUkQpevew7xIMFY3xAc',
    clientSecret: 'wDfb5pzw2OQJ6SIWnlGnc6phj6jaLkNaUwoTM2V5',
    environment: 'sandbox',
    redirectUri: `${baseurl}/api/oauth/callback`
  },
};

module.exports = config;