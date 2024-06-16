const { products } = require('./products');
const { getCorsHeaders } = require('./cors');

exports.handler = async (event) => {
    const origin = event.headers.origin;
    const headers = getCorsHeaders(origin, 'GET,OPTIONS');
    const { productId } = event.pathParameters || {};
    const product = products.find(p => p.id === productId);

    if (product) {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(product),
        };
    } else {
        return {
            statusCode: 404,
            headers: headers,
            body: JSON.stringify({ message: 'Product not found' }),
        };
    }
};
