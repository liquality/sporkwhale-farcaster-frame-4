
import Leaderboard from '../../components/leaderboard'

export default async function LeaderboardContent({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <Leaderboard />;
  
}
