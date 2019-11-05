/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
  return {
    entry: {
      main: ["@babel/polyfill", "./src/index.ts"]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].styles.css"
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        title: "Telegram Web Client",
        favicon: "./src/favicon.ico",
      })
    ],
    output: {
      filename: "[name].bundle.js",
      chunkFilename: "[id].chunk.js",
      path: path.resolve(__dirname, "./dist"),
      publicPath: "/"
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /.(ts)$/,
          exclude: /node_modules/,
          loaders: ["ts-loader"]
        },
        {
          test: /.(js)$/,
          exclude: /node_modules/,
          loaders: ["babel-loader"]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                minimize: true
              }
            }
          ]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader:
                env.NODE_ENV === "production"
                  ? MiniCssExtractPlugin.loader
                  : "style-loader"
            },
            {
              loader: "css-loader",
              options: { sourceMap: true }
            },
            {
              loader: "resolve-url-loader"
            },
            {
              loader: "sass-loader",
              options: { sourceMap: true }
            }
          ]
        },
        {
          test: /\.(ico|png|gif|jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "[name].[ext]",
                outputPath: (url, resourcePath, context) => {
                  if (env.NODE_ENV === "development") {
                    const relativePath = path.relative(context, resourcePath);
                    return `/${relativePath}`;
                  }
                  return `/assets/${path.basename(resourcePath)}`;
                }
              }
            }
          ]
        }
      ]
    }
  };
};
