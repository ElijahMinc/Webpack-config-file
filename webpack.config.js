// ctrl + space = подсказки

const path = require('path') // встроенный модуль в Node.js
//он помогает удобно работать с путями на платформе
const HTMLWebpackPlugin = require('html-webpack-plugin'); // плагин, позволяющий работать с html файлами.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');



const isDev = process.env.NODE_ENV === 'development' // системная переменная в среде node.js
const isProd = !isDev


const optimize = () => {
   const config = {
      // splitChunk: {
      //    chunk: 'all'
      // }
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

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

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


console.log('Is Dev:', isDev)



module.exports = {
   context: path.resolve(__dirname, 'src'), // папка, от которой отталкивает webpack
   mode: 'development',
   devtool: isDev ? 'source-map' : 'eval-source-map',//поле для того, как будет выглядеть наш исходный код // eval-source-map
   //  isDev ? 'source-map' : ''
   entry: {
      index: ['@babel/polyfill', './index.js'], // после context можно не указывать исходную папку
      // if you want use jsx you should use format index.jsx
      // analytics: './analytics.js'
   }, //указываем входной файл
   output: {
      filename: filename('js'), // '[name].bundle.js', [contenthash] - добавляет свой хэш
      path: path.resolve(__dirname, 'dist'), // вернет строчку. Корректно для вепбака
   },
   resolve: {
      extensions: ['.js', '.jsx', '.json'], // какие расширения веб-паку понимать по умолчанию
      alias: { // относительные пути
         '@modules': path.resolve(__dirname, 'src/modules'),
         '@': path.resolve(__dirname, 'src'),
      }
   },

   optimization: optimize(),
   // optimization: {
   //    minimizer: [
   //       new OptimizeCssAssetWebpackPlugin(),
   //       new TerserWebpackPlugin()
   //    ]
   // },
   devServer: {
      port: 4200,
      open: true,
      hot: isDev
   },
   module: {
      rules: [
         // Use JS with Babel
         {
            test: /\.m?js$/, // какого расширения файл мы возьмем
            exclude: /(node_modules)/, //какие файлы мы можем не включать в конвертацию
            use: { // use?
               loader: 'babel-loader',
               options: babelOptions()
            }
         },
         //Use TS with Babel
         {
            test: /\.m?ts$/, // какого расширения файл мы возьмем
            exclude: /(node_modules)/, //какие файлы мы можем не включать в конвертацию
            use: { // use?
               loader: 'babel-loader',
               options: babelOptions('@babel/preset-typescript')
            }
         },
         //Use JSX with Babel
         {
            test: /\.m?jsx$/, // какого расширения файл мы возьмем
            exclude: /(node_modules)/, //какие файлы мы можем не включать в конвертацию
            use: { // use?
               loader: 'babel-loader',
               options: babelOptions('@babel/preset-react')
            }
         },
         // Use Css
         {
            test: /\.css$/i,
            use: cssLoaders(),
            exclude: /\.module\.css$/
            // css loader позволяет понимать импорты css files
            // style-loader позволяет распознавать добавляемые стили в css files
         },
         // Use Scss/css
         {
            test: /\.s[ac]ss$/i,
            use: cssLoaders('sass-loader')
            // use: [
            //    // Creates `style` nodes from JS strings
            //    MiniCssExtractPlugin.loader,
            //    // Translates CSS into CommonJS
            //    'css-loader',
            //    // Compiles Sass to CSS
            //    'sass-loader',
            // ],
         },
         // use Module-CSS
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
               },
               'postcss-loader'
            ],
            include: /\.module\.css$/
         },

         // Use Images
         {
            test: /\.(png|jpe?g|gif)$/i,
            use: ['file-loader'],

         },
         // Use Fonts
         {
            test: /\.(eot|woff|woff2|ico|svg|ttf)([\?]?.*)$/,
            type: 'asset/resource',
            use: ['file-loader'],
         },
         // Use Xml type file
         {
            test: /\.xml$/i,
            use: ['xml-loader'],

         },
         // Use csv type file
         {
            test: /\.xml$/i,
            use: ['csv-loader'],
         },
      ]
   },
   plugins: [
      new HTMLWebpackPlugin({
         // title: 'New Application', // default title
         template: './index.html', // путь к html файлу
         minify: {
            collapseWhitespace: isProd,
         }
      }),
      new MiniCssExtractPlugin({
         filename: filename('css'),
         linkType: 'text/css',
      }),

      new CopyPlugin({
         patterns: [
            // { from: './images', to: './images' }, // use in layout (Verstka)
            { from: path.resolve(__dirname, 'src/images/favicon.ico'), to: path.resolve(__dirname, 'dist') },
            // { from: './fonts', to: './fonts' },
         ],
      }),
      new CleanWebpackPlugin()
   ],
}