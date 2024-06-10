const transformObject = (obj) => {
  const transformed = {};
  for (const key in obj) {
    transformed[key] = { skus: obj[key] };
  }
  return transformed;
};

module.exports = transformObject;
