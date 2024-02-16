import { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

//Insert seed data in db
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    //Insert the questions
    //Insert the questions
    await sql`INSERT INTO questions (id, question)
    VALUES
        (1, 'What is Johanna''s last name?'),
        (2, 'What is Thessy''s favorite city?'),
        (3, 'What is Denver called? CLUE: ''the ___ ___ city');`

    //Insert the channels and their follower count
    //TODO when moving away from testing, get the follower count from Neynar API
    await sql`INSERT INTO channels (id, name, followers, c_address, c_wallet, c_pool, salt)
    VALUES 
      (5, 'base', 10, '0xB6AcfD2De7A54284FcE7805f5C52E710A2048b77', '0x9A61Db86533a9a5e9Ad38AbFFeB08e3A3b63DF5b', '0x98f4109848d96B1bed010DD13c1519F74F7fC36f', '1211321320221011'),
      (4, 'founders', 15, '0xa9887ff461A5920a807bC23D3096C409F43eCe96', '0x3d3C87229389Ce66d1Fc6Ea416d37df17ECF97B1', '0x1D9D328d8C2068d09e4e116AFb7Af84846736ceA', '2211320212332233'),
      (1, 'cryptostocks', 7, '0xB6AcfD2De7A54284FcE7805f5C52E710A2048b77', '0x9A61Db86533a9a5e9Ad38AbFFeB08e3A3b63DF5b', '0x98f4109848d96B1bed010DD13c1519F74F7fC36f', '1211321320221011'),
      (2, 'skininthegame', 5, '0xB6AcfD2De7A54284FcE7805f5C52E710A2048b77', '0x9A61Db86533a9a5e9Ad38AbFFeB08e3A3b63DF5b', '0x98f4109848d96B1bed010DD13c1519F74F7fC36f', '1211321320221011'),
      (3, 'ethdenver', 4, '0xa9887ff461A5920a807bC23D3096C409F43eCe96', '0x3d3C87229389Ce66d1Fc6Ea416d37df17ECF97B1', '0x1D9D328d8C2068d09e4e116AFb7Af84846736ce', '1211321320221011');
    `

    //Insert the trait_displayed starting point for all channels
    await sql`INSERT INTO trait_displayed (trait, channel_id)
    VALUES
        ('glasses_bracelet_chain_bathingSuit_whale.png', 1),
        ('glasses_bracelet_chain_bathingSuit_whale.png', 2),
        ('glasses_bracelet_chain_bathingSuit_whale.png', 3),
        ('glasses_bracelet_chain_bathingSuit_whale.png', 4),
        ('glasses_bracelet_chain_bathingSuit_whale.png', 5);`

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

    return response.status(200).json({ success: 'ok' })
  } catch (error) {
    console.log(error, 'Error seeding data!')
    return response.status(500).json({ error })
  }
}
