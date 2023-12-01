const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/balance_sheet/:ticker', routes.balanceSheet);
app.get('/market_share/:ticker', routes.marketShare);
app.get('/user_worth/:user_id', routes.userWorth);
app.get('/news_recommendation/:user_id', routes.newsRecommendation);
app.get('/net_worth/:user_id', routes.netWorth);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
