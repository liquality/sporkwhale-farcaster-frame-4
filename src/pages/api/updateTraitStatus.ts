import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'
import { calculateImageBasedOnChannelResponses } from '@/utils/database-operations'

//TODO @Bradley run/update this every day 10am MST using a scheduler

//Example call: http://localhost:3000/api/updateTraitStatus?channel=cryptostocks
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const channelsQuery = await sql`SELECT * FROM channels;`
    const channels = channelsQuery.rows
    const responseArray = []

    for (const channel of channels) {
      const newTrait = await calculateImageBasedOnChannelResponses(channel.name)
      responseArray.push({ channel: channel.name, image: newTrait })
    }

    return response.status(200).json(responseArray)
  } catch (error) {
    console.log(error, 'Error seeding data!')
    return response.status(500).json({ error })
  }
}
