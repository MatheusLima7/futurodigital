const Endpoints = require('./lib/endpoints.js');
const constants = require('./lib/constants.js');

class Catalog {
  constructor(options) {
    let methods = {};

    Object.keys(constants.APIS).forEach((api) => {
      Object.assign(methods, constants.APIS[api].ENDPOINTS);
    });

    let endpoints = new Endpoints(options, constants);
    Object.keys(methods).forEach(function (api) {
      Catalog.prototype[api] = function (params, body) {
        return endpoints.run(api, params, body);
      };
    });
  }
}

module.exports = Catalog;
