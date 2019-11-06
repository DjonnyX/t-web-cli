/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (env) => {
  return merge(common(env), {
    mode: "production"
  });
};
