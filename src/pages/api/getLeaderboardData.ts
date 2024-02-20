import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'
import { levelImages } from '@/utils/image-paths'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const channelsQuery = await sql`SELECT * FROM channels;`
    const channels = channelsQuery.rows
    const responseArray = []

    for (const channel of channels) {
      responseArray.push({
        channel: channel.name,
        level: channel.question_id,
      })
    }
    responseArray.sort((a, b) => b.level - a.level)

    return response.status(200).json(responseArray)
  } catch (error) {
    return response.status(500).json({ error })
  }
}
