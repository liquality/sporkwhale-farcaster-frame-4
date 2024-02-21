import { ClashData, ClashDataMap, TLeaderboard } from '@/types'
import { IMAGES } from '@/utils/image-paths'
import { useEffect, useState } from 'react'
import ChevronDown from './icons'
import './leaderboard.css'

type ExpandedDayProps = {
  day: number
  clashDataForDay: ClashData[]
}

export default function ExpandedDay(props: ExpandedDayProps) {
  const { clashDataForDay } = props
  const [leaderboard, setLeaderboard] = useState<null | TLeaderboard[]>(null)

  return (
    <div className="expanded-day">
      <div className="vs-title">VS</div>

      {clashDataForDay.map((clash: ClashData, index: number) => (
        <>
          <div className="flex-direction-row justify-between " key={index}>
            <div className="" style={{ width: '30%', margin: 3 }}>
              {clash.channel_name_1}
            </div>
            <div style={{ width: '30%', margin: 3 }}>
              {clash.channel_name_2}
            </div>
          </div>
          {/*    <div
            style={{ width: '100%', height: 1, backgroundColor: 'black' }}
          ></div> */}
        </>
      ))}
    </div>
  )
}
