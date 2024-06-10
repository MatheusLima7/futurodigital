var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');

var indexRouter = require('./routes/index');
var coursesRouter = require('./routes/courses');
var skusRouter = require('./routes/skus');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let products = {};
let productsDetail = {};
let productsSpecification = {};
let skusDetail = {};

const run = async () => {
  await axios
    .get('http://localhost:3000/courses')
    .then((response) => {
      products = response.data;
    })
    .catch((error) => {
      console.error('Erro ao chamar a rota /courses:', error);
    });

  await axios
    .get('http://localhost:3000/courses/productsDetail')
    .then((response) => {
      productsDetail = response.data;
    })
    .catch((error) => {
      console.error('Erro ao chamar a rota /detail courses:', error);
    });

  await axios
    .get('http://localhost:3000/courses/productsSpecification')
    .then((response) => {
      productsSpecification = response.data;
    })
    .catch((error) => {
      console.error('Erro ao chamar a rota /specification courses:', error);
    });

  await axios
    .get('http://localhost:3000/skus/skusDetail')
    .then((response) => {
      skusDetail = response.data;
    })
    .catch((error) => {
      console.error('Erro ao chamar a rota / detail skus:', error);
    });
};

run().catch(console.error);

app.use(async (req, res, next) => {
  req.products = products;
  req.productsDetail = productsDetail;
  req.productsSpecification = productsSpecification;
  req.skusDetail = skusDetail;
  return next();
});

app.use('/', indexRouter);
app.use('/courses', coursesRouter);
app.use('/skus', skusRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
