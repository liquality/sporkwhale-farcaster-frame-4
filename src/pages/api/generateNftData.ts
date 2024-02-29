import { NextApiRequest, NextApiResponse } from 'next'
import fs  from 'fs'
import { mkdirpSync } from 'mkdirp'

const result = mkdirpSync('./public/metadata')
console.log('result:', result)

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method == 'GET') {
    try {

        const metadata = (questionId: number) => ({
            name: `SporkWhale: Day ${questionId} ${(questionId == 1)? 'Loser' : 'Winner'} `,
            description: `This is a unique and limited edition artwork created for Day ${questionId} ${(questionId == 1)? 'loser' : 'winner'} of the clash of channels competition to keep SporkWhale alive!`,
            image: `ipfs://QmPAYx5tuJyAKqaUTrNtjR9N5F5rQMSm7pNGyv5Cdybz9c/${questionId}.jpeg`,
            external_url: 'https://leaderboard.liquality.io/',
            attributes: [
                {
                trait_type: "Day",
                value: `Day ${questionId}`
                },
                {
                trait_type: "Rarity",
                value: "Rare"
                },
                {
                trait_type: "Edition",
                value: "1 of 1"
                },
                {
                trait_type: "Year Created",
                value: "2024"
                },
                {
                trait_type: "Personality",
                value: `${(questionId == 1)? 'Very Sad': (questionId == 2)? 'Slightly Sad' : (questionId == 3)?'Slightly Happy': (questionId == 4)?'Happy':'Very Happy'}`
                },
                {
                    trait_type: 'Collection',
                    value: 'Keep SporkWhale Alive'
                },
            ],
            collection: {
            name: "Keep SporkWhale Alive",
            creator: "MyCollectives by Liquality",
            total_supply: 5
            },
          })

          for (let questionId = 1; questionId <= 5; questionId++) {
            const json = metadata(questionId)
            console.log('json:', questionId, ' > ', json)
            fs.writeFileSync(`./public/metadata/${questionId}.json`, JSON.stringify(json, null, 2))
          }

      return response
        .status(200)
        .json({ status: 'Ok', message: 'NFT images and metadata uploaded to IPFS successfully' })
    } catch (error) {
      console.error('Error creating collectives:', error)
      return response.status(500).json({ error })
    }
  }
}
