import { ClashData, ClashDataMap } from '@/types'
import { useEffect, useState } from 'react'
import ExpandedDay from './expanded-day'
import './leaderboard.css'

import { ChevronDown } from './icons'

export type LeaderboardProps = {
  leaderboard: ClashDataMap[]
}

export default function LeaderboardMobile(props: LeaderboardProps) {
  const { leaderboard } = props
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

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
    <div suppressHydrationWarning={true}>
      {' '}
      <div className="mobile-container">
        <h3>Competing Channels</h3>

        {leaderboard && (
          <>
            {renderDay(1, 'Day 1: February 28th', '#FFE2E2')}
            {renderDay(2, 'Day 2: February 29th', '#FCFCCB')}
            {renderDay(3, 'Day 3: March 1st', '#D1FFD2')}
            {renderDay(4, 'Day 4: March 2nd', '#CBE1FF')}
          </>
        )}
        <div className="winner-box">
          <br></br>SporkWhale Mania Winner: <br></br>NOT ANNOUNCED YET
        </div>
      </div>
    </div>
  )
}
