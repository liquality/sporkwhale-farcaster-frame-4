import type { NextApiRequest, NextApiResponse } from 'next'
import { IMAGES } from '@/utils/image-paths'
import { validateMessage, validateMsgWithNeynar } from '@/validate'
import { TSignedMessage, TUntrustedData, TUserProfileNeynar } from '@/types'
import { generateFarcasterFrame, SERVER_URL } from '@/utils/generate-frames'
import {
  getQuestionFromId,
  getTraitForChannel,
} from '@/utils/database-operations'
import { getChannelFromCastHash } from '@/utils/neynar-api'
import { HANDLE_QUESTION, QUESTION_ID } from '@/utils/question'

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
  console.log(signedMessage, 'signed msg?')

  const isMessageValid = await validateMsgWithNeynar(
    signedMessage.trustedData?.messageBytes
  )
  console.log(isMessageValid, 'is message valid')

  if (!isMessageValid) {
    return res.status(400).json({ error: 'Invalid message' })
  }

  const ud: TUntrustedData = signedMessage.untrustedData

  let html: string = ''
  let statusCode: number = 200
  let locationHeader: string = ''
  let userIsInChannel: TUserProfileNeynar | null | undefined = null

  const response = res.status(statusCode).setHeader('Content-Type', 'text/html')

  //TODO: generate inital frame based on calculation of participation/correctness
  //let castHash = ud.castId.hash
  let castHash = '0x7aadf31bcdd0adfe41e593c5bc6c32bb81118471' //cryptostocks cast
  //let castHash = '0x6de1af7af197e8555d036f07274ca47af706ef25' //skininthegame cast
  let channel = await getChannelFromCastHash(castHash)
  if (!channel) channel = 'cryptostocks'

  //if network response takes more than 3 seconds, force generate reload btn
  const timeout = setTimeout(() => {
    console.log('Response took too long!')
    //html = generateFarcasterFrame(`${SERVER_URL}/${IMAGES.reload}`, 'reload')
    //return response.send(html)
  }, 3000)

  clearTimeout(timeout) // Clear the timeout if the function returns before 3 seconds
  switch (reqId) {
    case 'start':
      //userIsInChannel = await getIfUserIsInChannel(channel, ud.fid)

      if (1 === 1) {
        //if (userIsInChannel?.fid) {

        const traitStatusImage = await getTraitForChannel(channel)
        //TODO send in question here
        const question = await getQuestionFromId(QUESTION_ID)
        console.log(`${SERVER_URL}/${traitStatusImage}`, 'traitstatusimg')
        html = generateFarcasterFrame(
          traitStatusImage,
          'question',
          question?.question
        )
      } else {
        html = generateFarcasterFrame(
          `${SERVER_URL}/${IMAGES.be_a_follower}`,
          'error-be-a-follower'
        )
      }
      break
    case 'question':
      //TODO @Bradley create scheduler to expire the question
      //TODO @bradley add the question inside the image (on the bottom with html)
      try {
        const question = await getQuestionFromId(QUESTION_ID)
        if (channel && question) {
          html = await HANDLE_QUESTION(channel, ud)
        } else {
          html = generateFarcasterFrame(
            `${SERVER_URL}/${IMAGES.expired}`,
            'error-see-leaderboard'
          )
        }
      } catch (error) {
        console.log(error, 'wats erro?')
      }

      break
    case 'error-be-a-follower':
      locationHeader = `https://warpcast.com/~/channel/${channel}`
      response.redirect(302, locationHeader)
      break
    case 'error-see-leaderboard':
      locationHeader = 'http://localhost:3000/'
      response.redirect(302, locationHeader)
      break
    default:
      html = generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.question1}`,
        'question'
      )
      break
  }
  return response.send(html)
}
