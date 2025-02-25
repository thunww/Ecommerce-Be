// server.js
const express = require('express')
require('dotenv').config();
const path = require('path')
const app = express()
const port = process.env.PORT || 8888 ;
const hostname = process.env.HOST_NAME;
const configViewEngine = require('./config/viewengine')
//const webRoutes = require('./routers/web')
const connection = require('./config/database');
//const initAPIRoute = require('./routers/api');
const { sequelize } = require('./models');

app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});



sequelize.authenticate()
  .then(() => {
    console.log('Kết nối thành công!');
  })
  .catch(err => {
    console.error('Không thể kết nối:', err);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
