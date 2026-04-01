import 'dotenv/config';
import app from './app.js';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WebAPI Documentation',
      version: '1.0.0',
      description: 'WebAPI cho dự án GR1',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js'], // Đường dẫn đến các file chứa chú thích API (JSDoc)
};


const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`tai liệu API có thể truy cập tại http://localhost:${PORT}/api-docs`);
});