/*=========================================================================================
  File Name: vue.config.js
  Description: configuration file of vue
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - Clean Vue.js Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
const TerserPlugin = require('terser-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  publicPath: '/',
  pwa: {
    name: 'Qualizy',
    appleMobileWebAppCapable: 'yes',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      exclude: [
        /\.map$/,
        /manifest\.json$/
      ],
    },
    themeColor: '#2196f3'
  },

  configureWebpack: {
    output: {
      crossOriginLoading: 'anonymous'
    },
    plugins: [
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ],
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      },
      minimize: true,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          comments: false,
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            }
          }
        }
      }
    }
  }
}