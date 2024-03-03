import { NextApiRequest, NextApiResponse } from 'next'
import { getLeaderboardData } from '@/utils/getLeaderboardData';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
   const data = await getLeaderboardData();
    return response.status(200).json({
      leaderboard: data,
      questionId: parseInt(process.env.QUESTION_ID || '')
    })
  } catch (error) {
    return response.status(500).json({ error })
  }
}
