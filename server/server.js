const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/most_valued_companies', routes.most_valued_companies);
app.get('/correlation', routes.correlation);
app.get('/price_trend/:ticker', routes.price_trend);
app.get('/stock_news/:ticker', routes.stock_news);
app.get('/profit_and_loss_statement/:ticker', routes.profit_and_loss_statement);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
