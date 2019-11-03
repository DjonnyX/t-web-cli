const merge = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");

module.exports = (env) => {
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
