var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(req.productsSpecification);
});

router.get('/productAllData', function (req, res, next) {
  res.json(req.productsSpecification);
});

router.get('/skusAllData', function (req, res, next) {
  res.json(req.skusDetail);
});

module.exports = router;
