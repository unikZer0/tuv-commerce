const express = require('express');
const bodyParser = require('body-parser');
const cookiesParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const webhook = require('./src/router/client/webhook');
const authRoute = require('./src/router/client/auth');
const products = require('./src/router/client/product');
const users = require('./src/router/admin/user');
const product_t = require('./src/router/admin/product');
const dashboard = require('./src/router/admin/dashboard');

app.use(cors());
app.use('/', webhook);

// Serve static files from public directory
app.use(express.static('public'))

app.use(bodyParser.json());
app.use(cookiesParser());


app.use(express.static('public'));

//  Admin routes
app.use('/api/admin/', product_t);
app.use('/api/admin/', users);
app.use('/api/admin/', dashboard);

//  Client routes
app.use('/api/auth/', authRoute);
app.use('/api/', products);

//  Start server
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
