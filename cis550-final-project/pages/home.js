import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from './navbar'
import styles from '../src/app/page.module.css'

export default function Home() {
    const [newsRecommendations, setNewsRecommendations] = useState([]);
    React.useEffect(() => {
        const fetchNewsRecommendations = async () => {
        };
        fetchNewsRecommendations();
      }, []);


    return (
            <div>
                <NavBar/>
            <h1>Welcome user!</h1>
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
}