import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const users =
      await sql`SELECT c.id AS channel_id, c.name, COUNT(uqr.*) AS response_count
      FROM channels c
      LEFT JOIN user_question_responses uqr ON c.id = uqr.channel_id
      GROUP BY c.id, c.name;      
    `

    return response.status(200).json({ users: users.rows })
  } catch (error) {
    return response.status(500).json({ error })
  }
}
