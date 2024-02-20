import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

//Insert seed data in db
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    //Insert the questions
    await sql`INSERT INTO questions (id, question, expires_at, correct_response, options) 
    select 1, 'What is Johanna''s last name?', '2024-02-29 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'Fransson', '["Fransson", "Mehrain"]'::json union all
    select 2, 'What is Thessy''s favorite city?', '2024-03-01 10:00:00-00'::timestamp AT TIME ZONE 'MST', '', '["NYC", "Berlin"]'::json union all
    select 3, 'What is Denver called? CLUE: ''the ___ ___ city', '2024-03-02 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'Mile-High City', '["Mile-High City", "Big Apple"]'::json union all
    select 4, 'Question 4 ?', '2024-03-03 10:00:00-00'::timestamp AT TIME ZONE 'MST', 'Option 1', '["Option 1", "Option 2"]'::json;`

    //Insert the channels and their follower count
    //TODO when moving away from testing, get the follower count from Neynar API
    await sql`INSERT INTO channels (id, question_id, name, followers, c_address, c_wallet, c_pool, salt) 
    VALUES 
        (1, 0, 'nyc', 0, '', '', '', ''),
        (2, 0, 'la', 0, '', '', '', ''),
        (3, 0, 'nouns', 0, '', '', '', ''),
        (4, 0, 'mfers', 0, '', '', '', ''),
        (5, 0, 'base', 0, '', '', '', ''),
        (6, 0, 'zora', 0, '', '', '', ''),
        (7, 0, 'op-stack', 0, '', '', '', ''),
        (8, 0, 'solana', 0, '', '', '', ''),
        (9, 0, 'perl', 0, '', '', '', ''),
        (10, 0, 'farcats', 0, '', '', '', ''),
        (11, 0, 'founders', 0, '', '', '', ''),
        (12, 0, 'farcaster-devs', 0, '', '', '', ''),
        (13, 0, 'seedclub', 0, '', '', '', ''),
        (14, 0, 'skininthegame', 0, '', '', '', ''),
        (15, 0, 'degen', 0, '', '', '', ''),
        (16, 0, 'memes', 0, '', '', '', ''),
        (17, 0, 'teddit', 0, '', '', '', ''),
        (18, 0, 'cameron', 0, '', '', '', ''),
        (19, 0, 'avc', 0, '', '', '', ''),
        (20, 0, 'orange', 0, '', '', '', ''),
        (21, 0, 'purple', 0, '', '', '', ''),
        (22, 0, 'yellow', 0, '', '', '', ''),
        (23, 0, 'layer3', 0, '', '', '', ''),
        (24, 0, 'daylight', 0, '', '', '', ''),
        (25, 0, 'fitness', 0, '', '', '', ''),
        (26, 0, '10k', 0, '', '', '', ''),
        (27, 0, 'base-god', 0, '', '', '', ''),
        (28, 0, 'dog', 0, '', '', '', ''),
        (29, 0, 'backend', 0, '', '', '', ''),
        (30, 0, 'frontend', 0, '', '', '', ''),
        (31, 0, 'farcasther', 0, '', '', '', ''),
        (32, 0, 'farcasthim', 0, '', '', '', '');    
    `

    await sql`INSERT INTO clashes (id, question_id, channel1_id, channel2_id, channel_winner_id) 
    VALUES 
        (1, 0, 1, 2, NULL), -- Clash of the coasts: NYC vs LA
        (2, 0, 3, 4, NULL), -- Clash of the PFPs: Nouns vs. mfers
        (3, 0, 5, 6, NULL), -- Clash of the rollups: Base vs. Zora
        (4, 0, 7, 8, NULL), -- Clash of chains: OP Stack vs. Solana
        (5, 0, 9, 10, NULL), -- FC Meta Clash: Perl vs. Farcats
        (6, 0, 11, 12, NULL), -- Clash of brains: Founders vs. Farcaster Devs
        (7, 0, 13, 14, NULL), -- Consumer crypto clash: SeedClub vs. Skininthegame
        (8, 0, 15, 16, NULL), -- Memetic clash: Degen vs. Memes
        (9, 0, 17, 18, NULL), -- Clash of personalities: Teddit vs. Cameron
        (10, 0, 19, 20, NULL), -- Clash of VCs: AVC vs. Orange
        (11, 0, 21, 22, NULL), -- Nounish Colors Clash: Purple vs. Yellow Collective
        (12, 0, 23, 24, NULL), -- Clash of Quests: layer3 vs. Daylight
        (13, 0, 25, 26, NULL), -- Fit clash: fitness vs. 10k steps
        (14, 0, 27, 28, NULL), -- Clash of believers: Base God vs. $DOG
        (15, 0, 29, 30, NULL), -- Clash of the stack: backend vs. frontend
        (16, 0, 31, 32, NULL); -- Gender clash: farcastHER vs. farcastHIM
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
