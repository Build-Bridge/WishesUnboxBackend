import swaggerJSDoc, { type Options } from 'swagger-jsdoc'
import path from 'path'

const swaggerOptions: Options = {
  swaggerDefinition: {
    info: {
      title: 'Wishes Unbox Backend API',
      description: 'API Documentation for Wishes Unbox Backend',
      version: '1.0.0'
    },
    servers: [{ url: 'https://wishesunbox-backend.onrender.com' }]
  },
  apis: [path.join(__dirname, 'routes', '*.ts')]
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export { swaggerSpec }
