import React, { useState, useEffect } from 'react';
import { AppBar, Button, Tabs, Tab, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from './navbar'
import styles from '../src/app/page.module.css'
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const [showGraphPopup, setShowGraphPopup] = useState(false);

  // Function to open graph popup
  const openGraphPopup = () => {
    setShowGraphPopup(true);
  };

  // Function to close graph popup
  const closeGraphPopup = () => {
    setShowGraphPopup(false);
  };

  useEffect(() => {
    const fetchWorth = async () => {
      // Fetch news recommendations data based on user ID and update state
      const worth = await axios.get(`http://${config.server_host}:${config.server_port}/user_worth/${userData.id}`);
      setWorth(worth.data)
    };

    const fetchNews = async () => {
      const newsData = await axios.get(`http://${config.server_host}:${config.server_port}/news_recommendation/${userData.id}?limit=20&industry_limit=5`);
      setNewsRecommendations(newsData.data);
    };
    const fetchNetWorth = async () => {
      const netWorthResponse = await axios.get(`http://${config.server_host}:${config.server_port}/net_worth/${userData.id}`);
      setNetWorthOverTime(netWorthResponse.data);
    };

    if (Object.keys(userData).length > 0) {
      fetchWorth();
      fetchNews();
      fetchNetWorth();
    }
  }, [userData]);


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
              <TableCell><b>Balance</b></TableCell>
              <TableCell><b>Worth</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{userData.first_name}</TableCell>
              <TableCell>{userData.last_name}</TableCell>
              <TableCell>{userData.balance}</TableCell>
              <TableCell>{worth.worth ? worth.worth : 'Loading...'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Net Worth Over Time</h2>
      {/* Button to open the popup */}
      <Button variant="contained" onClick={openGraphPopup}>View Graph</Button>

      {/* Popup */}
      {showGraphPopup && (
        <div className="popup">
          {/* Graph for Net Worth Over Time */}
          {!netWorthOverTime || netWorthOverTime == [] ? (
            <p>Loading...</p>
          ) : (
            // Graph for Net Worth Over Time
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={netWorthOverTime} // Use your net worth data here
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="NetWorth" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
          {/* Close button for the popup */}
          <Button onClick={closeGraphPopup}>Close</Button>
        </div>
      )}

      <h2>News Recommendations</h2>
      {/* Display news recommendations data */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Headline</b></TableCell>
              <TableCell><b>Ticker</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map over newsRecommendations data and display */}
            {/* Replace this with the actual data */}
            {newsRecommendations.length > 0 ? (
              newsRecommendations.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.Headline}</TableCell>
                  <TableCell>{item.ticker}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};