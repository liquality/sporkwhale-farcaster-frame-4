import { TLeaderboard } from '@/types'
import { SERVER_URL } from '@/utils/generate-frames'
import { IMAGES } from '@/utils/image-paths'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import LeaderboardMobile from '../components/leaderboard-mobile'
export default function Home() {
  const [leaderboard, setLeaderboard] = useState<null | TLeaderboard[]>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!leaderboard) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/getLeaderboardData')
          const data = await response.json()
          console.log({ data })
          setLeaderboard(data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [leaderboard])

  let img = leaderboard ? IMAGES.welcome : IMAGES.welcome
  console.log(leaderboard, 'leaderboard')
  return (
    <>
      <Head>
        <meta property="og:title" content="Frame" />
        <meta property="og:image" content={`${SERVER_URL}/${img}`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${SERVER_URL}/${img}`} />
        <meta property="fc:frame:button:1" content="GO TO QUIZ ✉️" />
        <meta
          property="fc:frame:post_url"
          content={`${SERVER_URL}/api/post?data=start`}
        />
      </Head>

      <LeaderboardMobile />
    </>
  )
}
