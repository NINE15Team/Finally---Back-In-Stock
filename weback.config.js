// webpack.config.js
module.exports = {
  // other webpack config
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // other rules
    ],
  },
};
