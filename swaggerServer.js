const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Загрузка файла Swagger
const swaggerDocument = YAML.load(path.join(__dirname, 'product_service', 'docs', 'openapi.yaml'));

const app = express();

// Настройка маршрута для отображения Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Swagger UI is running on http://localhost:${PORT}/api-docs`);
});
