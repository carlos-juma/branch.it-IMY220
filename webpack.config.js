const path = require("path");

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve("frontend/public"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
    ],
  },
  
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
};
