const { products } = require('./products');
const { getCorsHeaders } = require('./cors');

exports.handler = async (event) => {
    const origin = event.headers.origin;
    const headers = getCorsHeaders(origin, 'GET,OPTIONS');

    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(products),
    };
};
