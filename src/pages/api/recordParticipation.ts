import { NextApiRequest, NextApiResponse } from 'next'
import * as database from '@/utils/database-operations'
import {PoolParticipation, PoolParticipationMap } from '@/types'
import { recordParticipation } from '@/utils/contract-operations';
import { channel } from 'diagnostics_channel';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
 if(request.method == 'GET') {

    try {
    
        let channelID = (await database.getWinningChannel()).id
        if (!channelID) {
            return response.status(404).json({status: 'Ok', message: `No winning channel found! challenge not over yet!`})
        }
    
        // Get all participations from DB
        const channelParticipations = (await database.getParticipantsByChannel(channelID))

        // group participations by user, count the number of responses per user per question as engagement and return only one user record with the total engagement
        const participationsByUser = groupedParticipationsByUser(channelParticipations)
        // const participationsByCollectives: PoolParticipationMap = groupedParticipationsByCollectives(participationsByUser) 
        // // batch record participation by collectives onchain
        // for (const [key, participations] of Object.entries(participationsByCollectives)) {
        //     const [cAddress, cWalletAddress, poolAddress] = key.split('-')
        //     await recordParticipation(cAddress, cWalletAddress, poolAddress, participations)
        // }

        // batch record participation by collectives onchain
        let participations: PoolParticipation[] = []
        for (const participation of Object.values(participationsByUser)) {
            participations.push(participation)
        }
        await recordParticipation(participations[0].cAddress, participations[0].cWallet, participations[0].poolAddress, participations)

        // Update the user_question_responses table to mark the participations as onchain
        await updateParticipations(channelParticipations)

        return response.status(200).json({status: 'Ok', message: `${participations.length} Participation recorded onchain successfully!`})

  } catch (error) {
    console.error('Error creating collectives:', error)
    return response.status(500).json({ error })
  }
 }
}

// update the user_question_responses table to mark the participations as onchain
async function updateParticipations(participations: any) {
  try {
      for (const participation of participations) {
        database.updateParticipation(participation)
      }
  } catch (error) {
    console.error('Error updating participations:', error)
    throw error
  }
}

function groupedParticipationsByUser(participations: any) : PoolParticipationMap {
    const result = participations.reduce((acc: any, participation: any) => {
        const key = participation.address
        if (!acc[key]) {
        acc[key] = {
            cAddress: participation.caddress,
            cWallet: participation.cwallet,
            poolAddress: participation.pooladdress,
            questionId: participation.questionid,
            user: participation.address,
            engagement: 1
        }
        } else {
        acc[key].engagement += 1
        }
        return acc
    }, {})

return result
}

function groupedParticipationsByCollectives(participations: any) {
    const result = Object.values(participations).reduce((acc: PoolParticipationMap, participation: any) => {
    const key: string = `${participation.cAddress}-${participation.cWallet}-${participation.poolAddress}`
    if (!acc[key]) {
        acc[key]  = [
            {
                user: participation.user,
                questionId: participation.questionId,
                engagement: participation.engagement
            }
        ]
    } else {
        acc[key].push(
            {
                user: participation.user,
                questionId: participation.questionId,
                engagement: participation.engagement
            })
    }
    return acc
    }, {})
    return result
}