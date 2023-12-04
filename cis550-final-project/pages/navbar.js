import React from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/router';

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
      default:
        break;
    }
  };

  return (
    <AppBar position="static">
      <Tabs onChange={handleChange}>
        <Tab label="Home" />
        <Tab label="My Portfolio" />
      </Tabs>
    </AppBar>
  );
};

export default NavBar;