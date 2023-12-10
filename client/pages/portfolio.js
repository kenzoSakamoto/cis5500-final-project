import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from './navbar'
import styles from '../src/app/page.module.css'
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const config = require('../src/app/config.json');

export default function Portfolio() {
  // State variables to hold data fetched from backend
  const data = "";
  const router = useRouter();
  const [portfolioValue, setPortfolioValue] = useState([]);
  const [netWorthOverTime, setNetWorthOverTime] = useState([]);
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [ownedETFs, setOwnedETFs] = useState([]);
  const [newsRecommendations, setNewsRecommendations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userData, setUserData] = useState({})
  const [worth, setWorth] = useState({})
  const [dates, setDates] = useState([])
  const [worthOverTime, setWorthOverTime] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      // Fetch portfolio data and update state
      // const portfolioData = await fetchPortfolioData(userData.id);
      // setPortfolioValue(portfolioData);

      // Fetch net worth over time data and update state
      // const netWorthData = await fetchNetWorthOverTime(userData.id);
      // setNetWorthOverTime(netWorthData);

      // Fetch owned stocks data and update state
      // const ownedStocksData = await fetchOwnedStocks(userData.id);
      // setOwnedStocks(ownedStocksData);

      // Fetch owned ETFs data and update state
      // const ownedETFsData = await fetchOwnedETFs(userData.id);
      // setOwnedETFs(ownedETFsData);

      // Fetch news recommendations data based on user ID and update state
      const worth = await axios.get(`http://${config.server_host}:${config.server_port}/user_worth/${userData.id}`);
      const newsData = await axios.get(`http://${config.server_host}:${config.server_port}/news_recommendation/${userData.id}?limit=20&industry_limit=5`);
      const netWorthResponse = await axios.get(`http://${config.server_host}:${config.server_port}/net_worth/${userData.id}`);
      
      console.log(netWorthResponse.data)
      setNewsRecommendations(newsData.data);
      setWorth(worth.data)
    
      // setNetWorthOverTime(netWorthResponse.data);
     console.log(dates);
    };

    if (Object.keys(userData).length > 0) {
      fetchData();
    }
  }, [userData]);

  
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

  const dataTable = {
    labels: dates,
    datasets: [
      {
        label: 'Net Worth Over Time',
        data: worthOverTime,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    const { data } = router.query;

    if (data) {
      const userData = JSON.parse(data);
      setUserData(userData)
      // Now 'userData' contains the JSON object passed from the login page
      // Use 'userData' to set your state variables or perform actions with the passed data
    }
  }, [router.query]);
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
              <TableCell><b>First Name</b></TableCell>
              <TableCell><b>Last Name</b></TableCell>
              <TableCell><b>Worth</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
                <TableCell>{userData.first_name}</TableCell>
                <TableCell>{userData.last_name}</TableCell>
                <TableCell>{worth.worth}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Net Worth Over Time</h2>
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
              <TableCell><b>Stock Symbol</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
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
      
      <h2>News Recommendations</h2>
       {/* Display news recommendations data */}
       <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Headline</TableCell>
              <TableCell>Ticker</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map over newsRecommendations data and display */}
            {/* Replace this with the actual data */}
            {newsRecommendations.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.Headline}</TableCell>
                <TableCell>{item.ticker}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};