module.exports = {
  APIS: {
    DEFAULT: {
      URL: {
        PRODUCTION: 'https://tewbhv.myvtex.com/api',
        SANDBOX: 'https://tewbhv.myvtex.com/api',
        APP_KEY: 'vtexappkey-tewbhv-TCGBMK',
        APP_TOKEN:
          'UQTRAYLQTHRLTTPSQEAPFAVJJDFEOZBVYIPYCSJIGAGLPMFRLVHJTXJLKYPXFSPJHNCAAPHREAYKLJKXHYOPGMMIXWIXBOENNCPTEPSMXSNCUQAMGVLYNKGCQORPRZDY',
      },
      ENDPOINTS: {
        getProductAndSkuIds: {
          route: '/catalog_system/pvt/products/GetProductAndSkuIds',
          method: 'get',
        },
        getProductDetail: {
          route: '/catalog/pvt/product/:id',
          method: 'get',
        },
        getProductSpecification: {
          route: '/catalog_system/pvt/products/:id/specification',
          method: 'get',
        },
        getSkuDetail: {
          route: '/catalog/pvt/stockkeepingunit/:skuId',
          method: 'get',
        },
        getSkuSpecification: {
          route: '/catalog/pvt/stockkeepingunit/:skuId/specification',
          method: 'get',
        },
      },
    },
  },
};
