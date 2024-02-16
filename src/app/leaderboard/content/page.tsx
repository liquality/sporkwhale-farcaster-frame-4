import LeaderboardTemplate from '../../components/leaderboard-template'
import data from '../../components/leaderboard-data.json';
import { getQuestionFromId } from '@/utils/database-operations';

export default async function Page() {
  const question = await getQuestionFromId(1);
  console.log({question})
  return <LeaderboardTemplate data={data}/>
}
