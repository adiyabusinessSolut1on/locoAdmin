const webpack = require('webpack');

module.exports = {
  // ... other configurations ...
  plugins: [
    new webpack.ProvidePlugin({
      global: 'global-this'
    })
  ]
};
