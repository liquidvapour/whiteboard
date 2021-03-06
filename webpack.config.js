const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = [{
  target: 'web',
  mode: 'development',
  entry: {
    main: './src/ui/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/server/front/script'),
    filename: 'main.js'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'eslint-loader',
          {
            loader: 'babel-loader',
            options: {
              "presets": [
                "@babel/preset-env",
                "@babel/preset-react"
              ],
              "plugins": [
                ["@babel/transform-runtime"]
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
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
  devtool: "source-map",
  node: { __dirname: false },
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