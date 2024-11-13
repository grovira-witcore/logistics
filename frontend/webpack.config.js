const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  entry: './src/index.js',
  output: {
    path: Path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public', 
          to: '',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  ],
  devServer: {
    static: {
      directory: Path.join(__dirname, 'public'),
    },
    compress: true,
    historyApiFallback: true,
    port: 3000,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.use(
        '/api',
        createProxyMiddleware({
          target: 'http://localhost:4000',
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        })
      );
      return middlewares;
    },
  }
};
