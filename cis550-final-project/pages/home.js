import React from 'react';
import { TextField, Button } from '@mui/material';
import styles from '../src/app/page.module.css'
import NavBar from './navbar'

export default function Home() {

    return (
        <main className={styles.main}>
            <div>
                <NavBar/>
            <h1>Welcome user!</h1>
            </div>
        </main>
        );
}