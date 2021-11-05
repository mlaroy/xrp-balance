import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { RippleAPI } from 'ripple-lib';

const api = new RippleAPI({
  server: 'wss://xrplcluster.com' // Public cluster
});
api.connect();

export default function Home() {

  let [isFetching, setIsFetching] = useState(false);
  let [isError, setIsError] = useState(false);
  let [balances, setBalances] = useState([]);
  let [message, setMessage] = useState('');
  let [address, setAddress] = useState('');

  const getBalance = async (address) => {
    setIsFetching(true);
    try {
      const balances = api.getBalances(address)
      return balances;
    } catch(err) {
      // setMessage( err.message );
      setMessage( 'Sorry, it seems like there was an error. Are you sure this address is correct?' );
      setIsError(true);
      return err;
    } finally {
      setIsFetching(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const balances = await getBalance(address);
      console.log({balances});
      if( balances[0] && balances[0].currency == 'XRP') {
        setBalances(balances);
      }
    } catch(err) {

      console.error(err);
    }
  }

  const clearForm = (e) => {
    e.preventDefault();
    setMessage('');
    setBalances([]);
    setIsError(false);
    setIsFetching(false);
    setAddress('');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>XRP Balance Check</title>
        <meta name="description" content="Check your XRP balance using the XRPL API" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title}>
          <Image src="/xrp-xrp-logo.svg" alt="XRP Logo" width="100" height="100" />
          Check my XRP Balance
        </h1>

        <form className={styles.description} onSubmit={handleSubmit}>
          <label htmlFor="address">
            <span className={styles.formLabel}>Address</span>
            <input id="address" type="text" placeholder="123abc..." value={address} onChange={(e) => setAddress(e.target.value) } className={styles.formInput}/>
          </label>

          <button type="submit" className={styles.formSubmit}>Submit</button>
          <button
            type="button"
            className={styles.formClear}
            onClick={clearForm}>Clear</button>
        </form>

        {message && (
          <p className={styles.resultContainer}>
            <span className={styles.result}>
              {message}
            </span>
          </p>
        )}

        {isFetching && (
          <p>Loading...</p>
        )}

        {balances && (
          <p className={styles.resultContainer}>
            {balances.map( balance => {
              return (
                <span className={styles.result} key={balance.value}>{balance.currency} Balance: {balance.value}</span>
              )
            })}
          </p>
        )}

      </main>

      <footer className={styles.footer}>
        <div>
          <a
            href="https://mikelaroy.ca/">
            Made By: Michael LaRoy
          </a>
          <a href="https://twitter.com/laroymike">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1CA0F1" class="bi bi-twitter" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
            </svg>
            @laroymike
          </a>
        </div>
      </footer>
    </div>
  )
}
