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

// Route 10: GET /market_share/:ticker
const balanceSheet = async function(req, res) {

  connection.query(`
  SELECT
    Year,
    Quarter,
    SUM(CASE WHEN Indicator = 'Assets' THEN Amount ELSE 0 END) AS TotalAssets,
    SUM(CASE WHEN Indicator = 'Cash and Cash Equivalents, at Carrying Value' THEN Amount ELSE 0 END) AS CashAndCashEquivalents,
    SUM(CASE WHEN Indicator = 'Total Liabilities and Equity' THEN Amount ELSE 0 END) AS TotalLiabilitiesAndEquity,
    SUM(CASE WHEN Indicator = 'Total Equity' THEN Amount ELSE 0 END) AS TotalEquity
  FROM Stocks
  WHERE Ticker = '${req.params.ticker}'
  GROUP BY Year, Quarter;
  `,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 11: GET /market_share/:ticker
const marketShare = async function(req, res) {

  connection.query(`
  WITH IndustryRevenue AS (
      SELECT s.Industry, SUM(sf.Amount) AS TotalIndustryRevenue
      FROM Stocks sf
      JOIN StockInfo s ON sf.Ticker = s.Ticker
      WHERE sf.Indicator = 'Final Revenue'
      GROUP BY s.Industry
  ),
  CompanyRevenue AS (
      SELECT s.Industry, sf.Ticker, SUM(sf.Amount) AS CompanyRevenue
      FROM Stocks sf
      JOIN StockInfo s ON sf.Ticker = s.Ticker
      WHERE sf.Indicator = 'Final Revenue'
      GROUP BY s.Industry, sf.Ticker
  )
  SELECT
      ir.Industry,
      cr.Ticker,
      (cr.CompanyRevenue / ir.TotalIndustryRevenue) * 100 AS MarketSharePercentage
  FROM CompanyRevenue cr
  JOIN IndustryRevenue ir ON cr.Industry = ir.Industry
  WHERE cr.Ticker = '${req.params.ticker}'
  `,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 12: GET /user_worth/:user_id
const userWorth = async function(req, res) {
  connection.query(`
  WITH CurrentlyOwned AS (
    SELECT UserID, Ticker, SUM(IF(Type = 'BUY', Quantity, -Quantity)) AS NetQuantity
    FROM Transactions
    WHERE UserID = ${req.params.user_id}
    GROUP BY UserID, Ticker
    HAVING NetQuantity > 0
  )
  SELECT u.first_name, u.last_name, SUM(co.NetQuantity * sp.Close) AS worth
  FROM Users AS u
  JOIN CurrentlyOwned co ON u.id = co.UserID
  JOIN (
    SELECT Ticker, MAX(Date) AS MaxDate
    FROM SecurityPrices
    GROUP BY Ticker
  ) max_date ON co.Ticker = max_date.Ticker
  JOIN SecurityPrices sp ON co.Ticker = sp.Ticker AND max_date.MaxDate = sp.Date
  GROUP BY u.first_name, u.id, u.last_name;
  `,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 13: GET /news_recommendation/:ticker
const newsRecommendation = async function(req, res) {
  const industry_limit = req.query.industry_limit ? req.query.industry_limit : 5;
  const limit = req.query.limit ? req.query.limit : 20;

  connection.query(`
  WITH TopIndustries AS (
      SELECT Industry
      FROM Transactions
      JOIN StockInfo ON Transactions.Ticker = StockInfo.ticker
      WHERE UserID = '${req.params.user_id}'
      GROUP BY Industry
      ORDER BY SUM(ABS(Quantity)) DESC
      LIMIT ${industry_limit}
  ),
  Positive AS (
      SELECT Industry
      From Transactions
      JOIN StockInfo ON Transactions.Ticker = StockInfo.ticker
      WHERE UserID = '${req.params.user_id}' AND Quantity > 0
      GROUP BY Industry
      ORDER BY SUM(Quantity) DESC
      LIMIT ${industry_limit}
  )
  SELECT DISTINCT date, Headline, FinancialNews.ticker
  FROM FinancialNews
  JOIN Stocks ON FinancialNews.Ticker = Stocks.ticker
  WHERE FinancialNews.Ticker IN (
      SELECT StockInfo.ticker
      FROM StockInfo
      JOIN Transactions ON Transactions.Ticker = StockInfo.ticker
      WHERE Industry IN (
          SELECT industry
          FROM TopIndustries
      )
  ) OR FinancialNews.ticker IN (
    SELECT StockInfo.ticker
      FROM StockInfo
      JOIN Transactions ON StockInfo.ticker = Transactions.Ticker
      WHERE Industry IN (
          SELECT industry
          FROM Positive
      )
  )
  ORDER BY date DESC
  LIMIT ${limit};
  `,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 14: GET /net_worth/:user_id
const netWorth = async function(req, res) {
  connection.query(`
  WITH
  # View for negative quantities when selling / positive when buying
  NegativeQuantities AS (
    SELECT
        Transactions.Date,
        Transactions.Ticker,
        (
            IF(Type = 'BUY', Quantity, -1 * Quantity)
        ) AS Quantity
    FROM Transactions
    WHERE UserID = '${req.params.user_id}'
    ORDER BY Transactions.Date
  ),
  # View with all dates and prices but only marginal quantities for each ticker
  # and the closing price for each
  MarginalQuantities AS (
    SELECT
        SecurityPrices.date,
        SecurityPrices.ticker,
        close,
        IF(
            EXISTS(
                SELECT *
                FROM NegativeQuantities
                WHERE SecurityPrices.Date = NegativeQuantities.Date
                  AND SecurityPrices.ticker = NegativeQuantities.Ticker
            ),
            Quantity,
            0
        ) AS IncrQ
    FROM SecurityPrices
    LEFT JOIN NegativeQuantities
        ON NegativeQuantities.Ticker = SecurityPrices.ticker AND
            NegativeQuantities.Date = SecurityPrices.date
    WHERE
        SecurityPrices.date >= (
            SELECT MIN(Date)
            FROM NegativeQuantities
        ) AND
        EXISTS(
            SELECT *
            FROM NegativeQuantities
            WHERE SecurityPrices.ticker = NegativeQuantities.Ticker
        )
    ORDER BY date, SecurityPrices.ticker
  ),
  # For each day, how much of each ticker does the person have (daily portfolio)
  AggregateQuantities AS (
    SELECT
        date,
        ticker,
        close,
        SUM(IncrQ) OVER (
            PARTITION BY ticker
            ORDER BY MarginalQuantities.Date
            ROWS BETWEEN
            UNBOUNDED PRECEDING AND
            CURRENT ROW
        ) AS AggQuantity
    FROM MarginalQuantities
    ORDER BY ticker, date
  )
  SELECT
    date,
    SUM(close * AggQuantity) AS NetWorth
  FROM AggregateQuantities
  GROUP BY date
  ORDER BY date
  `,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  balanceSheet,
  marketShare,
  userWorth,
  newsRecommendation,
  netWorth
}