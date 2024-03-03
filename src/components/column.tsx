import { ClashData, ClashDataMap, ResponseItem, ResponsesData } from '@/types'
import { useMemo } from 'react'

import './leaderboard.css'
import Percentage from './percentage'

type ExpandedDayProps = {
  day: number
  clashDataForDay: ClashData[]
  to: number
  from: number
  dayFourIndex?: number
  currentDay: number
}

export default function Column(props: ExpandedDayProps) {
  const { clashDataForDay, day, from, to, dayFourIndex, currentDay } = props

  const showAmount = currentDay === day
  console.log( {day, currentDay})
  const renderDayOneStyle = (
    channelName1: string,
    channelName2: string,
    response1?: ResponseItem,
    response2?: ResponseItem
  ) => {
    return (
      <div className="justify-between-grid">
        <div className="pair">
          <br></br>
          <br></br>
          <div className="channel-name-box">
            {channelName1}{' '}
            {showAmount ? (
              <Percentage
                total={response1?.total}
                correct={response1?.correct}
              />
            ) : null}
          </div>
          <div className="channel-name-box">
            {channelName2}{' '}
            {showAmount ? (
              <Percentage
                total={response2?.total}
                correct={response2?.correct}
              />
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  const renderDayFourStyle = (channelName: string, response?: ResponseItem) => {
    return (
      <div className="justify-between-grid">
        <div className="pair">
          <br></br>
          <br></br>
          <div className="channel-name-box">
            {channelName}{' '}
            {showAmount ? (
              <Percentage total={response?.total} correct={response?.correct} />
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  const renderOtherDaysStyle = (
    channelName1: string,
    channelName2: string,
    response1?: ResponseItem,
    response2?: ResponseItem
  ) => {
    return (
      <div className="">
        <div
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="channel-name-box"
        >
          {channelName1}{' '}
          {showAmount ? (
            <Percentage total={response1?.total} correct={response1?.correct} />
          ) : null}
        </div>
        <div
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="channel-name-box"
        >
          {channelName2}{' '}
          {showAmount ? (
            <Percentage total={response2?.total} correct={response2?.correct} />
          ) : null}
        </div>
      </div>
    )
  }

  const slicedClashData = useMemo(() => {
    if (day === 4) {
      return clashDataForDay
    } else {
      return clashDataForDay.slice(from, to)
    }
  }, [clashDataForDay, from, to])

  const determineWhatToRender = (
    channelName1: string,
    channelName2: string,
    response1?: ResponseItem,
    response2?: ResponseItem
  ) => {
    if (day === 1) {
      return renderDayOneStyle(channelName1, channelName2, response1, response2)
    } else if (day === 4) {
      if (dayFourIndex === 2) {
        return renderDayFourStyle(channelName2, response2)
      } else {
        return renderDayFourStyle(channelName1, response1)
      }
    } else {
      return (
        <div className="">
          {renderOtherDaysStyle(
            channelName1,
            channelName2,
            response1,
            response2
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
            clash.responses[clash.channel1_id],
            clash.responses[clash.channel2_id]
          )}
        </>
      ))}
    </div>
  )
}
