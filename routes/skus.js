var express = require('express');
var router = express.Router();
var Catalog = require('../catalog.js');
var options = require('../lib/credentials.js');

router.get('/skusDetail', async function (req, res, next) {
  const body = {};

  const catalog = new Catalog(options);

  let skuIds = [];

  for (let key in req.products) {
    if (req.products.hasOwnProperty(key)) {
      if (req.products[key].skus) {
        skuIds = skuIds.concat(req.products[key].skus);
      }
    }
  }

  let requestSkuIds = [];

  for (var i = 0; i < skuIds.length; i++) {
    const params = { skuId: skuIds[i] };
    requestSkuIds.push(catalog.getSkuDetail(params, body));
  }

  const transform = (response) =>
    response.map((item) => {
      const productDetail = req.productsSpecification.find(
        (product) => product.Id === item.ProductId
      );
      return { ...item, productDetail };
    });

  let skus;

  Promise.all(requestSkuIds).then(async (response) => {
    skus = transform(response);

    res.json(skus);
  });
});

router.get('/skusSpecification', async function (req, res, next) {
  const body = {};

  const catalog = new Catalog(options);

  const skuIds = req.skusDetail.map((item) => item.Id);

  let requestSkuIds = [];

  for (var i = 0; i < skuIds.length; i++) {
    const params = { skuId: skuIds[i] };
    requestSkuIds.push(catalog.getSkuSpecification(params, body));
  }

  const transform = (response) =>
    response.map((item) => {
      const specification = req.productsSpecification.find(
        (product) => product.Id === item.ProductId
      );
      return { ...item, specification };
    });

  let skus;

  Promise.all(requestSkuIds).then(async (response) => {
    skus = transform(response);

    res.json(skus);
  });
});

module.exports = router;
