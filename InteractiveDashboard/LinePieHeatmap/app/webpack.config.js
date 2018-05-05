const path = require('path');
var webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var ProvidePlugin = webpack.ProvidePlugin;
module.exports = {
    entry: ['./src/app.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'data-viewing.js',
    },
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 9191,
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        alias: {
            jquery: path.join(__dirname, 'node_modules/jquery/dist/jquery'),
            moment: path.join(__dirname, 'node_modules/moment/min/moment.min.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['es2015', 'stage-0'] },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader'],
                }),
            },
            {
                test: /\.css/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true, importLoaders: 1 },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8192,
                            name: '[path][name].[ext]?[hash]',
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
        }),
        new ExtractTextPlugin('data-viewing.css'),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'data'),
                to: path.join(__dirname, 'dist') + '/data',
            },
        ]),
        //   new UglifyJsPlugin()
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
        }),
    ],
};
