import React, { useEffect, useState } from 'react'
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
      if( balances[0] && balances[0].currency !== 'XRP') {
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
          <img src="/xrp-xrp-logo.svg" alt="XRP Logo" />
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
            <p className={styles.result}>
              {message}
            </p>
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
        <a
          href="https://mikelaroy.ca/">
          Made By: Michael LaRoy
        </a>
      </footer>
    </div>
  )
}
