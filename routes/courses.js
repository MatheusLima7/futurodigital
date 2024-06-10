var express = require('express');
var router = express.Router();
var Catalog = require('../catalog.js');
var options = require('../lib/credentials.js');
var transformObject = require('../utils/transform.js');

/* GET courses listing. */
router.get('/', async function (req, res, next) {
  const params = {};
  const body = {};

  const catalog = new Catalog(options);

  let products = {};

  await catalog
    .getProductAndSkuIds(params, body)
    .then((response) => {
      products = transformObject(response.data);
    })
    .catch((error) => {
      console.log(' error ====>', error);
    });

  res.json(products);
});

router.get('/productsDetail', async function (req, res, next) {
  const body = {};

  const catalog = new Catalog(options);

  let requests = [];

  for (const key in req.products) {
    if (req.products.hasOwnProperty(key)) {
      const params = { id: key };
      requests.push(catalog.getProductDetail(params, body));
    }
  }

  let products = [];

  const transform = async (response) =>
    response.map((item) => {
      return { ...item, ...req.products[item.Id] };
    });

  Promise.all(requests).then(async (response) => {
    products = await transform(response);

    res.json(products);
  });
});

router.get('/productsSpecification', async function (req, res, next) {
  const body = {};

  const catalog = new Catalog(options);

  let requests = [];

  let ids = [];

  req.productsDetail.map((item) => {
    const params = { id: item.Id };
    ids.push(item.Id);
    requests.push(catalog.getProductSpecification(params, body));
  });

  let productsSpecification = [];

  const transform = (response) =>
    req.productsDetail.map((item, index) => {
      return { ...item, specification: response[index] };
    });

  Promise.all(requests).then((response) => {
    productsSpecification = transform(response);
    res.json(productsSpecification);
  });
});

module.exports = router;
