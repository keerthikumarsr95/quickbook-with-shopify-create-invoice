const express = require('express');
const quickBooks = require('../shared/quickbooks');
const router = express.Router();

const shopifyTopicsToAccept = {
  'orders/create': true,
  // 'orders/updated': true,
  // 'orders/cancelled': true,
  // 'products/update': true,
  // 'products/create': true,
};

router.post('/shopify', async (req, res) => {
  const { headers, body } = req;
  // const topic = headers['X-Shopify-Topic'.toLowerCase()];
  // if (shopifyTopicsToAccept[topic]) {
    quickBooks.createInvoice(body);
  // }
  res.send('true');
});

router.get('/test', async (req, res) => {
  const { headers, body } = req;
  quickBooks.find();
  res.json({ succ: true });
});

module.exports = router;