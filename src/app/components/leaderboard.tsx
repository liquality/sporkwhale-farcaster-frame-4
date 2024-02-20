import TextToSVG from 'text-to-svg'
import { Leaderboard } from '@/types'
const textToSVG = TextToSVG.loadSync(
  `${process.cwd()}/fonts/OpenSans-Regular.ttf`
)

function convertTextToSVGPath(text: string) {
  const attributes = { fill: 'white', stroke: 'white' }
  return textToSVG.getSVG(text, {
    x: 0,
    y: 0,
    fontSize: 24,
    anchor: 'top',
    attributes: attributes,
  })
}

function CSSstring(css: String) {
  const style = css.split(';').reduce((prev: any, curr: string) => {
    let [key, value] = curr.split(':')

    if (key && value) {
      key = key.trim()
      value = value.trim()
      var camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase())
      prev[camelCased] = value
    }
    return prev
  }, {})
  console.log({ style })
  return style
}

export interface LeaderboarProps {
  data: Leaderboard[]
  mode: 'list' | 'table'
}

const Leaderboard = ({ data, mode }: LeaderboarProps) => {
  if (mode === 'list') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          margin: 0,
          padding: '0.5rem',
        }}
      >
        {data?.map((item, index) => (
          <div
          style={{
            padding: '0.5rem',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
            key={index}
          >
             {item.level} {item.channel}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: 0,
        padding: '0.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          fontWeight: 'bold',
        }}
      >
        <div
          style={{
            padding: '0.5rem',
            display: 'flex',
            flexGrow: 1,
            flexBasis: 0,
            justifyContent: 'flex-start',
          }}
        >
          Channel
        </div>
        <div
          style={{
            padding: '0.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            flexGrow: 1,
            flexBasis: 0,
            justifyContent: 'center',
          }}
        >
          Image
        </div>
        <div
          style={{
            padding: '0.5rem',
            display: 'flex',
            flexGrow: 1,
            flexBasis: 0,
            justifyContent: 'center',
          }}
        >
          Level
        </div>
      </div>
      {data?.map((item, index) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
          key={index}
        >
          <div
            style={{
              padding: '0.5rem',
              display: 'flex',
              flexGrow: 1,
              flexBasis: 0,
              justifyContent: 'flex-start',
            }}
          >
            {item.channel}
          </div>
          <div
            style={{
              padding: '0.5rem',
              display: 'flex',
              flexGrow: 1,
              flexBasis: 0,
              justifyContent: 'flex-start',
            }}
          >
            {item.image}
          </div>
          <div
            style={{
              padding: '0.5rem',
              display: 'flex',
              flexGrow: 1,
              flexBasis: 0,
              justifyContent: 'center',
            }}
          >
            {item.level}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Leaderboard
