import { ClashData, ClashDataMap } from '@/types'
import { useMemo } from 'react'

import './leaderboard.css'

type ExpandedDayProps = {
  day: number
  clashDataForDay: ClashData[]
  to: number
  from: number
}

export default function Column(props: ExpandedDayProps) {
  const { clashDataForDay, day, from, to } = props

  const renderDayOneStyle = (channelName1: string, channelName2: string) => {
    return (
      <div className="justify-between-grid">
        <div className="pair">
          <br></br>
          <br></br>
          <div className="channel-name-box">{channelName1}</div>
          <div className="channel-name-box">{channelName2}</div>
        </div>
      </div>
    )
  }

  const renderOtherDaysStyle = (channelName1: string, channelName2: string) => {
    return (
      <div className="">
        <div
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="channel-name-box"
        >
          {channelName1}
        </div>
        <div
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="channel-name-box"
        >
          {channelName2}
        </div>
      </div>
    )
  }

  const slicedClashData = useMemo(() => {
    return clashDataForDay.slice(from, to)
  }, [clashDataForDay, from, to])

  return (
    <div className="">
      {slicedClashData?.map((clash: ClashData, index: number) => (
        <>
          {day === 1 ? (
            renderDayOneStyle(clash.channel_name_1, clash.channel_name_2)
          ) : (
            <div className="">
              {renderOtherDaysStyle(clash.channel_name_1, clash.channel_name_2)}
            </div>
          )}
        </>
      ))}
    </div>
  )
}
