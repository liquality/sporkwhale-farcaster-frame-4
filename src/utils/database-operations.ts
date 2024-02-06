import { sql } from "@vercel/postgres"
import { generateFarcasterFrame, SERVER_URL } from "./generate-frames"
import {  TUntrustedData } from '../types'
import { getAddrByFid } from "./farcaster-api"
import { channel } from "diagnostics_channel"

export async function saveQuestionResponse(ud: TUntrustedData) {
    //const user = await saveUser(ud)
    const existingQuestionResponse =
      await sql`SELECT * FROM "question_responses" WHERE user_id = ${1}`
  
/*     if (existingQuestionResponse.rowCount > 0) {
      console.log('Feedback already submitted by fid:', ud.fid)
      return generateFarcasterFrame(`${SERVER_URL}/error.png`, 'error')
    } else {
      await sql`INSERT INTO "Feedback" (Fid, Text, isMinted) VALUES (${ud.fid}, ${ud.inputText}, false);`
      return generateFarcasterFrame(`${SERVER_URL}/mint.png`, 'mint')
    } */
  }

  export async function saveUser(ud: TUntrustedData, channel: string) {
    //If the user does not exist in db and this channel, create a new one
    const existingUser =
      await sql`SELECT * FROM users WHERE fid = ${ud.fid} AND channel = ${channel} `
    const walletAddress = await getAddrByFid(ud.fid)
    if(!existingUser.rowCount && walletAddress){
      const newUser = await sql`INSERT INTO users (fid, wallet_address, channel) VALUES (${ud.fid}, ${walletAddress}, ${channel});`
      return newUser
    }
    else return existingUser
  }