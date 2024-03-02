import type { NextApiRequest, NextApiResponse } from 'next'
import { IMAGES } from '@/utils/image-paths'
import { validateMsgWithNeynar } from '@/validate'
import { TSignedMessage, TUntrustedData } from '@/types'
import { generateFarcasterFrame, SERVER_URL } from '@/utils/generate-frames'
import {
  calculateIfWinningOrNot,
  getQuestionFromId,
} from '@/utils/database-operations'
import { getChannelFromCastHash } from '@/utils/neynar-api'
import { HANDLE_QUESTION } from '@/utils/question'
import { getIfUserIsInChannelAirstack } from '@/utils/airstack'

const QUESTION_ID = parseInt(process.env.QUESTION_ID || '')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  console.log(req, 'wats re?')

  const signedMessage = req.body as TSignedMessage

  const reqId = req.query.data
  console.log('request query: ', reqId)

  const isMessageValid = await validateMsgWithNeynar(
    signedMessage.trustedData?.messageBytes
  )

  if (!isMessageValid) {
    return res.status(400).json({ error: 'Invalid message' })
  }

  const ud: TUntrustedData = signedMessage.untrustedData

  let html: string = ''
  let statusCode: number = 200
  let locationHeader: string = ''
  //let userIsInChannel: TUserProfileNeynar | null | undefined = null
  let userIsInChannel: boolean

  const response = res.status(statusCode).setHeader('Content-Type', 'text/html')

  //TODO: generate inital frame based on calculation of participation/correctness
  let castHash = ud.castId.hash
  //let castHash = '0x75fb5866c3105e82500406c94d0f295af4a74d32'
  //let castHash = '0x4c9595bba3cc8f6490d7cc67265aa6a3938c1afb' //BASE
  //let castHash = '0x222d2e841b4edadeaa4de273dee5add20ee18f41' //zora
  //let castHash = '0x03475d45887f13c592c44829de3de18a7d95619d' //farcasther
  //let castHash = '0x7aadf31bcdd0adfe41e593c5bc6c32bb81118471' //cryptostocks cast
  let channel = await getChannelFromCastHash(castHash)
  console.log(channel, 'wats channel!!!')
  const question = await getQuestionFromId(QUESTION_ID)
  switch (reqId) {
    case 'start':
      /*   userIsInChannel = await getIfUserIsInChannelAirstack(
        channel || '',
        ud.fid
      )
      console.log('is in channel', userIsInChannel, channel, ud.fid)
 */
      //userIsInChannel = await getIfUserIsInChannelNeynar(channel || '', ud.fid)
      //if (userIsInChannel) {
      //TODO send in question here
      html = generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.question}`,
        'question',
        question
      )
      //}
      /*  else {
        html = generateFarcasterFrame(
          `${SERVER_URL}/${IMAGES.be_a_follower}`,
          'error-be-a-follower'
        )
      } */
      break
    case 'question':
      if (channel && question?.id) {
        html = await HANDLE_QUESTION(ud, channel)
      } else {
        html = generateFarcasterFrame(
          `${SERVER_URL}/${IMAGES.expired}`,
          'leaderboard'
        )
      }
      break
    case 'error-be-a-follower':
      locationHeader = `https://warpcast.com/~/channel/${channel}`
      return response.redirect(302, locationHeader)

    case 'leaderboard':
      locationHeader = 'https://leaderboard.liquality.io'
      return response.redirect(302, locationHeader)

    case 'correct-or-incorrect':
      if (ud.buttonIndex === 1) {
        //calculate if winning or not here
        html = await calculateIfWinningOrNot(channel || '')
      } else {
        locationHeader = `https://warpcast.com/liquality`
        return response.redirect(302, locationHeader)
      }

      break
    default:
      html = generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.question}`,
        'question'
      )
      break
  }
  return response.send(html)
}
