import Leaderboard from '../../components/leaderboard'
import { getLeaderboardData } from '@/utils/getLeaderboardData'

export default async function Page({
  searchParams,
}: {
  searchParams: { mode?: string }
}) {
  const mode = searchParams.mode || 'table'
  const data = await getLeaderboardData()
  return <Leaderboard data={data} mode={mode as any} />
}
