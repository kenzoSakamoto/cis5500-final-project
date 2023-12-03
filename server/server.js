const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');


const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

const app = express();
app.use(cors({
  origin: '*',
}));

const signin = async function(req, res) {
  const username = req.query.username;
  const password = req.query.username;

  connection.query(`
    SELECT ID, FirstName, LastName, Balance
    FROM User
    WHERE Email = ${username} AND Password = ${password}`,
    (err, data) => {
        if (err || data.length == 0) {
          console.log("error");
        } else {
          console.log("redirect");
          res.json({
            username: data[0].email,
            password: data[0].password
          });
        }
    }
  );
}

const topstock = async function(req, res) {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  const etf = req.query.etf ?? 'Yes'
  connection.query(`
    WITH StartPrices AS (
      SELECT sp.Ticker, sp.Close AS StartClose
      FROM SecurityPrices sp
      JOIN Securities s ON sp.Ticker = s.Ticker
      WHERE s.ETF = ${etf} AND sp.Date = ${start_date}
    ),
    EndPrices AS (
    SELECT sp.Ticker, sp.Close AS EndClose
    FROM SecurityPrices sp
    JOIN Securities s ON sp.Ticker = s.Ticker
    WHERE s.ETF = ${etf} AND sp.Date = ${end_date}
    )
    SELECT st.Ticker, st.Name, ((ep.EndClose - sp.StartClose) / sp.StartClose) * 100 AS Appreciation
    FROM StartPrices sp
    JOIN EndPrices ep ON sp.Ticker = ep.Ticker
    JOIN Stocks st ON sp.Ticker = st.Ticker
    ORDER BY Appreciation DESC
    LIMIT 25
`,
    (err, data) => {
        if (err || data.length == 0) {
          console.log("error");
        } else {
          res.json({data})
        }
    }
  );
}

const tradedstock = async function(req, res) {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  const etf = req.query.etf ?? 'Yes'
  connection.query(`
  SELECT sp.Ticker, s.Name, SUM(sp.Volume) AS TotalVolume
  FROM SecurityPrices sp
  JOIN Securities s ON sp.Ticker = s.Ticker
  WHERE date BETWEEN ${start_date} AND ${end_date}
  GROUP BY sp.Ticker, s.Name and s.ETF = ${etf}
  ORDER BY TotalVolume DESC
  LIMIT 10;
  `, (err, data) => {
    if (err || data.length == 0) {
      console.log("error");
    } else {
      res.json(data)
    }
  });

}

const volatilestock = async function(req, req) {
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  const etf = req.query.etf ?? 'Yes'
  connection.query(`
  WITH DailyVolatility AS (
    SELECT sp.Ticker,DATE(sp.Date) AS Date,(sp.High - sp.Low) AS DailyRange
    FROM SecurityPrices sp
    WHERE sp.Date BETWEEN ${start_date} AND ${end_date}
  )
  SELECT dv.Ticker,s.Name,STDDEV(dv.DailyRange) AS Volatility
  FROM DailyVolatility dv
  JOIN Securities s ON dv.Ticker = s.Ticker
  WHERE s.ETF = ${etf}
  GROUP BY dv.Ticker, s.Name
  ORDER BY Volatility DESC
  LIMIT 25
  `, (err, data) => {
    if (err || data.length == 0) {
      console.log("error");
    } else {
      res.json(data)
    }
  });
}


app.get('/most_valued_companies', routes.most_valued_companies);
app.get('/correlation', routes.correlation);
app.get('/price_trend/:ticker', routes.price_trend);
app.get('/stock_news/:ticker', routes.stock_news);
app.get('/profit_and_loss_statement/:ticker', routes.profit_and_loss_statement);
app.get('/balance_sheet/:ticker', routes.balanceSheet);
app.get('/market_share/:ticker', routes.marketShare);
app.get('/user_worth/:user_id', routes.userWorth);
app.get('/news_recommendation/:user_id', routes.newsRecommendation);
app.get('/net_worth/:user_id', routes.netWorth);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
