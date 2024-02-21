import { ClashData, ClashDataMap } from '@/types'
import { useEffect, useState } from 'react'
import ExpandedDay from './expanded-day'
import ChevronDown from './icons'
import './leaderboard.css'

export default function LeaderboardMobile() {
  const [leaderboard, setLeaderboard] = useState<null | ClashDataMap[]>(null)
  const [loading, setLoading] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  useEffect(() => {
    if (!leaderboard) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/getLeaderboardData')
          const data = await response.json()
          console.log({ data })
          setLeaderboard(data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [leaderboard])

  const renderDay = (day: number, title: string, color: string) => {
    return (
      <>
        <div
          onClick={() => setExpandedDay(day === expandedDay ? 0 : day)}
          className="mobile-row-title"
          style={{ backgroundColor: color }}
        >
          {title} <ChevronDown />
        </div>
        {expandedDay === day && leaderboard && (
          <ExpandedDay clashDataForDay={leaderboard[day] as any} day={day} />
        )}
      </>
    )
  }

  return (
    <div className="mobile-container">
      <h3>Competing Channels</h3>
      {leaderboard && (
        <>
          {renderDay(1, 'Day 1: February 28th', '#FFE2E2')}
          {renderDay(2, 'Day 2: February 29th', '#FCFCCB')}
          {renderDay(3, 'Day 3: March 1st', '#D1FFD2')}
          {renderDay(4, 'Day 4: March 2nd', '#B8B2FF')}
        </>
      )}
      <div className="winner-box">
        <br></br>SporkWhale Mania Winner: <br></br>NOT ANNOUNCED YET
      </div>
    </div>
  )
}
