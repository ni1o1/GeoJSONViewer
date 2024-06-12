const { override,  addWebpackAlias } = require('customize-cra');
const path = require("path");

module.exports = override(
    addWebpackAlias({
        '@': path.resolve(__dirname, 'src'),
        '@@': path.resolve(__dirname, 'src/component'),
        '*': path.resolve(__dirname, 'src/Store'),
    })
);