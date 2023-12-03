const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');


const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/signin', routes.signin);
app.get('/topstock', routes.topstock);
app.get('/tradedstock', routes.tradedstock);
app.get('/volatilestock', routes.volatiestock);
