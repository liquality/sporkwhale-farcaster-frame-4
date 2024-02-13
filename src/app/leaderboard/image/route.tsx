import { ImageResponse } from 'next/og'
import data from '../../components/leaderboard-data.json';
import LeaderboardTempalte from '../../components/leaderboard-template'

export async function GET({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const data: any[] = [];
  return new ImageResponse(
    <LeaderboardTempalte data={data} />,
    // ImageResponse options
    {
    
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      width: 700,
      height: 500,
    }
  )
}
