import { ClashData, ClashDataMap } from '@/types'
import { useMemo } from 'react'

import './leaderboard.css'

type ExpandedDayProps = {
  day: number
  clashDataForDay: ClashData[]
  to: number
  from: number
  dayFourIndex?: number
}

export default function Column(props: ExpandedDayProps) {
  const { clashDataForDay, day, from, to, dayFourIndex } = props

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

  const renderDayFourStyle = (channelName: string) => {
    console.log('RENDER DAY FORU chsnnel:', channelName)
    return (
      <div className="justify-between-grid">
        <div className="pair">
          <br></br>
          <br></br>
          <div className="channel-name-box">{channelName}</div>
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

  console.log(dayFourIndex, 'dayfourindex')
  const slicedClashData = useMemo(() => {
    return clashDataForDay.slice(from, to)
  }, [clashDataForDay, from, to])

  const determineWhatToRender = (
    channelName1: string,
    channelName2: string
  ) => {
    console.log('all days:', day)

    if (day === 1) {
      return renderDayOneStyle(channelName1, channelName2)
    } else if (day === 4 && dayFourIndex) {
      console.log('do i even come here', dayFourIndex, day)
      if (dayFourIndex === 2) {
        renderDayFourStyle(channelName2)
      } else {
        renderDayFourStyle(channelName1)
      }
    } else {
      return (
        <div className="">
          {renderOtherDaysStyle(channelName1, channelName2)}
        </div>
      )
    }
  }

  return (
    <div className="">
      {slicedClashData?.map((clash: ClashData, index: number) => (
        <>{determineWhatToRender(clash.channel_name_1, clash.channel_name_2)}</>
      ))}
    </div>
  )
}
