import { ClashData, ClashDataMap, ResponsesData } from '@/types'
import { useMemo } from 'react'

import './leaderboard.css'
import Percentage from './percentage'

type ExpandedDayProps = {
  day: number
  clashDataForDay: ClashData[]
  to: number
  from: number
  dayFourIndex?: number
}

export default function Column(props: ExpandedDayProps) {
  const { clashDataForDay, day, from, to, dayFourIndex } = props

  const renderDayOneStyle = (
    channelName1: string,
    channelName2: string,
    percentage1?: number,
    percentage2?: number
  ) => {
    return (
      <div className="justify-between-grid">
        <div className="pair">
          <br></br>
          <br></br>
          <div className="channel-name-box">
            {channelName1} <Percentage percentage={percentage1}/>
          </div>
          <div className="channel-name-box">
            {channelName2} <Percentage percentage={percentage2}/>
          </div>
        </div>
      </div>
    )
  }

  const renderDayFourStyle = (channelName: string, percentage?: number) => {
    console.log('RENDER DAY FORU chsnnel:', channelName)
    return (
      <div className="justify-between-grid">
        <div className="pair">
          <br></br>
          <br></br>
          <div className="channel-name-box">
            {channelName} <Percentage percentage={percentage}/>
          </div>
        </div>
      </div>
    )
  }

  const renderOtherDaysStyle = (
    channelName1: string,
    channelName2: string,
    percentage1?: number,
    percentage2?: number
  ) => {
    return (
      <div className="">
        <div
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="channel-name-box"
        >
          {channelName1} <Percentage percentage={percentage1}/>
        </div>
        <div
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="channel-name-box"
        >
          {channelName2} <Percentage percentage={percentage2}/>
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
    channelName2: string,
    percentage1?: number,
    percentage2?: number
  ) => {
    console.log('all days:', day)

    if (day === 1) {
      return renderDayOneStyle(
        channelName1,
        channelName2,
        percentage1,
        percentage2
      )
    } else if (day === 4 && dayFourIndex) {
      console.log('do i even come here', dayFourIndex, day)
      if (dayFourIndex === 2) {
        renderDayFourStyle(channelName2, percentage2)
      } else {
        renderDayFourStyle(channelName1, percentage1)
      }
    } else {
      return (
        <div className="">
          {renderOtherDaysStyle(
            channelName1,
            channelName2,
            percentage1,
            percentage2
          )}
        </div>
      )
    }
  }

  return (
    <div className="">
      {slicedClashData?.map((clash: ClashData, index: number) => (
        <>
          {determineWhatToRender(
            clash.channel_name_1,
            clash.channel_name_2,
            clash.responses[clash.channel1_id]?.correct_percentage,
            clash.responses[clash.channel2_id]?.correct_percentage
          )}
        </>
      ))}
    </div>
  )
}
