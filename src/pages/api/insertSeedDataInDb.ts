import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

//Insert seed data in db
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    //Insert the 4 questions
    //Insert the channels and their follower count
    //Insert the trait_displayed starting point for all channels

    return response.status(200).json({ moreThanOneUser: 1 })
  } catch (error) {
    return response.status(500).json({ error })
  }
}
