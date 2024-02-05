import { sql } from "@vercel/postgres"
import { generateFarcasterFrame, SERVER_URL } from "./generate-frames"
import {  TUntrustedData } from '../types'

export async function saveTextInput(ud: TUntrustedData) {
    const existingFeedback =
      await sql`SELECT * FROM "Feedback" WHERE Fid = ${ud.fid}`
    console.log('existingFeedback', existingFeedback)
  
    if (existingFeedback.rowCount > 0) {
      console.log('Feedback already submitted by fid:', ud.fid)
      return generateFarcasterFrame(`${SERVER_URL}/error.png`, 'error')
    } else {
      await sql`INSERT INTO "Feedback" (Fid, Text, isMinted) VALUES (${ud.fid}, ${ud.inputText}, false);`
      return generateFarcasterFrame(`${SERVER_URL}/mint.png`, 'mint')
    }
  }