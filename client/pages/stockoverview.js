import React, { useState } from 'react';
import { Tabs, Tab, TextField, Button, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import NavBar from './navbar'
import styles from '../src/app/page.module.css'

export default function StockAnalysis() {
    const [tabIndex, setTabIndex] = useState(0); // State to manage active tab index

    // State variables for input fields
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ticker, setTicker] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [specificTicker, setSpecificTicker] = useState('');
    const [specificYear, setSpecificYear] = useState('');
    const [specificQuarter, setSpecificQuarter] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0); // State to manage selected index


    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleTimeframeAnalysisSearch = () => {
        // Perform search based on timeframe analysis inputs (startDate, endDate, ticker)
        // Fetch data using these parameters
    };

    const handleRealtimeStatsSearch = () => {
        // Perform search based on realtime stats inputs (page, pageSize)
        // Fetch data using these parameters
    };

    const handleSpecificStockSearch = () => {
        // Perform search based on specific stock inputs (specificTicker, specificYear, specificQuarter)
        // Fetch data using these parameters
    };

    const renderTabContent = (index) => {
        switch (index) {
            case 0: // Timeframe Analysis Tab
                return (
                    <Box>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mr: 1 }} // Add margin to the input field
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ mr: 1 }} // Add margin to the input field
                    />
                    <TextField
                      label="Option"
                      select
                      value={tabIndex === 0 ? selectedIndex : ''}
                      onChange={(e) => setSelectedIndex(e.target.value)}
                      sx={{ mr: 1 }}
                    >
                      <MenuItem value={0}>Top Stocks</MenuItem>
                      <MenuItem value={1}>Traded Stocks</MenuItem>
                      <MenuItem value={2}>Volatile Stocks</MenuItem>
                      <MenuItem value={3}>Price Trend</MenuItem>
                    </TextField>
                    {selectedIndex === 3 && ( // Show Ticker box if Price Trend is selected
                      <TextField
                        label="Ticker"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                      />
                    )}
                    <Button variant="contained" onClick={handleTimeframeAnalysisSearch}>
                      Search
                    </Button>
                    {/* Table to display results */}
                  </Box>
                );
            case 1: // Realtime Stats Tab
                return (
                    <Box>
                        <TextField
                            label="Page"
                            type="number"
                            value={page}
                            onChange={(e) => setPage(e.target.value)}
                            sx={{ mr: 1 }}
                        />
                        <TextField
                            label="Page Size"
                            type="number"
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                            sx={{ mr: 1 }}
                        />
                        <TextField
                            label="Option"
                            select
                            value={tabIndex === 1 ? selectedIndex : ''}
                            onChange={(e) => setSelectedIndex(e.target.value)}
                            sx={{ mr: 1 }}
                        >
                            <MenuItem value={0}>Most Valued Companies</MenuItem>
                            <MenuItem value={1}>Correlation</MenuItem>
                        </TextField>
                        <Button variant="contained" onClick={handleRealtimeStatsSearch} sx={{ mt: 1 }}>
                            Search
                        </Button>
                        {/* Table to display results */}
                    </Box>
                );
                case 2: // Specific Stock Tab
                return (
                    <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                        label="Ticker"
                        value={specificTicker}
                        onChange={(e) => setSpecificTicker(e.target.value)}
                        sx={{ mr: 1 }}
                        />
                        {selectedIndex !== undefined && selectedIndex === 4 && (
                        <>
                            <TextField
                            label="Year"
                            value={specificYear}
                            onChange={(e) => setSpecificYear(e.target.value)}
                            sx={{ mr: 1 }}
                            />
                            <TextField
                            select
                            label="Quarter"
                            value={specificQuarter}
                            onChange={(e) => setSpecificQuarter(e.target.value)}
                            sx={{ mr: 1 }}
                            >
                            <MenuItem value="q1">Q1</MenuItem>
                            <MenuItem value="q2">Q2</MenuItem>
                            <MenuItem value="q3">Q3</MenuItem>
                            <MenuItem value="q4">Q4</MenuItem>
                            </TextField>
                        </>
                        )}
                        <TextField
                        label="Option"
                        select
                        value={tabIndex === 2 ? selectedIndex : ''}
                        onChange={(e) => setSelectedIndex(e.target.value)}
                        sx={{ mr: 1 }}
                        >
                        <MenuItem value={0}>Balance Sheet</MenuItem>
                        <MenuItem value={1}>Stock News</MenuItem>
                        <MenuItem value={2}>Price Trend</MenuItem>
                        <MenuItem value={3}>Market Share</MenuItem>
                        <MenuItem value={4}>Profit and Loss Statement</MenuItem>
                        </TextField>
                    </Box>
                    <Button variant="contained" onClick={handleSpecificStockSearch} sx={{ mt: 1 }}>
                        Search
                    </Button>
                    {/* Table to display results */}
                    </Box>
                );
            default:
                return null;
        }
    };

    const renderResultsTable = () => {
        // Function to render table based on fetched data results
        // Use fetched data to populate table rows
    };

    return (
        <div>
            <NavBar />
            <Box>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Timeframe Analysis" />
                    <Tab label="Realtime Stats" />
                    <Tab label="Specific Stock" />
                </Tabs>
                <Typography variant="h5" mb={2}>
                    {tabIndex === 0 && 'Timeframe Analysis Content'}
                    {tabIndex === 1 && 'Realtime Stats Content'}
                    {tabIndex === 2 && 'Specific Stock Content'}
                </Typography>
                {renderTabContent(tabIndex)}
                {/* Table to display search results */}
                <TableContainer>
                    <Table>
                        {/* Table header */}
                        <TableHead>
                            <TableRow>
                                {/* Define table headers */}
                                {/* Example: <TableCell>Column Header</TableCell> */}
                            </TableRow>
                        </TableHead>
                        {/* Table body */}
                        <TableBody>
                            {/* Render table rows based on fetched data */}
                            {renderResultsTable()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}