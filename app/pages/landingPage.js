// pages/index.js
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/LandingPage.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Safe Haven - Landing Page</title>
      </Head>

      <main>
        <Link href="/login">
          <button className={styles['login-button']}>Login</button>
        </Link>

        <Image 
          src="/images/safe haven crop.jpg"
          alt="Safe Haven Logo"
          height={100}
          width={100}
          priority
        />
        <h1 id="logo" className={styles.logo}>Safe Haven</h1>

        <div className={styles['half-background']}>
          <h1 id="Top-Text" className={styles['Top-Text']}>Safe Haven</h1>
          <h2 id="Middle-Text" className={styles['Middle-Text']}>
            Easily apply for shelters and find foodbanks around you
          </h2>
          <h3 id="Bottom-Text" className={styles['Bottom-Text']}>
            Create one application to apply to all shelters or use our interactive map to find local foodbanks
          </h3>
        </div>

        <div className={styles['Foodbank-Box']}>
          <Link href="/foodbanks">
            <button className={styles['Foodbank-Button']}>Find Foodbanks</button>
          </Link>
          <h3 id="Foodbank-Text" className={styles['Foodbank-Text']}>
            access and apply to a list of shelters that fit your needs
          </h3>
        </div>

        <div className={styles['Shelter-Box']}>
          <Link href="/shelters">
            <button className={styles['Shelter-Button']}>Find Shelters</button>
          </Link>
          <h3 id="Shelters-Text" className={styles['Shelters-Text']}>
            access our map with locations of foodbanks in your area
          </h3>
        </div>
      </main>
    </>
  )
}