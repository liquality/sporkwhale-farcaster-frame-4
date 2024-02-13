import { sql } from '@vercel/postgres'
import { generateFarcasterFrame, SERVER_URL } from './generate-frames'
import { TUntrustedData } from '../types'
import { getAddrByFid } from './farcaster-api'
import { IMAGES, levelImages } from './image-paths'
export const QUESTION_ID = 1

export async function saveUserQuestionResponse(
  ud: TUntrustedData,
  userId: number,
  correctResponse: boolean
) {
  //-----  WHEN TESTING COMMENT OUT THE DB SAVE QUESTION RESPONSE FOR NOW ----------------

  const existingQuestionResponse =
    await sql`SELECT * FROM "user_question_responses" WHERE user_id = ${userId}`
  console.log(
    existingQuestionResponse.rowCount,
    'row count for existing q response'
  )

  if (existingQuestionResponse.rowCount > 0) {
    console.log('Feedback already submitted by fid:', ud.fid)
    return generateFarcasterFrame(
      `${SERVER_URL}/${IMAGES.already_submitted}`,
      'error'
    )
  } else {
    await sql`INSERT INTO "user_question_responses" (question_id, user_id, correct_response, response) VALUES (${QUESTION_ID}, ${userId}, ${correctResponse}, ${ud.inputText});`
    if (correctResponse) {
      console.log('Got into correctresponse!')
      return generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.correct_response}`,
        'redirect'
      )
    } else {
      console.log('Got into wrong response!')

      return generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.wrong_response}`,
        'redirect'
      )
    }
  }
}

export async function saveUser(ud: TUntrustedData, channel: string) {
  //If the user does not exist in db and this channel, create a new one
  const existingUser =
    await sql`SELECT * FROM users WHERE fid = ${ud.fid} AND channel = ${channel} `
  const walletAddress = await getAddrByFid(ud.fid)
  if (!existingUser.rowCount && walletAddress) {
    await sql`INSERT INTO users (fid, wallet_address, channel) VALUES (${ud.fid}, ${walletAddress}, ${channel});`
    const selectedNewUser =
      await sql`SELECT * FROM users WHERE fid = ${ud.fid} AND channel = ${channel} `
    return selectedNewUser.rows[0]
  } else return existingUser.rows[0]
}

//TODO change this to 'over 30% of the channel (get total user length from neynar in a particular channel)
export async function calculateImageBasedOnChannelResponses(channel: string) {
  try {
    let newTrait = ''
    // Fetch current level of the channel from the database
    const currentLevelQuery =
      await sql`SELECT trait FROM trait_displayed WHERE channel = ${channel}`
    const currentTrait = currentLevelQuery.rows[0].trait

    // Determine the current level index based on the image path
    const currentLevel = Object.values(levelImages).indexOf(currentTrait)

    // Fetch total count of users in the specific channel
    const totalUsersQuery =
      await sql`SELECT COUNT(*) AS total_users FROM users WHERE channel = ${channel}`
    const totalUsersCount = totalUsersQuery.rows[0].total_users

    // Fetch count of users who responded in the specific channel
    const respondingUsersQuery =
      await sql`SELECT COUNT(DISTINCT user_id) AS responding_users FROM user_question_responses WHERE channel = ${channel}`
    const respondingUsersCount = respondingUsersQuery.rows[0].responding_users

    // Fetch count of correct responses in the specific channel
    const correctResponsesQuery =
      await sql`SELECT COUNT(*) AS correct_responses FROM user_question_responses WHERE channel = ${channel} AND correct_response = TRUE`
    const correctResponsesCount =
      correctResponsesQuery.rows[0].correct_responses

    // Calculate response percentages
    const respondingPercentage = (respondingUsersCount / totalUsersCount) * 100
    const correctPercentage =
      (correctResponsesCount / respondingUsersCount) * 100

    // Determine SporkWhale's status based on the conditions and update the trait displayed
    if (respondingPercentage > 30 && correctPercentage > 50) {
      // Move up a level
      const nextLevel = Math.min(
        currentLevel + 1,
        Object.keys(levelImages).length - 1
      )
      newTrait = levelImages[nextLevel]
      await sql`UPDATE trait_displayed SET trait = ${newTrait} WHERE channel = ${channel}`
    } else {
      // Move down a level
      const nextLevel = Math.max(currentLevel - 1, 0)
      newTrait = levelImages[nextLevel]
      await sql`UPDATE trait_displayed SET trait = ${newTrait} WHERE channel = ${channel}`
    }

    // Return new trait img
    return newTrait
  } catch (error) {
    console.error('Error calculating image based on channel responses:', error)
    throw error
  }
}
