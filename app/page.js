import { color } from "framer-motion";
import Link from 'next/link';

export default function Home() {
  const styles = {
    mainContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'white'
    },
    jumbotron: {
      padding: '4rem 2rem',
      marginBottom: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '1rem',
      width: '100%'
    },
    heading: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      lineHeight: '1.2'
    },
    description: {
      fontSize: '1.2rem',
      lineHeight: '1.5'
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      width: '100%',
      marginTop: '2rem'
    },
    darkCard: {
      padding: '2rem',
      borderRadius: '1rem',
      height: '100%',
      backgroundColor: '#212529',
      color: 'white'
    },
    lightCard: {
      padding: '2rem',
      borderRadius: '1rem',
      height: '100%',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6'
    },
    cardHeading: {
      fontSize: '1.75rem',
      marginBottom: '1rem'
    },
    cardText: {
      marginBottom: '1.5rem'
    },
    buttonLight: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      color: 'white',
      border: '2px solid white',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: 'white',
        color: '#212529'
      }
    },
    buttonDark: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      color: '#6c757d',
      border: '2px solid #6c757d',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#6c757d',
        color: 'white'
      }
    }
  };

  return (
    <main style={styles.mainContainer}>
      <div style={styles.jumbotron}>
        <div>
          <h1 style={styles.heading}>Welcome to Safe Haven</h1>
          <p style={styles.description}>
            Welcome to Safe Haven! We're here to help you find the support you need, whether it's a warm place to stay, a meal, or other essential resources. With just a few clicks, you can discover nearby shelters, food banks, and services that are ready to help. You're not alone—Safe Haven is here to guide you every step of the way. Let's get started and find the care and support you deserve!
          </p>
        </div>
      </div>

      <div style={styles.cardContainer}>
        <div style={styles.darkCard}>
          <h2 style={styles.cardHeading}>Shelters</h2>
          <p style={styles.cardText}>
            Looking for a safe place to stay? Use this tool to find nearby shelters offering a warm bed and support. Whether you need emergency housing or a temporary place to rest, we're here to help you find the right option quickly and easily. Your safe haven is just a few clicks away!
          </p>
          <button style={styles.buttonLight}>Find a Shelter</button>
        </div>

        <div style={styles.lightCard}>
          <h2 style={styles.cardHeading}>Foodbanks</h2>
          <p style={styles.cardText}>
            Need a meal or groceries to get through the day? Use this tool to locate food banks near you offering free meals, pantry items, and support. No matter your situation, there's a place ready to help. Let's find the nourishment and care you deserve!
          </p>
          <Link href="/find-a-meal">
            <button style={styles.buttonDark}>Get a Meal</button>
          </Link>
        </div>
      </div>
    </main>
  );
}