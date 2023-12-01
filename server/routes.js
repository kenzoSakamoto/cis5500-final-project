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

// Route 13: GET /news_recommendation/:user_id
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
  newsRecommendation,
  netWorth
}