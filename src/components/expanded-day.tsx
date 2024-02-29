import { ClashData } from '@/types'
import './leaderboard.css'
import Percentage from './percentage'

type ExpandedDayProps = {
  day: number
  clashDataForDay: ClashData[]
}

export default function ExpandedDay(props: ExpandedDayProps) {
  const { clashDataForDay } = props

  return (
    <div className="expanded-day">
      <div className="vs-title">VS</div>

      {clashDataForDay.map((clash: ClashData, index: number) => (
        <>
          <div className="flex-direction-row justify-between " key={index}>
            <div className="" style={{ width: '30%', margin: 3 }}>
              {clash.channel_name_1} <Percentage total={clash.responses[clash.channel1_id]?.total} correct={clash.responses[clash.channel1_id]?.correct}/>
            </div>
            <div style={{ width: '30%', margin: 3 }}>
              {clash.channel_name_2} <Percentage total={clash.responses[clash.channel2_id]?.total} correct={clash.responses[clash.channel2_id]?.correct}/>
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
