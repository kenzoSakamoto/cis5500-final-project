const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));



// Route 5: GET /most_valued_companies
const most_valued_companies = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(`
      SELECT Name, MarketCap
      FROM Stocks
      ORDER BY MarketCap DESC   
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = pageSize * (page-1);

    connection.query(`
      SELECT Name, MarketCap
      FROM Stocks
      ORDER BY MarketCap DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 6: GET /correlation
const correlation = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(`
    WITH StockReturns AS (
      SELECT
      SP1.Ticker AS Ticker1,
      SP2.Ticker AS Ticker2,
      CORR(SP1.Close, SP2.Close) AS CorrelationCoefficient
      FROM
      SecurityPrices SP1
      INNER JOIN SecurityPrices SP2 ON SP1.Ticker < SP2.Ticker
      WHERE
      SP1.Ticker <> SP2.Ticker
      GROUP BY
      SP1.Ticker, SP2.Ticker
    )
    SELECT
      S1.Name AS Stock1_Name,
      S2.Name AS Stock2_Name,
      SR.CorrelationCoefficient
    FROM
    StockReturns SR
    INNER JOIN Securities S1 ON SR.Ticker1 = S1.Ticker
    INNER JOIN Securities S2 ON SR.Ticker2 = S2.Ticker
    ORDER BY
    SR.CorrelationCoefficient DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    const offset = pageSize * (page-1);

    connection.query(`
    WITH StockReturns AS (
      SELECT
      SP1.Ticker AS Ticker1,
      SP2.Ticker AS Ticker2,
      CORR(SP1.Close, SP2.Close) AS CorrelationCoefficient
      FROM
      SecurityPrices SP1
      INNER JOIN SecurityPrices SP2 ON SP1.Ticker < SP2.Ticker
      WHERE
      SP1.Ticker <> SP2.Ticker
      GROUP BY
      SP1.Ticker, SP2.Ticker
    )
    SELECT
      S1.Name AS Stock1_Name,
      S2.Name AS Stock2_Name,
      SR.CorrelationCoefficient
    FROM
    StockReturns SR
    INNER JOIN Securities S1 ON SR.Ticker1 = S1.Ticker
    INNER JOIN Securities S2 ON SR.Ticker2 = S2.Ticker
    ORDER BY
    SR.CorrelationCoefficient DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}


// Route 7: GET /price_trend/:ticker
const price_trend = async function(req, res) {
  connection.query(`
    SELECT Date, Close
    FROM SecurityPrices
    WHERE Ticker = '${req.params.ticker}'
    AND Date >= '${req.query.start_date}'
    AND Date <= '${req.query.end_date}'
    ORDER BY Date ASC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 8: GET /stock_news/:ticker
const stock_news = async function(req, res) {
  connection.query(`
    SELECT Headline, Date
    FROM FinancialNews
    WHERE Ticker = '${req.params.ticker}'
    ORDER BY Date DESC 
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 9: GET /price_trend/:ticker
const profit_and_loss_statement = async function(req, res) {
  connection.query(`
    SELECT
    Year,
    Quarter,
    SUM(CASE WHEN Indicator = 'Final Revenue' THEN Amount ELSE 0 END) AS Revenue,
    SUM(CASE WHEN Indicator = 'Gross Profit' THEN Amount ELSE 0 END) AS GrossProfit,
    SUM(CASE WHEN Indicator = 'Operating Income (Loss)' THEN Amount ELSE 0 END) AS
    OperatingIncome,
    SUM(CASE WHEN Indicator = 'Net Income (Loss)' THEN Amount ELSE 0 END) AS NetIncome
    FROM StockFinancials
    WHERE Ticker = '${req.params.ticker}'
    AND Year = '${req.query.Year}'
    AND Quarter = '${req.query.Quarter}'
    GROUP BY Year, Quarter;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}