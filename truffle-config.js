require('babel-register');
require('babel-polyfill');

module.exports = {
    build: {
        "index.html": "index.html",
        "app.js": [
            "javascripts/app.js"
        ],
        "app.css": [
            "stylesheets/app.css"
        ],
        "images/": "images/"
    },
    rpc: {
        host: "localhost",
        port: 8545
    },
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        }
    }
};