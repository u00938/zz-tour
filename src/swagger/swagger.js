const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const options = {
  info: {
    title: 'zz-tour API',
    description: 'API 문서',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};
const outputFile = './swagger-output.json';
const endpointsFiles = [
  '../api/route/user',
  '../api/route/admin',
  '../api/route/tour'
];
swaggerAutogen(outputFile, endpointsFiles, options);