const axios = require('axios');

class Endpoints {
  constructor(options, constants) {
    this.options = options;
    this.auth = null;
    this.constants = constants;
    this.axiosInstance = axios.create();
  }

  run(name, params, body) {
    let endpoint;
    if (this.constants.APIS.DEFAULT.ENDPOINTS.hasOwnProperty(name)) {
      endpoint = this.constants.APIS.DEFAULT.ENDPOINTS[name];
      this.baseUrl = this.options.sandbox
        ? this.constants.APIS.DEFAULT.URL.SANDBOX
        : this.constants.APIS.DEFAULT.URL.PRODUCTION;
      this.authRoute = this.constants.APIS.DEFAULT.ENDPOINTS.authorize;
    } else {
      Object.keys(this.constants.APIS).forEach((key) => {
        if (this.constants.APIS[key].ENDPOINTS.hasOwnProperty(name)) {
          endpoint = this.constants.APIS[key].ENDPOINTS[name];
          this.baseUrl = this.options.sandbox
            ? this.constants.APIS[key].URL.SANDBOX
            : this.constants.APIS[key].URL.PRODUCTION;
          this.authRoute = this.constants.APIS[key].ENDPOINTS.authorize;
          return;
        }
      });
    }
    this.params = params;

    return this.req(endpoint, body);
  }

  async req(endpoint, body) {
    let req = await this.createRequest(endpoint, body);

    return this.axiosInstance
      .request(req)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  isExpired() {
    let current_time = new Date().getTime() / 1000;
    if (current_time > this.auth.authDate + this.auth.expires_in) {
      return true;
    }
    return false;
  }

  async createRequest(endpoint, body) {
    let { route, method } = endpoint;
    let regex = /\:(\w+)/g;
    let query = '';
    let placeholders = route.match(regex) || [];
    let params = {};

    for (let prop in this.params) {
      params[prop] = this.params[prop];
    }

    let getVariables = function () {
      return placeholders.map(function (item) {
        return item.replace(':', '');
      });
    };

    let updateRoute = function () {
      let variables = getVariables();
      variables.forEach(function (value, index) {
        if (params[value]) {
          route = route.replace(placeholders[index], params[value]);
          delete params[value];
        }
      });
    };

    let getQueryString = function () {
      let keys = Object.keys(params);
      let initial = keys.length >= 1 ? '?' : '';
      return keys.reduce(function (previous, current, index, array) {
        let next = index === array.length - 1 ? '' : '&';
        return [previous, current, '=', params[current], next].join('');
      }, initial);
    };

    updateRoute();
    query = getQueryString();

    let req = {
      method,
      url: String([this.baseUrl, route, query].join('')),
      data: body,
    };

    if (
      this.baseUrl != this.constants.APIS.DEFAULT.URL.PRODUCTION &&
      this.baseUrl != this.constants.APIS.DEFAULT.URL.SANDBOX
    ) {
      req['httpsAgent'] = this.agent;
    }

    let config = {
      method: method,
      maxBodyLength: Infinity,
      url: String([this.baseUrl, route, query].join('')),
      headers: {
        'X-VTEX-API-AppKey': this.constants.APIS.DEFAULT.URL.APP_KEY,
        'X-VTEX-API-AppToken': this.constants.APIS.DEFAULT.URL.APP_TOKEN,
      },
    };
    return config;
  }
}

module.exports = Endpoints;
