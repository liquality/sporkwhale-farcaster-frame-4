import { ImageResponse } from 'next/og'
import Leaderboard from '../../components/leaderboard'

export async function GET({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return new ImageResponse(
    <Leaderboard />,
    // ImageResponse options
    {
    
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      width: 700,
      height: 500,
    }
  )
}
