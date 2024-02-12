import type { NextApiRequest, NextApiResponse, Metadata } from 'next'

import { IMAGES, mintWithSyndicate } from '@/utils/utils'
import { validateMessage } from '@/validate'
import { TSignedMessage, TUntrustedData, TUserProfileNeynar } from '@/types'
import { generateFarcasterFrame, SERVER_URL } from '@/utils/generate-frames'
import {  saveUser, saveUserQuestionResponse } from '@/utils/database-operations'
import { getChannelFromCastHash, getIfUserIsInChannel } from '@/utils/neynar-api'


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
  const questionCorrectAnswer = "fransson"
  
  const response = res.status(statusCode).setHeader('Content-Type', 'text/html')

  //TODO: generate inital frame based on calculation of participation/correctness
  //let castHash = ud.castId.hash
  let castHash = "0x7aadf31bcdd0adfe41e593c5bc6c32bb81118471" //cryptostocks cast
  let channel = await getChannelFromCastHash(castHash)
 
  if(!channel) channel = "cryptostocks"
  //TODO add check here so that user is indeed in the channel, since its channel-gated poll
  
  const timeout = setTimeout(() => {
    console.log('Response too long');
    //TODO if the API response of userIsInChannel is too long, we should
    //force generate a 'reload' btn here
    //html =  generateFarcasterFrame(`${SERVER_URL}/${IMAGES.reload}`, 'reload');
}, 3000);

  userIsInChannel = await getIfUserIsInChannel(channel, ud.fid)
  clearTimeout(timeout); // Clear the timeout if the function returns before 3 seconds
  console.log('User is in the channel:', userIsInChannel?.fid);
  
  console.log(channel, 'CHANNEL GOT HERE', reqId, 'reqId')
  switch (reqId) {
    case 'start':
      if(userIsInChannel?.fid){
        html =  generateFarcasterFrame(`${SERVER_URL}/${IMAGES.question1}`, 'question');
      }else {
        html =  generateFarcasterFrame(`${SERVER_URL}/${IMAGES.be_a_follower}`, 'error');
      }
    break
    case "question":
      if(channel && ud.inputText && ud.inputText.length){
        const user = await saveUser(ud, channel)
        const correctResponse = ud.inputText && ud.inputText.toLowerCase() === questionCorrectAnswer
        html = await saveUserQuestionResponse(ud, user.user_id, correctResponse as boolean)
      }
      else {
        console.log('NO SUBMISSION BY USER')
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
    default:
      html = generateFarcasterFrame(`${SERVER_URL}/${IMAGES.whale}`, 'whale')
      break
  }


  return response.send(html)
}
