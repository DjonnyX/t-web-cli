/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");

module.exports = env => {
  return merge(common(env), {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      clientLogLevel: "warning",
      hot: true,
      contentBase: [path.join(__dirname, "./dist")],
      publicPath: "/",
      port: 3000
    }
  });
};
