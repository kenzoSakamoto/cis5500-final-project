import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from './navbar'


export default function Portfolio() {
  // State variables to hold data fetched from backend
  const [portfolioValue, setPortfolioValue] = useState([]);
  const [newsRecommendations, setNewsRecommendations] = useState([]);
  const [netWorthOverTime, setNetWorthOverTime] = useState([]);

  // Use useEffect to fetch data when the component mounts
  React.useEffect(() => {
    // Example: Fetch data for Route 12 (Portfolio Value)
    // Replace this with your actual fetch logic
    const fetchPortfolioValue = async () => {
      // Fetch data and update state
      // const data = await fetchPortfolioValueFromAPI();
      // setPortfolioValue(data);
    };

    // Example: Fetch data for Route 13 (News Recommendations)
    // Replace this with your actual fetch logic
    const fetchNewsRecommendations = async () => {
      // Fetch data and update state
      // const data = await fetchNewsRecommendationsFromAPI();
      // setNewsRecommendations(data);
    };

    // Example: Fetch data for Route 14 (Net Worth Over Time)
    // Replace this with your actual fetch logic
    const fetchNetWorthOverTime = async () => {
      // Fetch data and update state
      // const data = await fetchNetWorthOverTimeFromAPI();
      // setNetWorthOverTime(data);
    };

    // Call the fetch functions
    fetchPortfolioValue();
    fetchNewsRecommendations();
    fetchNetWorthOverTime();
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
            {/* Map over portfolioValue data and display */}
            {/* Replace this with the actual data */}
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
            {/* Map over netWorthOverTime data and display */}
            {/* Replace this with the actual data */}
            {netWorthOverTime.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.NetWorth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};