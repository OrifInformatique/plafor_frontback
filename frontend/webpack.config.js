import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const parsedEnv = dotenv.config({ quiet: true }).parsed || {};

const APP_ROOT = process.env.APP_ROOT || '/';

export default {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[fullhash].bundle.js',
        publicPath: APP_ROOT,
        clean: true,
    },
    target: 'web',
    devServer: {
        port: process.env.PORT || '4000',
        static: {
            directory: path.join(__dirname, 'public'),
        },
        open: true,
        hot: true,
        liveReload: true,
        historyApiFallback: true,
        proxy: [
            {
                pathFilter: ['/auth', '/users', '/items', '/roles', '/tests'],
                target: process.env.BACKEND_API_URL || "http://localhost:8081",
                changeOrigin: true,
                secure: false,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
                // Required with "type": "module": allow extensionless imports in src/
                resolve: { fullySpecified: false },
            },
            {
                test: /\.(css|pcss)$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.tmpl.html'),
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(parsedEnv),
        }),
        new CopyPlugin({
            patterns: ['public'],
        }),
    ],
};
