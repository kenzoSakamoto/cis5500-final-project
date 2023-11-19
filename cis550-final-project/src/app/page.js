'use client'
import Image from 'next/image'
import styles from './page.module.css'
import React from 'react';
import { TextField, Button, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()

  const handleLogin = (e) => {
    // Login Logic
  };

  const handleCreateAccount = () => {
    // Redirect to the Create Account page
    router.push('/createaccount');
  };

  return (
    <main className={styles.main}>
      <div>
        <h1>Welcome</h1>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            // ... (other input props)
          />
          <br />
          <TextField
            label="Password"
            type="password"
            // ... (other input props)
          />
          <br />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
          <Button onClick={handleCreateAccount} variant="contained" color="secondary">
            Create Account
          </Button>
        </form>
        <div>
          <Link href="#" underline="always">
            Forgot Password
          </Link>
        </div>
      </div>
    </main>
  )
}
