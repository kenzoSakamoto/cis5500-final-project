import React from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '../src/app/page.module.css'

const NavBar = () => {
  const router = useRouter();

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        router.push('/home');
        break;
      case 1:
        router.push('/portfolio');
        break;
      case 2:
        router.push('/stockoverview');
        break;
      default:
        break;
    }
  };

  return (
    <AppBar position="static">
      <Tabs onChange={handleChange}>
        <Tab label="Home" />
        <Tab label="My Portfolio" />
        <Tab label="Stock Overview"/>
      </Tabs>
    </AppBar>
  );
};

export default NavBar;