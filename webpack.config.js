const package = require("./package.json")
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const EnvironmentVariablesPlugin = require("./webpack/plugins/environment-variables-plugin")

module.exports = (env) => ({
    cache: {
        type: "memory",
    },
    output: {
        filename: "scr/[name].[contenthash].js",
        path: path.resolve(__dirname, "build"),
    },
    entry: {
        app: "./src/index.tsx",
    },
    target: "web",
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", ".wasm"],
        enforceExtension: false,
        alias: {
            "@/contract": path.resolve(__dirname, "src/contract"),
            "@/mock": path.resolve(__dirname, "src/mock"),
            "@/tool": path.resolve(__dirname, "src/tool"),
            "@/ui": path.resolve(__dirname, "src/ui"),
            "@/view": path.resolve(__dirname, "src/view"),
        },
    },
    devtool: "inline-source-map",
    devServer: {
        compress: true,
        static: {
            directory: path.resolve(__dirname, "./public"),
        },
        client: {
            logging: "verbose",
            overlay: { errors: true, warnings: false },
            progress: true,
        },
        hot: true,
        // Open WebBrowser.
        open: true,
        port: 8080,
    },
    plugins: [
        EnvironmentVariablesPlugin(env),
        new CleanWebpackPlugin({
            // We don't want to remove the "index.html" file
            // after the incremental build triggered by watch.
            cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public"),
                    filter: async path => {
                        return !path.endsWith("index.html")
                    },
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: "public/index.html",
            filename: "index.html",
            version: package.version,
            title: "Circuit Studio",
        }),
    ],
    optimization: {
        // Create a single runtime bundle for all chunks.
        runtimeChunk: "single",
        splitChunks: {
            // All the node_modules libs on a single file.
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "libs",
                    chunks: "all",
                },
            },
        },
        // Prevent "libs.[contenthash].js" from changing its hash if not needed.
        moduleIds: "deterministic",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: false,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpe?g|gif|webp)$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "img/[name].[contenthash].[ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
                options: {
                    name: "fnt/[contenthash].[ext]",
                },
            },
            {
                test: /\.(frag|vert)$/,
                loader: "raw-loader",
            },
            {
                test: /\.ya?ml$/,
                type: "json",
                use: "yaml-loader",
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
})
