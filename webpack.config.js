const path = require('path');

module.exports = [{
    mode: 'development',
    entry: {
      main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/script'),
        filename: 'main.js'
    },
    devtool: "source-maps",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'          
        }
      ]
    }
  }];