/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-unused-vars: "off" */

const path = require("path");
const webpack = require("webpack");

const dotenvFlow = require("dotenv-flow");
dotenvFlow.config({
  silent: true,
});

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const CopyPlugin = require("copy-webpack-plugin");

const babelPresetReactAppWebpackOverrides = require.resolve(
  "babel-preset-react-app/webpack-overrides"
);
const babelPresetReactApp = require("babel-preset-react-app");
const reactRefreshBabel = require("react-refresh/babel");

//!Todo: extract into an external lib [or use loader-utils after future base64url support]
const xxhash = require("xxhash");
const base64url = require("base64url");
function getContentHashBase64url(data) {
  return base64url.encode(xxhash.hash64(Buffer.from(data), 0, "Buffer"));
}

const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");

const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const cssNanoPresetAdvanced = require("cssnano-preset-advanced");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TerserPlugin = require("terser-webpack-plugin");

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const PrerenderSPAPlugin = require("prerender-webpack5-plugin");

module.exports = () => {
  return new Promise((resolve, reject) => {
    resolve();
  }).then(() => {
    return {
      stats: "minimal",
      mode: process.env.NODE_ENV,
      entry: ["@/index.tsx"],
      devtool: process.env.NODE_ENV === "production" ? false : "source-map",
      output: {
        path: process.env.APP_RELEASE
          ? path.resolve(__dirname, "server", "prerendered")
          : path.resolve(__dirname, "dist"),
        hashFunction: "xxhash64",
        hashDigest: "base64url",
        chunkLoadingGlobal: "w",
        chunkLoading: "jsonp",
        crossOriginLoading: "anonymous",
        filename:
          process.env.NODE_ENV === "production"
            ? "[contenthash].js"
            : "js/[name][id].js",
        chunkFilename:
          process.env.NODE_ENV === "production"
            ? "[contenthash].js"
            : "js/[name][id].js",
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
          "§": path.resolve(__dirname, "resources"),
        },
        extensions: [".tsx", ".ts", ".mjs", ".js", ".jsx", ".json", ".wasm"],
      },
      module: {
        rules: [
          {
            test: /\.ejs$/,
            loader: "ejs-loader",
            options: {
              esModule: false,
            },
          },
          {
            test: /\.s[ac]ss$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          },
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif|avif|jxl|webp)$/i,
            type: "asset/resource",
            generator: {
              filename:
                process.env.NODE_ENV === "production"
                  ? "[contenthash][ext]"
                  : "img/[name][id][ext]",
            },
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            type: "asset/resource",
            generator: {
              filename:
                process.env.NODE_ENV === "production"
                  ? "[contenthash][ext]"
                  : "media/[name][id][ext]",
            },
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
            type: "asset/resource",
            generator: {
              filename:
                process.env.NODE_ENV === "production"
                  ? "[contenthash][ext]"
                  : "fonts/[name][id][ext]",
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: "babel-loader",
            exclude:
              process.env.NODE_ENV === "development"
                ? /(node_modules)/
                : () => false,
            options: {
              customize: babelPresetReactAppWebpackOverrides,
              presets: [
                [
                  babelPresetReactApp,
                  {
                    runtime: "automatic",
                  },
                ],
              ],

              plugins: [
                process.env.NODE_ENV === "development" && reactRefreshBabel,
              ].filter(Boolean),

              cacheDirectory: process.env.NODE_ENV !== "production",
              cacheCompression: process.env.NODE_ENV === "production",
              compact: process.env.NODE_ENV === "production",
            },
          },
        ],
      },
      plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          title: "",
          filename: "index.html",
          template: `./public/index.ejs`,
          templateContent: false,

          templateParameters: {
            //EJS params here
          },
          inject: true,

          scriptLoading: "defer",
          favicon: "",
          meta: {},
          base: {},
          minify: {
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            decodeEntities: true,
            html5: true,
            keepClosingSlash: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            noNewlinesBeforeTagClose: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            sortAttributes: true,
            sortClassName: true,
            trimCustomFragments: true,
            useShortDoctype: true,
          },
          hash: false,
          cache: true,
          showErrors: process.env.NODE_ENV !== "production",
          //chunks: [],
          chunksSortMode: "auto",
          excludeChunks: "",
          xhtml: true,
        }),
        new CopyPlugin({
          patterns: [
            {
              from: "public",
              globOptions: {
                ignore: ["**/index.ejs"],
              },
            },
          ],
        }),
        new MiniCssExtractPlugin({
          filename:
            process.env.NODE_ENV === "production"
              ? "[contenthash].css"
              : "css/[name][id].css",
          chunkFilename:
            process.env.NODE_ENV === "production"
              ? "[contenthash].css"
              : "css/[name][id].css",
          ignoreOrder: false,
          insert: "document.head.appendChild(linkTag)",
          attributes: {},
          linkType: "text/css",
          runtime: false,
          experimentalUseImportModule: undefined,
        }),
        new webpack.DefinePlugin({}),
        new webpack.ProvidePlugin({}),
        process.env.NODE_ENV === "development" &&
          new ReactRefreshWebpackPlugin(),
        process.env.NODE_ENV === "production" &&
          !process.env.APP_RELEASE &&
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerHost: "localhost",
            alalyzerPort: 8888,
            reportFilename: "report.html",
            reportTitle: "BundleAnalyzer",
            defaultSizes: "parsed",
            openAnalyzer: false,
            generateStatsFile: false,
            statsFilename: "stats.json",
            statsOptions: null,
            excludeAssets: null,
            logLevel: "info",
          }),
        new PreloadWebpackPlugin({
          rel: "preload",
          as(entry) {
            if (/\.(css)$/.test(entry)) return "style";
            if (/\.(eot|woff|woff2|ttf)$/.test(entry)) return "font";
            if (/\.(avif|gif|jpeg|png|svg|webp)$/.test(entry)) return "image";
            return "script";
          },
          include: "asyncChunks",
        }),

        process.env.APP_RELEASE &&
          new CompressionPlugin({
            test: /\.(js|css|svg|html|txt)$/,
            include: undefined,
            exclude: undefined,
            algorithm: "brotliCompress",
            compressionOptions: {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
              },
            },
            threshold: 0,
            minRatio: 0.9,
            filename: "[path][base].br",
            deleteOriginalAssets: true,
          }),
        process.env.APP_RELEASE &&
          new PrerenderSPAPlugin({
            indexPath: "index.html",
            routes: ["/"],
          }),
      ].filter(Boolean),
      optimization: {
        chunkIds: "total-size",
        concatenateModules: process.env.NODE_ENV === "production",
        emitOnErrors: false,
        flagIncludedChunks: process.env.NODE_ENV === "production",
        innerGraph: process.env.NODE_ENV === "production",
        mangleExports: process.env.NODE_ENV === "production" ? "size" : false,
        mangleWasmImports: process.env.NODE_ENV === "production",
        mergeDuplicateChunks: process.env.NODE_ENV === "production",

        minimize: process.env.NODE_ENV === "production",

        minimizer: [
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            include: undefined,
            exclude: undefined,
            parallel: true,
            minify: TerserPlugin.terserMinify,
            terserOptions: {
              ecma: 2016,
              enclose: false,
              parse: {
                bare_returns: true,
                html5_comments: true,
                shebang: true,
                spidermonkey: false,
              },
              compress: {
                defaults: true,
                arrows: true,
                arguments: true,
                booleans: true,
                booleans_as_integers: true,
                collapse_vars: true,
                comparisons: true,
                computed_props: true,
                conditionals: true,
                dead_code: true,
                directives: true,
                drop_console: true,
                drop_debugger: true,
                ecma: 2016,
                evaluate: true,
                expression: false,
                global_defs: {},
                hoist_funs: true,
                hoist_props: true,
                hoist_vars: true,
                if_return: true,
                inline: true,
                join_vars: true,
                keep_classnames: false,
                keep_fargs: false,
                keep_fnames: false,
                keep_infinity: false,
                loops: true,
                module: false,
                negate_iife: true,
                passes: 10,
                properties: true,
                pure_funcs: [],
                pure_getters: "strict",
                reduce_vars: true,
                reduce_funcs: true,
                sequences: true,
                side_effects: true,
                switches: true,
                toplevel: false,
                top_retain: null,
                typeofs: true,

                unsafe: true,
                unsafe_arrows: true,
                unsafe_comps: true,
                unsafe_Function: true,
                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_undefined: true,
                unused: true,
              },
              mangle: true,
              module: true,
              output: {
                comments: false,
              },
              format: null,
              sourceMap: false,
              toplevel: false,
              nameCache: null,
              ie8: false,
              keep_classnames: undefined,
              keep_fnames: false,
              safari10: false,
            },
            extractComments: false,
          }),
          "...",
          new CssMinimizerWebpackPlugin({
            test: /\.foo\.css$/i,
            include: undefined,
            exclude: undefined,
            parallel: false,
            minify: [
              CssMinimizerWebpackPlugin.cssoMinify,
              CssMinimizerWebpackPlugin.cssnanoMinify,
              CssMinimizerWebpackPlugin.cleanCssMinify,
            ],
            minimizerOptions: [
              {
                restructure: true,
              },
              {
                preset: cssNanoPresetAdvanced,
              },
              {
                level: {
                  1: {
                    roundingPrecision: "all=5",
                  },
                  2: {},
                },
              },
            ],
          }),
          "...",
          new ImageMinimizerPlugin({
            test: /.(svg)$/i,
            include: undefined,
            exclude: undefined,
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              filter: () => true,
              filename: "[path][name][ext]",
              options: {
                plugins: ["imagemin-svgo"],
                encodeOptions: {},
              },
            },
            /*
            ? Do you prefer compile-time image rerendering or designer will give me the most optimized images?
            generator: [
              {
                preset: "avif",
                implementation: ImageMinimizerPlugin.squooshGenerate,
                options: {
                  encodeOptions: {
                    avif: {
                      cqLevel: 33,
                    },
                  },
                },
              },
            ],*/
            severityError: "error",
            loader: true,
            deleteOriginalAssets: true,
          }),
        ],
        moduleIds: process.env.NODE_ENV === "production" ? "size" : "named",
        portableRecords: true,
        providedExports: process.env.NODE_ENV === "production",
        realContentHash: process.env.NODE_ENV === "production",
        removeAvailableModules: process.env.NODE_ENV === "production",
        removeEmptyChunks: process.env.NODE_ENV === "production",
        runtimeChunk: false,
        sideEffects: process.env.NODE_ENV === "production",
        splitChunks:
          process.env.NODE_ENV === "production"
            ? {
                chunks: "all",

                maxAsyncRequests: 32,
                maxInitialRequests: 32,

                minChunks: 1,
                hidePathInfo: true,

                //? Do I need to increase performance by increasing the final size after compression?
                //minSize: 51200,
                //minSizeReduction: 10240,
                // enforceSizeThreshold: 51200,
                minRemainingSize: 0,
                //maxSize: 0,
                name: false,
                usedExports: true,
                cacheGroups: {
                  defaultVendors: {
                    reuseExistingChunk: true,
                    filename: "[contenthash].js",
                  },
                  extractPopupStyles: {
                    name: "style",
                    chunks: (chunk) => chunk.name === "popup",
                  },
                },
              }
            : false,
        usedExports: process.env.NODE_ENV === "production",
      },
    };
  });
};
