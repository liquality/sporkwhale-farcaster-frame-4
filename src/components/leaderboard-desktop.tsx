import { ClashData, ClashDataMap } from '@/types'
import Column from './column'
import { PurpleArrowLeft, PurpleArrowRight } from './icons'

export type LeaderboardProps = {
  leaderboard: ClashDataMap[]
}

export default function LeaderboardDesktop(props: LeaderboardProps) {
  const { leaderboard } = props

  const renderDay = (day: number, from: number, to: number, color: string) => {
    return (
      <>
        <div
          className="column-day justify-between-grid"
          style={{ position: 'relative', backgroundColor: color, margin: 10 }}
        >
          <p className="day-title">Day {day}</p>
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
          <div style={{ height: 300 }}></div>

          <div style={{ position: 'absolute', bottom: 0 }}>
            <img width="100%" src={`whale_day_${day}.svg`}></img>
          </div>
        </div>
      </>
    )
  }

  console.log(leaderboard, 'ledarbord')

  return (
    <div className="body-desktop">
      <div className="flex-direction-row">
        {' '}
        <PurpleArrowRight />{' '}
        <b style={{ marginLeft: 15, marginRight: 15 }}> WINNER </b>
        <PurpleArrowLeft />
      </div>

      <div className="flex-direction-row ">
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
    </div>
  )
}
