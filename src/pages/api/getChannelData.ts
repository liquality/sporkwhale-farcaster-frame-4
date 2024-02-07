import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const users= await sql`SELECT * FROM users`;
    const userCount = users.rowCount
    const moreThanOneUser = userCount > 1;

    return response.status(200).json({ moreThanOneUser: moreThanOneUser })
  } catch (error) {
    return response.status(500).json({ error })
  }
}
