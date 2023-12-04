import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from './navbar'
import styles from '../src/app/page.module.css'


export default function Portfolio() {
  // State variables to hold data fetched from backend
  const [portfolioValue, setPortfolioValue] = useState([]);
  const [netWorthOverTime, setNetWorthOverTime] = useState([]);
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [ownedETFs, setOwnedETFs] = useState([]);


  React.useEffect(() => {

    const fetchPortfolioValue = async () => {
      // Fetch data and update state
      // const data = await fetchPortfolioValueFromAPI();
      // setPortfolioValue(data);
    };


    const fetchNetWorthOverTime = async () => {
      // Fetch data and update state
      // const data = await fetchNetWorthOverTimeFromAPI();
      // setNetWorthOverTime(data);
    };

    const fetchOwnedStocks = async () => {
        // Fetch data and update state
        // const data = await fetchOwnedStocksFromAPI();
        // setOwnedStocks(data);
    };
  

    const fetchOwnedETFs = async () => {
        // Fetch data and update state
        // const data = await fetchOwnedETFsFromAPI();
        // setOwnedETFs(data);
    };

    fetchPortfolioValue();
    fetchNetWorthOverTime();
    fetchOwnedStocks();
    fetchOwnedETFs();
  }, []);

  return (
    <div>
      <NavBar />
      <h1>Portfolio</h1>
      <h2>Portfolio Value</h2>
      {/* Display portfolio value data */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Worth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Replace */}
            {portfolioValue.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.first_name}</TableCell>
                <TableCell>{item.last_name}</TableCell>
                <TableCell>{item.worth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Net Worth Over Time</h2>
      {/* Display net worth over time data */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Net Worth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {netWorthOverTime.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.NetWorth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Owned Stocks</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stock Symbol</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ownedStocks.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.symbol}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Owned ETFs</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ETF Symbol</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map over ownedETFs data and display */}
            {/* Replace this with the actual data */}
            {ownedETFs.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.symbol}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};