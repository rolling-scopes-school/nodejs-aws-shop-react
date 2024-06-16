const { handler } = require('../lambdas/getProductsById');
const { products } = require('../lambdas/products');

describe('getProductsById', () => {
    it('should return a product with status code 200 when the product exists', async () => {
        const event = {
            headers: { origin: 'http://localhost:3000' },
            pathParameters: { productId: '1' }
        };
        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.headers['Access-Control-Allow-Origin']).toBe('http://localhost:3000');
        expect(response.headers['Access-Control-Allow-Headers']).toBe('Content-Type');
        expect(response.headers['Access-Control-Allow-Methods']).toBe('GET,OPTIONS');
        expect(JSON.parse(response.body)).toEqual(products[0]);
    });

    it('should return a 404 status code when the product does not exist', async () => {
        const event = {
            headers: { origin: 'http://localhost:3000' },
            pathParameters: { productId: '999' }
        };
        const response = await handler(event);

        expect(response.statusCode).toBe(404);
        expect(response.headers['Access-Control-Allow-Origin']).toBe('http://localhost:3000');
        expect(response.headers['Access-Control-Allow-Headers']).toBe('Content-Type');
        expect(response.headers['Access-Control-Allow-Methods']).toBe('GET,OPTIONS');
        expect(JSON.parse(response.body)).toEqual({ message: 'Product not found' });
    });
});
