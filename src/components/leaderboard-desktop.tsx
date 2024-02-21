import { ClashData, ClashDataMap } from '@/types'
import { useEffect, useState } from 'react'

import Column from './column'

export type LeaderboardProps = {
  leaderboard: ClashDataMap[]
}

export default function LeaderboardDesktop(props: LeaderboardProps) {
  const { leaderboard } = props
  console.log(leaderboard, 'leaderboard')

  let arr = [1, 2, 3, 4]
  console.log(arr.slice(2, 4), 'sliced arr')
  const renderDay = (day: number, from: number, to: number, color: string) => {
    return (
      <>
        <div
          className="column-day justify-between-grid"
          style={{ backgroundColor: color, margin: 10 }}
        >
          {leaderboard && leaderboard[day] && (
            <Column
              to={to}
              from={from}
              clashDataForDay={
                // @ts-ignore
                leaderboard[day] as any
              }
              day={day}
            />
          )}
        </div>
      </>
    )
  }

  console.log(leaderboard, 'ledarbord')

  return (
    <div className="flex-direction-row justify-between">
      {' '}
      {renderDay(1, 0, 8, '#FFE2E2')}
      {renderDay(2, 0, 4, '#FCFCCB')}
      {renderDay(3, 0, 2, '#D1FFD2')}
      {renderDay(4, 0, 1, '#CBE1FF')}
      {renderDay(5, 0, 1, '#B8B2FF')}
      {renderDay(4, 1, 2, '#CBE1FF')}
      {renderDay(3, 2, 4, '#D1FFD2')}
      {renderDay(2, 4, 8, '#FCFCCB')}
      {renderDay(1, 8, 16, '#FFE2E2')}
    </div>
  )
}
