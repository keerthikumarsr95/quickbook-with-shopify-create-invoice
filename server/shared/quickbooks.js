const QuickBooks = require('node-quickbooks');
const config = require('../config');
const oauthClient = require('./oauthClient');
const cache = require('global-cache');

const token = {
  "access_token": "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0.._fCCC8iJd-zp-n0XovTBzg.GadpuiBkgG1EQaTVsmPu5sg3plqrSURikFwkhyY83FgDMIrfST490zc-KTqEHOn3bH49PpsYisZilSsT-WY0Hp2tx_FotQ6ylINK2FNI24v0YKvove9EfvYpe5hC1LsAq7l9_ChZLWebzhpburXi4S-ID2Q4T5jlu_fzJzCkT6pL6PkNOyG7yNSb5Rybd9-JfEXTGh07y0_yVWUF4aNG7TWr87BeI_S3xNxC6Y2ipuK4kcq8uxHD9OGyTFV6AQPzEbxiylJ8W_LJx6cf19ABWgqa59zArvt7ZqGShezpMPrC5gdSdIo_b-BGbxRXDO1jOGkWAVOBVZfdcX1x1ivA8Pzg5QRoKrD4o7QP7TruqTWIam7lZOszbmDt_mtepdTZInTgz6QBY48nbVEFC3HRGsoVcSc5IsZnWeIvqJO_UWsnv54jx8dO-QHCOdCo9FRMwbAGyxGjyAeE2kC6HaIuIqq9JFh4xflgWkB5aUxC0g1PhoBUNXiuy1TZCLfD1GcNGhW5TqPN56xfmIuGS699WHkv9ICdrRdeoEu1CIPgzCQVVRVaeXJIE1prZoITpTAII2bAm3hEoSsjw4zNzst06ww9keYiwSMoKXj7Nv9FwiHVGzhInb6zVUXgitr66ZvNflFN8kCcKaTjGE-TSeaMTsxhIZc2OQ1gS2wsMV4NgONZ3du-OwZqCr6RSwVaYceqOX4SNDwDOwonfquVIZ8BvQfHlRqrxehw5bsKj93hjVCd_VK2z8kg8fblSfL5OMw_fIZaW1T7ATDBo5pUf9dA3A.CX6ZX5E7CFEogq2n3gTaJw",
  "id_token": "eyJraWQiOiJPUElDUFJEMDkxODIwMTQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5ZWJkMjE5OC1jZDMyLTQyYzItODQwNS00MmE3ZTAyNzNmMjYiLCJhdWQiOlsiUTBNSURiWHhGQ3NVV3ljOGdBWXZtYzBueUlWRWdzd1VVa1FwZXZldzd4SU1GWTN4QWMiXSwicmVhbG1pZCI6IjEyMzE0NjM2NjM0NjI3NCIsImF1dGhfdGltZSI6MTU1OTEyMzYwNCwiaXNzIjoiaHR0cHM6XC9cL29hdXRoLnBsYXRmb3JtLmludHVpdC5jb21cL29wXC92MSIsImV4cCI6MTU1OTEzMjMyMCwiaWF0IjoxNTU5MTI4NzIwfQ.cLlR7bRLPyBsePjYkzYeUpxhzmnQyesOiJH4-BhBJcjhpdafvf7g69r9EZzLGPFBqIVodVqz6tM5DeNTe8NSiQiYpTCsGBJAyC77JYwynRekWV95qFin8zf1mnSB6sY7iuHEXoCDWzGZTCasqN76hJTNYoGmn9vVgZHrWG2z8xk",
  "token_type": "bearer",
  "x_refresh_token_expires_in": 8726400,
  "refresh_token": "L011567855120K2QRdHaA0daCKblYEh4sGaJjICKwVGLbXjwKw",
  "expires_in": 3600
}

cache.set('oauthToken', token);

const getOauthToken = async () => {
  console.log('Inside getOauthToken');

  let tokenFromCache = cache.get('oauthToken');
  if (!oauthClient.isAccessTokenValid(tokenFromCache)) {
    // console.log('valid');
    const authResponse = await oauthClient.refreshUsingToken(tokenFromCache.refresh_token);
    // console.log('authResponse: ', authResponse.getJson());
    const newToken = authResponse.getJson();
    // console.log('newToken: ', newToken);
    cache.set('oauthToken', newToken);
    tokenFromCache = newToken;
  }
  return {
    accessToken: tokenFromCache.access_token
  }
  // const newTokenResponse = oauthClient.
};

// const quickBooks = new QuickBooks(config.quickBooks.clientId,
//   config.quickBooks.clientSecret,
//   token.access_token,
//   // token.id_token,
//   '123146366346274',
//   false, // use the sandbox?
//   // true, // enable debugging?
// );
// quickBooks.setOauthVersion('2.0');

const getQuickBook = async () => {
  console.log('Inside getQuickBook');
  const token = await getOauthToken();
  console.log('token: ', token);
  return new QuickBooks(config.quickBooks.clientId,
    config.quickBooks.clientSecret,
    token.accessToken,
    false,
    '123146366346274',
    true, // use the sandbox?
    false, // enable debugging?
    4,
    '2.0'
  );
}

const getCustomerId = (quickBooks, customer) => {
  console.log('Inside getCustomerId');

  return new Promise((resolve, reject) => {
    quickBooks.findCustomers({ DisplayName: customer.email }, (err, customers) => {
      console.log('Inside findCustomers');

      // console.log('customers: ', JSON.stringify(customers));
      console.log('err: ', JSON.stringify(err, '', 4));
      if (!customers.QueryResponse.Customer) {
        const customerObject = {
          "FullyQualifiedName": customer.email,
          "PrimaryEmailAddr": {
            "Address": customer.email
          },
          "DisplayName": customer.email,
        };
        quickBooks.createCustomer(customerObject, (err, res) => {
          console.log('Inside createCustomer');

          if ((!err || !res.Fault) && res.Id) {
            resolve({ id: res.Id });
          }
        })
      } else {
        const customer = customers.QueryResponse.Customer[0];
        resolve({ id: customer.Id });
      }
    });
  });
};

const getItemFromQb = (quickBooks, lineItem) => new Promise((resolve, reject) => {
  console.log('Inside getItemFromQb');

  quickBooks.findItems({ Name: lineItem.title }, (err, items) => {
    console.log('Inside findItems');

    // console.log('customers: ', JSON.stringify(items));
    console.log('err: ', JSON.stringify(err, '', 4));
    if (!items.QueryResponse.Item) {
      const itemObject = {
        "TrackQtyOnHand": true,
        "Name": lineItem.title,
        "QtyOnHand": 9999999999,
        "IncomeAccountRef": {
          "name": "Sales of Product Income",
          "value": "190"
        },
        "AssetAccountRef": {
          "name": "Inventory Asset",
          "value": "188"
        },
        "InvStartDate": "2015-01-01",
        "Type": "Inventory",
        "ExpenseAccountRef": {
          "name": "Cost of Goods Sold",
          "value": "189"
        }
      };
      quickBooks.createItem(itemObject, (err, res) => {
        console.log('Inside createItem');

        console.log('err: ', JSON.stringify(err, null, 4));
        // console.log('res: ', JSON.stringify(res, null, 4));
        if (res) {
          resolve({ id: res.Id, name: lineItem.title, price: lineItem.price_set.shop_money.amount, quantity: lineItem.quantity });
        }
      })
    } else {
      const item = items.QueryResponse.Item[0];
      resolve({ id: item.Id, name: lineItem.title, price: lineItem.price_set.shop_money.amount, quantity: lineItem.quantity });
    }
  });
});

const getLineItemsNameAndId = (quickBooks, lineItems) => {
  console.log('Inside getLineItemsNameAndId');

  return new Promise(async (resolve, reject) => {
    const returnArray = [];
    for (let index = 0; index < lineItems.length; index++) {
      const lineItem = lineItems[index];
      const itemFromQb = await getItemFromQb(quickBooks, lineItem);
      if (itemFromQb && itemFromQb.id) {
        returnArray.push(itemFromQb);
      }
    }
    resolve(returnArray);
  })
};

const find = async () => {
  const quickBooks = await getQuickBook(token);
  quickBooks.findAccounts({ AccountType: 'Income' }, (err, accounts) => {
    console.log('err: ', JSON.stringify(err));
    console.log('accounts: ', accounts.QueryResponse.Account);
  });
};

const generateInvoice = async (quickBooks, customer, lineItems) => {
  console.log('Inside generateInvoice');

  const initObject = {
    "Line": lineItems.map(lineItem => ({
      "DetailType": "SalesItemLineDetail",
      "Amount": lineItem.price,
      "SalesItemLineDetail": {
        "Qty": lineItem.quantity,
        "ItemRef": {
          "name": "Services",
          "value": lineItem.id
        }
      }
    })),
    "CustomerRef": {
      "value": customer.id
    }
  };
  quickBooks.createInvoice(initObject, (err, res) => {
    console.log('Inside createInvoice');

    if (res) {
      console.log('******************Start*************************');
      console.log('Invoice: ', JSON.stringify(res, null, 4));
      console.log('$$$$$$$$$$$$$$$$$$$$$$$');
      console.log('invoice number');
      console.log(res.Id);
      console.log('$$$$$$$$$$$$$$$$$$$$$$$');
      console.log('*******************End************************');
    } else {
      console.log('Invoice: ', JSON.stringify(err, null, 4));
    }
  });
}

const createInvoice = async (order) => {
  try {
    console.log('Inside createInvoice');
    const quickBooks = await getQuickBook(token);
    const customerId = await getCustomerId(quickBooks, order.customer);
    console.log('customerId: ', customerId);
    const lineItems = await getLineItemsNameAndId(quickBooks, order.line_items);
    console.log('lineItems: ', lineItems);
    await generateInvoice(quickBooks, customerId, lineItems);
  } catch (error) {
    console.log('error: ', error);

  }

};

module.exports = {
  find,
  createInvoice,
};