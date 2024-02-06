import { sql } from "@vercel/postgres"
import { generateFarcasterFrame, SERVER_URL } from "./generate-frames"
import {  TUntrustedData } from '../types'
import { getAddrByFid } from "./farcaster-api"

export async function saveQuestionResponse(ud: TUntrustedData) {
    const user = await saveUser(ud)
    const existingQuestionResponse =
      await sql`SELECT * FROM "question_responses" WHERE Fid = ${user.id}`
    console.log('existingquestion', existingQuestionResponse)
  
/*     if (existingQuestionResponse.rowCount > 0) {
      console.log('Feedback already submitted by fid:', ud.fid)
      return generateFarcasterFrame(`${SERVER_URL}/error.png`, 'error')
    } else {
      await sql`INSERT INTO "Feedback" (Fid, Text, isMinted) VALUES (${ud.fid}, ${ud.inputText}, false);`
      return generateFarcasterFrame(`${SERVER_URL}/mint.png`, 'mint')
    } */
  }

  export async function saveUser(ud: TUntrustedData) {
    const existingUser =
      await sql`SELECT * FROM "users" WHERE fid = ${ud.fid}`
    console.log('existingUser:::', existingUser)
    const walletAddress = await getAddrByFid(ud.fid)
    if(!existingUser && walletAddress){
      const newUser = await sql`INSERT INTO "users" (fid, wallet_address, channel) VALUES (${ud.fid}, ${walletAddress}, "ETHDenver");`
      console.log(newUser, 'what is new user?')
      return newUser
    }
    else return existingUser
  }