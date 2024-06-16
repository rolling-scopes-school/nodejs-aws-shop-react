const { handler } = require('../lambdas/getProductsById');
const { products } = require('../lambdas/products');

describe('getProductList', () => {
    it('should return all products with status code 200', async () => {
        const event = { headers: { origin: 'http://localhost:3000' } };
        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.headers['Access-Control-Allow-Origin']).toBe('http://localhost:3000');
        expect(response.headers['Access-Control-Allow-Headers']).toBe('Content-Type');
        expect(response.headers['Access-Control-Allow-Methods']).toBe('GET,OPTIONS');
        expect(JSON.parse(response.body)).toEqual(products);
    });
});
