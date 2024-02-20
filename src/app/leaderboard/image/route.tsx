import { ImageResponse } from 'next/og'
import LeaderboardTempalte from '../../components/leaderboard'
import { getLeaderboardData } from '@/utils/getLeaderboardData';

export async function GET({url}: Request) {
  const { searchParams } = new URL(url)
  const mode = searchParams.get('mode') || 'table'
  const data = await getLeaderboardData()
  return new ImageResponse(
    <LeaderboardTempalte data={data} mode={mode as any} />,
    // ImageResponse options
    {
    
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      width: 800,
      height: 300,
    }
  )
}
