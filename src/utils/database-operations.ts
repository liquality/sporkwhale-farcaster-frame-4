import { sql } from '@vercel/postgres'
import { generateFarcasterFrame, SERVER_URL } from './generate-frames'
import { TUntrustedData } from '../types'
import { getAddrByFid } from './farcaster-api'
import { IMAGES, levelImages } from './image-paths'
import { QUESTION_ID } from './question'

export async function saveUserQuestionResponse(
  ud: TUntrustedData,
  userId: number,
  correctResponse: boolean,
  response: string
) {
  //-----  WHEN TESTING COMMENT OUT THE DB SAVE QUESTION RESPONSE FOR NOW ----------------

  const existingQuestionResponse =
    await sql`SELECT * FROM "user_question_responses" WHERE user_id = ${userId}`

  if (existingQuestionResponse.rowCount > 0) {
    console.log('Feedback already submitted by fid:', ud.fid)
    return generateFarcasterFrame(
      `${SERVER_URL}/${IMAGES.already_submitted}`,
      'error-see-leaderboard',
      'Go to leaderboard'
    )
  } else {
    await sql`INSERT INTO "user_question_responses" (question_id, user_id, correct_response, response) VALUES (${QUESTION_ID}, ${userId}, ${correctResponse}, ${response});`
    if (correctResponse) {
      console.log('Got into correctresponse!')

      return generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.correct_response}`,
        'error-see-leaderboard'
      )
    } else {
      console.log('Got into wrong response!')

      return generateFarcasterFrame(
        `${SERVER_URL}/${IMAGES.wrong_response}`,
        'error-see-leaderboard'
      )
    }
  }
}

export async function saveUser(ud: TUntrustedData, channelName: string) {
  const channel = await getChannel(channelName)
  //If the user does not exist in db and this channel, create a new one
  const existingUser = await sql`SELECT * FROM users WHERE fid = ${ud.fid}`
  console.log(ud.fid, 'wats fid?')
  const walletAddress = await getAddrByFid(ud.fid)
  if (!existingUser.rowCount && walletAddress) {
    await sql`INSERT INTO users (fid, wallet_address) VALUES (${ud.fid}, ${walletAddress});`
    const selectedNewUser = await sql`SELECT * FROM users WHERE fid = ${ud.fid}`
    return selectedNewUser.rows[0]
  } else return existingUser.rows[0]
}

export async function getChannel(channel: string) {
  const existingChannel =
    await sql`SELECT * FROM channels WHERE name = ${channel}`
  return existingChannel.rows[0]
}

export async function getTraitForChannel(channelName: string) {
  const channel = await getChannel(channelName)

  const currentTraitStatus =
    await sql`SELECT * FROM trait_displayed WHERE channel_id = ${channel.id}`
  return currentTraitStatus.rows[0].trait
}

export async function getQuestionFromId(questionId: number) {
  const question = await sql`
  SELECT * FROM questions
  WHERE id = ${questionId}
  AND expires_at::timestamp AT TIME ZONE 'MST' > current_timestamp AT TIME ZONE 'MST';
  `
  return question.rows.length > 0 ? question.rows[0] : null
}

export async function getQuestions(excludeExpired: boolean = true) {
  let query = 'SELECT * FROM questions'
  if (excludeExpired) {
    query = `${query} WHERE expires_at::timestamp AT TIME ZONE 'MST' > current_timestamp AT TIME ZONE 'MST';`
  }
  const questions = await sql`${query}`
  return questions.rows
}

export async function calculateImageBasedOnChannelResponses(
  channelName: string
) {
  try {
    const channel = await getChannel(channelName)
    const channelFollowerCount = channel.followers

    let newTrait = ''
    // Fetch current level of the channel from the database
    const currentLevelQuery =
      await sql`SELECT trait FROM trait_displayed WHERE channel_id = ${channel.id}`
    const currentTrait = currentLevelQuery.rows[0].trait

    // Determine the current level index based on the image path
    const currentLevel = Object.values(levelImages).indexOf(currentTrait)

    // Fetch total count of users in the specific channel
    const totalUsersQuery =
      await sql`SELECT COUNT(*) AS total_users FROM user_question_responses WHERE channel_id = ${channel.id}`
    const totalUsersCount = totalUsersQuery.rows[0].total_users

    // Fetch count of correct responses in the specific channel
    const correctResponsesQuery =
      await sql`SELECT COUNT(*) AS correct_responses FROM user_question_responses WHERE channel_id = ${channel.id} AND correct_response = TRUE`
    const correctResponsesCount =
      correctResponsesQuery.rows[0].correct_responses

    console.log(correctResponsesCount, 'correct responses count')
    console.log(
      channelFollowerCount,
      'channelfollowercount and totaluserscount:',
      totalUsersCount
    )
    // Calculate response percentages
    const respondingPercentage = (totalUsersCount / channelFollowerCount) * 100
    const correctPercentage = (correctResponsesCount / totalUsersCount) * 100

    console.log(respondingPercentage, 'responding percentage!!!!!!!!!!')
    console.log(correctPercentage, 'correct percentage!!!!!!!!!!!!')

    // Determine SporkWhale's status based on the conditions and update the trait displayed
    if (respondingPercentage > 10 && correctPercentage > 50) {
      // Move up a level
      const nextLevel = Math.min(
        currentLevel + 1,
        Object.keys(levelImages).length - 1
      )
      newTrait = levelImages[nextLevel]
      await sql`UPDATE trait_displayed SET trait = ${newTrait} WHERE channel_id = ${channel.id}`
    } else {
      // Move down a level
      const nextLevel = Math.max(currentLevel - 1, 0)
      newTrait = levelImages[nextLevel]
      await sql`UPDATE trait_displayed SET trait = ${newTrait} WHERE channel_id = ${channel.id}`
    }

    // Return new trait img
    return newTrait
  } catch (error) {
    console.error('Error calculating image based on channel responses:', error)
    throw error
  }
}

export async function createChannel(
  name: string,
  followers: number,
  cAddress: string,
  cWallet: string,
  cPool: string,
  salt: number
) {
  try {
    await sql`INSERT INTO channels (name, followers, c_address, c_wallet, c_pool, salt) 
      VALUES (${name}, ${followers}, ${cAddress}, ${cWallet}, ${cPool}, ${salt})
      ON CONFLICT (name)
      DO NOTHING;;`
  } catch (error) {
    console.error('Error creating collective:', error)
    throw error
  }
}

// getParticipations fromt the user_question_responses table, group by channel_id, and count the number of responses per user per question
export async function getParticipations() {
  const participations = await sql`
  SELECT 
    channels.c_address As cAddress, 
    channels.c_wallet As cWallet, 
    channels.c_pool As poolAddress, 
    user_question_responses.question_id as questionId, 
    users.wallet_address AS user,
    users.id AS userId,
    channels.id AS channelId
  FROM 
    user_question_responses
  LEFT JOIN 
    users ON user_question_responses.user_id = users.id
  LEFT JOIN 
    channels ON user_question_responses.channel_id = channels.id
  WHERE 
    user_question_responses.is_onchain = false
  GROUP BY 
    channels.c_address, channels.c_wallet, channels.c_pool, user_question_responses.question_id, users.wallet_address, users.id, channels.id;
  `
  return participations
}

// Update the user_question_responses table to mark the participations as onchain
export async function updateParticipation(participation: any) {
  try {
    await sql`UPDATE user_question_responses SET is_onchain = true WHERE 
    user_id = ${participation.userid} AND question_id = ${participation.questionid} AND 
    channel_id = ${participation.channelid};`
    return true
  } catch (error) {
    console.error(
      `Error updating participation: ${JSON.stringify(
        participation
      )}; Error: ${JSON.stringify(error)}`
    )
    return false
  }
}
