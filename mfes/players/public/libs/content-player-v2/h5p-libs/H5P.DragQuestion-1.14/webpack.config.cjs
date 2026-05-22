const path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/drag-question.js',
  output: {
    filename: 'h5p-drag-question.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'H5PDragQuestion',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
    ],
  },
};
