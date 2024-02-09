import { CSSProperties } from 'react'
import data from './leaderboard.json'

export default function Leaderboard({}) {
  const tdStyle: CSSProperties = {
    fontSize: '1.4rem',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '0px 5px 15px 8px #e4e7fb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.5rem',
        padding: '2rem',
        fontSize: 26,
        fontWeight: 600,
      }}
    >
      {[...data].map((row, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '1rem',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              textAlign: 'left',
            }}
          >
            {row.rank}
          </div>
          <div
            style={{ display: 'flex', textAlign: 'left', fontSize: '1.2rem' }}
          >
            {row.address}
          </div>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '1.3rem',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {row.earned} ETH
          </div>
        </div>
      ))}
    </div>
  )
}
