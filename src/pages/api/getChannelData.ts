import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const users = await sql`  SELECT * FROM questions
    WHERE id =2
    AND expires_at::timestamp AT TIME ZONE 'MST' > current_timestamp AT TIME ZONE 'MST';
    `

    return response.status(200).json({ users: users.rows })
  } catch (error) {
    return response.status(500).json({ error })
  }
}
