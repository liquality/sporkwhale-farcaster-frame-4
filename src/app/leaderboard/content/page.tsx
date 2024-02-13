import LeaderboardTemplate from '../../components/leaderboard-template'
import data from '../../components/leaderboard-data.json';

export default async function Page() {
  return <LeaderboardTemplate data={data}/>
}
