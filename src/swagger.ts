import swaggerJSDoc, { type Options } from 'swagger-jsdoc'
import path from 'path'

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Wishes Unbox Backend API',
      description: 'API Documentation for Wishes Unbox Backend',
      version: '1.0.0'
    },
    servers: [
      { url: 'https://wishesunbox-backend.onrender.com', description: 'Production server' },
      { url: 'http://localhost:5000', description: 'Development server' }]
  },
  apis: [path.join(__dirname, 'routes', '*.ts')]
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export { swaggerSpec }
