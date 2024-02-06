import type { NextApiRequest, NextApiResponse, Metadata } from 'next'

import { mintWithSyndicate } from '@/utils/utils'
import { validateMessage } from '@/validate'
import { TSignedMessage, TUntrustedData } from '@/types'
import { generateFarcasterFrame, SERVER_URL } from '@/utils/generate-frames'
import { saveUser } from '@/utils/database-operations'
import { getChannelFromCastHash } from '@/utils/neynar-api'


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

  console.log('signedMessage: ', signedMessage)

  if (!isMessageValid) {
    return res.status(400).json({ error: 'Invalid message' })
  }

  const ud: TUntrustedData = signedMessage.untrustedData

  let html: string = ''
  let statusCode: number = 200
  let locationHeader: string = ''
  const questionCorrectAnswer = "fransson"

  const response = res.status(statusCode).setHeader('Content-Type', 'text/html')

  let img = ""
  setTimeout(() => {
    console.log('Hi I GOT HERE')
 
  }, 5000)

  //TODO: generate inital frame based on calculation of participation/correctness

  const channel = await getChannelFromCastHash(ud.castId.hash)
  console.log(channel, 'CHANNEL GOT HERE')
  switch (reqId) {
    case 'start':
      if(channel){
        const user = await saveUser(ud, channel)
        if (ud.inputText && ud.inputText.toLowerCase() === questionCorrectAnswer) {
          html = generateFarcasterFrame(`${SERVER_URL}/slightly_happy_whale_5_traits.png`, 'mint')
        } else if(ud.inputText && ud.inputText.toLowerCase() !== questionCorrectAnswer) {
          html = generateFarcasterFrame(`${SERVER_URL}/slightly_sad_whale_3_traits.png`, 'mint')
        }
      }
      break
    case 'mint':
      html = await mintWithSyndicate(ud.fid)
      break
    case 'redirect':
      locationHeader = 'https://www.liquality.io'
      response.redirect(302, locationHeader) // or you set Location in response.setHeader()
      break
    case 'error':
      locationHeader = 'https://warpcast.com/~/channel/frames'
      response.redirect(302, locationHeader)
      break
    default:
      html = generateFarcasterFrame(`${SERVER_URL}/johannas_lastname_question1.png`, 'start')
      break
  }

  return response.send(html)
}
