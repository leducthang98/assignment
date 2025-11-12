'use client';

import { useState } from 'react';

interface BlockData {
  blockNumber: number;
  transactionCount: number;
}

export default function Home() {
  const [blockNumber, setBlockNumber] = useState('');
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blockNumber) {
      setError('Please enter a block number');
      return;
    }

    setLoading(true);
    setError('');
    setBlockData(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/solana/block/transaction-count?blockNumber=${blockNumber}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch block data');
      }

      const data = await response.json();
      setBlockData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>Solana Block Explorer</h1>
        <p style={styles.subtitle}>Enter a block number to get the transaction count</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="number"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value)}
            placeholder="Enter block number (e.g., 200000000)"
            style={styles.input}
            min="0"
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Loading...' : 'Get Transaction Count'}
          </button>
        </form>

        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {blockData && (
          <div style={styles.result}>
            <h2 style={styles.resultTitle}>Block Information</h2>
            <div style={styles.resultItem}>
              <span style={styles.label}>Block Number:</span>
              <span style={styles.value}>{blockData.blockNumber.toLocaleString()}</span>
            </div>
            <div style={styles.resultItem}>
              <span style={styles.label}>Transaction Count:</span>
              <span style={styles.value}>{blockData.transactionCount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  container: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333',
  } as React.CSSProperties,
  subtitle: {
    color: '#666',
    marginBottom: '2rem',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
  } as React.CSSProperties,
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  } as React.CSSProperties,
  error: {
    padding: '1rem',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
    marginBottom: '1rem',
  } as React.CSSProperties,
  result: {
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '4px',
  } as React.CSSProperties,
  resultTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#333',
  } as React.CSSProperties,
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  } as React.CSSProperties,
  label: {
    fontWeight: '600',
    color: '#555',
  } as React.CSSProperties,
  value: {
    color: '#333',
  } as React.CSSProperties,
};
