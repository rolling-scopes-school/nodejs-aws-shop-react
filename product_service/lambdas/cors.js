const allowedOrigins = [
    '*'//'http://localhost:3000' //http://localhost:3000/api-docs
];

const getCorsHeaders = (origin, methods = 'GET,POST,PUT,DELETE,OPTIONS') => {
    const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': methods,
		'Content-Type': 'application/json'
    };
};

module.exports = { getCorsHeaders };
