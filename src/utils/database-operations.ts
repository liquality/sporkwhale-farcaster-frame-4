import { sql } from "@vercel/postgres"
import { generateFarcasterFrame, SERVER_URL } from "./generate-frames"
import {  TUntrustedData } from '../types'
import { getAddrByFid } from "./farcaster-api"
import { IMAGES } from "./utils";
export const QUESTION_ID = 1;

export async function saveUserQuestionResponse(ud: TUntrustedData, userId: number, correctResponse: boolean) {
  
  //-----  WHEN TESTING COMMENT OUT THE DB SAVE QUESTION RESPONSE FOR NOW ----------------
  /*   const existingQuestionResponse =
      await sql`SELECT * FROM "user_question_responses" WHERE user_id = ${userId}`
      console.log(existingQuestionResponse.rowCount, 'row count for existing q response')
   
      if (existingQuestionResponse.rowCount > 0) {
      console.log('Feedback already submitted by fid:', ud.fid)
      return generateFarcasterFrame(`${SERVER_URL}/${IMAGES.already_submitted}`, 'error')
    } else {
 
      await sql`INSERT INTO "user_question_responses" (question_id, user_id, correct_response, response) VALUES (${QUESTION_ID}, ${userId}, ${correctResponse}, ${ud.inputText});`*/
      if(correctResponse){
        return generateFarcasterFrame(`${SERVER_URL}/${IMAGES.correct_response}`, 'redirect')

      }else {
        return generateFarcasterFrame(`${SERVER_URL}/${IMAGES.wrong_response}`, 'redirect')

      }
    //} 
  }


  export async function saveUser(ud: TUntrustedData, channel: string) {
    //If the user does not exist in db and this channel, create a new one
    const existingUser =
      await sql`SELECT * FROM users WHERE fid = ${ud.fid} AND channel = ${channel} `
    const walletAddress = await getAddrByFid(ud.fid)
    if(!existingUser.rowCount && walletAddress){
      const newUser = await sql`INSERT INTO users (fid, wallet_address, channel) VALUES (${ud.fid}, ${walletAddress}, ${channel});`
      return newUser.rows[0]
    }
    else return existingUser.rows[0]
  }