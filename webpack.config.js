const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: [
    path.join(__dirname, "src/index.js"),
    path.join(__dirname, "src/index.css"),
  ],
  output: {
    path: path.join(__dirname, "./server/public"),
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "./server/public"),
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development", // This will provide default value for NODE_ENV, unless defined otherwise
    }),
  ],
};
