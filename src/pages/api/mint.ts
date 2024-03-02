import type { NextApiRequest, NextApiResponse } from 'next'
import { IMAGES } from '@/utils/image-paths'
import { validateMsgWithNeynar } from '@/validate'
import { TSignedMessage, TUntrustedData } from '@/types'
import { generateFarcasterFrame, SERVER_URL } from '@/utils/generate-frames'
import {
  calculateIfWinningOrNot,
  getQuestionFromId,
} from '@/utils/database-operations'
import { HANDLE_QUESTION } from '@/utils/question'

const QUESTION_ID = parseInt(process.env.QUESTION_ID || '')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

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

  const response = res.status(statusCode).setHeader('Content-Type', 'text/html')

  const question = await getQuestionFromId(QUESTION_ID)
  switch (reqId) {
    case 'mint-start':
      html = generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.question}`,
        'question',
        question
      )

      break
    case 'mint':
      if (question?.id) {
        console.log('MINTING THE MINT')
        //html = await HANDLE_QUESTION(ud, channel)
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
