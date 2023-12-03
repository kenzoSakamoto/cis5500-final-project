const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly

app.get('/signin', routes.signin);
app.get('/topstock', routes.topstock);
app.get('/tradedstock', routes.tradedstock);
app.get('/volatilestock', routes.volatiestock);

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
      SELECT name, market_cap
      FROM StockInfo
      ORDER BY market_cap DESC
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
      SELECT name, market_cap
      FROM StockInfo
      ORDER BY market_cap DESC
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
    SELECT date, close
    FROM SecurityPrices
    WHERE ticker = '${req.params.ticker}'
    AND date >= '${req.query.start_date}'
    AND date <= '${req.query.end_date}'
    ORDER BY date ASC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
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
      res.json(data);
    }
  });
}

// Route 9: GET /profit_and_loss_statement/:ticker
const profit_and_loss_statement = async function(req, res) {
  connection.query(`
    SELECT
    year,
    quarter,
    SUM(CASE WHEN indicator = 'Final Revenue' THEN amount ELSE 0 END) AS Revenue,
    SUM(CASE WHEN indicator = 'Gross Profit' THEN amount ELSE 0 END) AS GrossProfit,
    SUM(CASE WHEN indicator = 'Operating Income (Loss)' THEN Amount ELSE 0 END) AS
    OperatingIncome,
    SUM(CASE WHEN indicator = 'Net Income (Loss)' THEN Amount ELSE 0 END) AS NetIncome
    FROM Stocks
    WHERE ticker = '${req.params.ticker}'
    AND year = '${req.query.year}'
    AND quarter = '${req.query.quarter}'
    GROUP BY year, quarter;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

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
  profit_and_loss_statement,
  stock_news,
  price_trend,
  correlation,
  most_valued_companies,
  balanceSheet,
  marketShare,
  userWorth,
  newsRecommendation,
  netWorth
}