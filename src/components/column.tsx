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

  console.log(from, to, 'From and to', clashDataForDay.length)

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

  console.log(slicedClashData, 'slised?')
  return (
    <div className="">
      {slicedClashData?.map((clash: ClashData, index: number) => (
        <>
          {
            day === 1 ? (
              renderDayOneStyle(clash.channel_name_1, clash.channel_name_2)
            ) : (
              <div className="">
                {renderOtherDaysStyle(
                  clash.channel_name_1,
                  clash.channel_name_2
                )}
              </div>
            )
            /*   <div className="flex-direction-row justify-between " key={index}>
            <div className="" style={{ width: '30%', margin: 3 }}>
              {clash.channel_name_1}
            </div>
            <div style={{ width: '30%', margin: 3 }}>
              {clash.channel_name_2}
            </div>
          </div> */
          }
          {/*    <div
            style={{ width: '100%', height: 1, backgroundColor: 'black' }}
          ></div> */}
        </>
      ))}
    </div>
  )
}
