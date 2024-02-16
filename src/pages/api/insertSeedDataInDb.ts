import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

//Insert seed data in db
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    //Insert the questions
    await sql`INSERT INTO questions (question, expires_at) 
    select 'Question 1 ?', '2024-02-29 10:00:00-00'::timestamp AT TIME ZONE 'MST' union all
    select 'Question 2 ?', '2024-03-01 10:00:00-00'::timestamp AT TIME ZONE 'MST' union all
    select 'Question 3 ?', '2024-03-02 10:00:00-00'::timestamp AT TIME ZONE 'MST' union all
    select 'Question 4 ?', '2024-03-03 10:00:00-00'::timestamp AT TIME ZONE 'MST';`

    //Insert the channels and their follower count
    //TODO when moving away from testing, get the follower count from Neynar API
    await sql`INSERT INTO channels (name, followers)
    VALUES
        ('cryptostocks', 7),
        ('skininthegame', 5),
        ('ethdenver', 4);`

    //Insert the trait_displayed starting point for all channels
    await sql`INSERT INTO trait_displayed (trait, channel_id)
    VALUES
        ('glasses_bracelet_chain_bathingSuit_whale.png', 1),
        ('glasses_bracelet_chain_bathingSuit_whale.png', 2),
        ('glasses_bracelet_chain_bathingSuit_whale.png', 3);`

    //Insert some seeded users + question responses to simulate the db calculation
    await sql`INSERT INTO users (wallet_address, fid)
    VALUES
        ('0x749213881f6387426da9cb9cb2fe898759551c4b',  8201),
        ('0x3ea1d99b618d8b3528fa6620817b3ff24adbd62a',  9241),
        ('0x015a72a8811c0ce511429eb477a12d176e8ec715',  3201),
        ('0x045772a8181cdce541527eb447q19d176e8ec668',  4201),
        ('0x01219482fc51664fedf8b2b6a0eb65b0368ea42e',  10001),
        ('0xc478c48f4f62606f806de700b039d94225067c8d',  5906);`

    await sql`INSERT INTO user_question_responses (question_id, user_id, correct_response, response, channel_id)
    VALUES
        (1, 1, true, 'Fransson', 1),
        (1, 2, true, 'fransson', 1),
        (2, 2, false, 'Paris', 2),
        (3, 3, true, 'Mile High', 3),
        (1, 4, false, 'Simpson', 1),
        (2, 5, true, 'Athens', 2);`

    return response.status(200).json({ success: 'ok' })
  } catch (error) {
    console.log(error, 'Error seeding data!')
    return response.status(500).json({ error })
  }
}
