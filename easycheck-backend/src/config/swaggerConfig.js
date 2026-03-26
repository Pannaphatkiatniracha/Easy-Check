import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// -----------------------------swagger-----------------------------------------------//
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for Easycheck',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:5000' ,
            description: 'server api'
        }
    ],
    tags: [
        {
            name: 'User',
            description: 'api for user'
        },
        {
            name: 'Admin',
            description: 'api for admin'
        }
    ]

};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./src/routers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec }

// -------------------------------------------------------------------------------------//