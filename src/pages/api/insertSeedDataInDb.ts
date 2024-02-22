import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

//Insert seed data in db
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    /*  //Insert the questions
    await sql`INSERT INTO questions (id, question, expires_at, correct_response, options) 
    select 1, 'What is Johanna''s last name?', '2024-02-29 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'Fransson', '["Fransson", "Mehrain"]'::json union all
    select 2, 'What is Thessy''s favorite city?', '2024-03-01 10:00:00-00'::timestamp AT TIME ZONE 'MST', '', '["NYC", "Berlin"]'::json union all
    select 3, 'What is Denver called? CLUE: ''the ___ ___ city', '2024-03-02 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'Mile-High City', '["Mile-High City", "Big Apple"]'::json union all
    select 4, 'How many devs are working on Farcaster?', '2024-03-03 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'Option 1', '["Option 1", "Option 2"]'::json;`
*/
    await sql`INSERT INTO clashes (id, question_id, channel1_id, channel2_id, channel_winner_id) 
    VALUES 
        (1, 1, 1, 2, NULL), -- Clash of the coasts: NYC vs LA
        (2, 1, 3, 4, NULL), -- Clash of the PFPs: Nouns vs. mfers
        (3, 1, 5, 6, NULL), -- Clash of the rollups: Base vs. Zora
        (4, 1, 7, 8, NULL), -- Clash of chains: OP Stack vs. Solana
        (5, 1, 9, 10, NULL), -- FC Meta Clash: Perl vs. Farcats
        (6, 1, 11, 12, NULL), -- Clash of brains: Founders vs. Farcaster Devs
        (7, 1, 13, 14, NULL), -- Consumer crypto clash: SeedClub vs. Skininthegame
        (8, 1, 15, 16, NULL), -- Memetic clash: Degen vs. Memes
        (9, 1, 17, 18, NULL), -- Clash of personalities: Teddit vs. Cameron
        (10, 1, 19, 20, NULL), -- Clash of VCs: AVC vs. Orange
        (11, 1, 21, 22, NULL), -- Nounish Colors Clash: Purple vs. Yellow Collective
        (12, 1, 23, 24, NULL), -- Clash of Quests: layer3 vs. Daylight
        (13, 1, 25, 26, NULL), -- Fit clash: fitness vs. 10k steps
        (14, 1, 27, 28, NULL), -- Clash of believers: Base God vs. $DOG
        (15, 1, 29, 30, NULL), -- Clash of the stack: backend vs. frontend
        (16, 1, 31, 32, NULL); -- Gender clash: farcastHER vs. farcastHIM
    `

    //Insert some seeded users + question responses to simulate the db calculation
    await sql`INSERT INTO users (id, wallet_address, fid)
    VALUES
        (1, '0x749213881f6387426da9cb9cb2fe898759551c4b',  8201),
        (2, '0x3ea1d99b618d8b3528fa6620817b3ff24adbd62a',  9241),
        (3, '0x015a72a8811c0ce511429eb477a12d176e8ec715',  3201),
        (4, '0x045772a8181cdce541527eb447q19d176e8ec668',  4201),
        (5, '0x01219482fc51664fedf8b2b6a0eb65b0368ea42e',  10001),
        (6, '0xc478c48f4f62606f806de700b039d94225067c8d',  5906);`

    await sql`INSERT INTO user_question_responses (question_id, user_id, correct_response, response, channel_id)
    VALUES
        (1, 1, true, 'Fransson', 1),
        (1, 2, true, 'fransson', 1),
        (2, 2, false, 'Paris', 2),
        (3, 3, true, 'Mile High', 3),
        (1, 4, false, 'Simpson', 1),
        (2, 5, true, 'Athens', 2),
        (2, 2, true, 'fransson', 4),
        (2, 2, true, 'FransSon', 4);`

    //TODO insert clashes table

    return response.status(200).json({ success: 'ok' })
  } catch (error) {
    console.log(error, 'Error seeding data!')
    return response.status(500).json({ error })
  }
}
