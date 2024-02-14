import type { NextApiRequest, NextApiResponse, Metadata } from 'next'
import { IMAGES } from '@/utils/image-paths'
import { validateMessage } from '@/validate'
import { TSignedMessage, TUntrustedData, TUserProfileNeynar } from '@/types'
import { generateFarcasterFrame, SERVER_URL } from '@/utils/generate-frames'
import {
  calculateImageBasedOnChannelResponses,
  saveUser,
  saveUserQuestionResponse,
} from '@/utils/database-operations'
import { getChannelFromCastHash } from '@/utils/neynar-api'
import { QUESTION } from '@/utils/question'

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

  const isMessageValid = await validateMessage(
    signedMessage.trustedData?.messageBytes
  )

  if (!isMessageValid) {
    return res.status(400).json({ error: 'Invalid message' })
  }

  const ud: TUntrustedData = signedMessage.untrustedData

  let html: string = ''
  let statusCode: number = 200
  let locationHeader: string = ''
  let userIsInChannel: TUserProfileNeynar | null | undefined = null
  const questionCorrectAnswer = QUESTION.correct_response

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
  console.log(ud, 'wats UD?')
  switch (reqId) {
    case 'start':
      //userIsInChannel = await getIfUserIsInChannel(channel, ud.fid)

      if (1 === 1) {
        //if (userIsInChannel?.fid) {
        const traitStatusImage = await calculateImageBasedOnChannelResponses(
          channel
        )
        //TODO send in question here
        console.log(`${SERVER_URL}/${traitStatusImage}`, 'traitstatusimg')
        html = generateFarcasterFrame(
          `${SERVER_URL}/${traitStatusImage}`,
          'question'
        )
      } else {
        html = generateFarcasterFrame(
          `${SERVER_URL}/${IMAGES.be_a_follower}`,
          'error'
        )
      }
      break
    //TODO this function needs to be differnt depending on code base
    //and depending if we do button click instead
    case 'question':
      if (channel && ud.inputText && ud.inputText.length) {
        const user = await saveUser(ud, channel)
        const correctResponse =
          ud.inputText && ud.inputText.toLowerCase() === questionCorrectAnswer
        html = await saveUserQuestionResponse(
          ud,
          user.id,
          correctResponse as boolean
        )
      } else {
        //If no submission by user
        html = generateFarcasterFrame(`${SERVER_URL}/${IMAGES.whale}`, 'start')
      }
      break
    case 'redirect':
      locationHeader = 'https://www.liquality.io'
      response.redirect(302, locationHeader) // or you set Location in response.setHeader()
      break
    case 'error':
      locationHeader = `https://warpcast.com/~/channel/${channel}`
      response.redirect(302, locationHeader)
      break
    case 'reload':
      html = generateFarcasterFrame(`${SERVER_URL}/${IMAGES.whale}`, 'start')

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
