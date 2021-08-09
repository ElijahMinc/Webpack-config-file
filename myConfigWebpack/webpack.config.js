const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development' // системная переменная в среде node.js
const isProd = !isDev

const optimize = () => {
   const config = {
      runtimeChunk: 'single',
      splitChunks: {
         cacheGroups: {
            vendor: {
               test: /[\\/]node_modules[\\/]/,
               name: 'vendors',
               chunks: 'all'
            }
         }
      }
   }

   if (isProd) {
      config.minimizer = [
         new OptimizeCssAssetWebpackPlugin(),
         new TerserWebpackPlugin()
      ]
   }
   return config
}
const cssLoaders = extra => {
   let loaders = [
      // MiniCssExtractPlugin.loader,
      // 'css-loader',
      {
         loader: MiniCssExtractPlugin.loader,
         // options: {
         //    hmr: isDev, //мы можем изменять что-то без перезагрузки страницы
         //    // если isDev = true, то hmr true, и наоборот
         //    realoadAll: true, // 
         //    publicPath: path.resolve(__dirname, 'dist')
         // }, ?????
      },
      'css-loader',
   ]
   if (extra) {
      loaders.push(extra)
   }
   return loaders
}

const babelOptions = preset => {
   const opts = {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-proposal-class-properties']
   }

   if (preset) {
      opts.presets.push(preset)
   }

   return opts
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`


console.log('Is Dev:', isDev)



module.exports = {
   context: path.resolve(__dirname, 'src'), // папка, от которой отталкивается webpack
   mode: 'development',
   devtool: isDev ? 'source-map' : 'eval-source-map',
   entry: {
      index: ['@babel/polyfill', './index.jsx'],
      // static: ['./src/index.html']
   },
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename('js'),
      clean: true,
   },
   resolve: {
      extensions: [// какие расширения веб-паку понимать по умолчанию
         '.js',
         '.jsx',
      ],
   },
   optimization: optimize(),
   devServer: {
      port: 4200,
      open: true,
   },
   module: {
      rules: [
         // Use JS/Babel
         {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: babelOptions()
            }
         },
         {
            test: /\.m?jsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: babelOptions('@babel/preset-react')
            }
         },
         {
            test: /\.(svg|jpg|jpeg|gif|png|webp)$/,
            type: 'asset/resource',
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            // use: 'asset/resource',
            use: 'file-loader',
         },
         {
            test: /\.css$/,
            use: cssLoaders(),
            exclude: /\.module\.css$/
         },
         {
            test: /\.css$/,
            use: [
               'style-loader',
               {
                  loader: 'css-loader',
                  options: {
                     importLoaders: 1,
                     modules: true
                  }
               }
            ]
         },
         {
            test: /\.scss$/,
            use: cssLoaders('sass-loader')
         },
         // {
         //    test: /.html$/,
         //    type: 'asset/resource',
         //    generator: {
         //       filename: '[name][ext]'
         //    }
         // },
      ]
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: './public/index.html',
         minify: {
            collapseWhitespace: isProd,
         }
      }),
      // new CopyPlugin({
      //    patterns: [
      //       { from: "fonts/StyleScript-Regular.ttf", to: "fonts" },
      //    ],
      // }),
      new MiniCssExtractPlugin({
         filename: filename('css'),
         linkType: 'text/css'
      }),
   ],
   experiments: {
      asset: true
   },
}