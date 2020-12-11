const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = [{
    mode: 'development',
    entry: {
      main: './src/ui/index.js',      
    },
    output: {
        path: path.resolve(__dirname, 'dist/server/ui/script'),
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
  }, {
    mode: 'development',
    entry: {
      server: './src/server/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/server'),
        filename: 'main.js'
    },
    target: 'node',
    externals: [nodeExternals()],    
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