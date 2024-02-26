import { NextApiRequest, NextApiResponse } from 'next'
import * as database from '@/utils/database-operations'
import { QueryResultRow } from '@vercel/postgres'
import { batchWithdrawRewards, distributeRewards, sendRewardToTopCollective, setTopCollective } from '@/utils/contract-operations'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
 if(request.method == 'GET') {
    if (request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return response.status(401).end('Unauthorized');
    }
    
    try {
    
        // const channels = await database.fetchChannels()

        // Decide the winning channel
        const winningChannel = await getWinningChannel()
        if (!winningChannel) {
            return response.status(404).json({status: 'Ok', message: `No winning channel found! No channel met the criteria`})
        }
        console.log('winningChannel:', winningChannel)
        
        // Set the topContributor onchain
        const topContributorHash = await setTopCollective(winningChannel.cwallet)

        // send reward from honeyPot to topContributor
        const sendRewardHash = await sendRewardToTopCollective()

        // // distribute rewards in pool
        const distributeRewardsHash = await distributeRewards(winningChannel.pooladdress)
        
        // Get all participants for winning channel / collective
        const participants = await database.getParticipantsByChannel(winningChannel.id)
        console.log('Winning participants:', participants)
        await batchWithdrawRewards(winningChannel.cwallet, winningChannel.pooladdress, participants)

        return response.status(200).json({status: 'Ok', message: `Rewards sent successfully!`})
    
  } catch (error) {
    console.error('Error sending rewards:', error)
    return response.status(500).json({ error })
  }
 }
}

// get winning channel
async function getWinningChannel() : Promise<QueryResultRow | null> {

    // let winningChannel: QueryResultRow | null = null
    // let highestCorrectPercentage = 0
    // for (const channel of channels) {
    //     const {respondingPercentage, correctPercentage} = await database.getChannelStats(channel)
    //     console.log('respondingPercentage:', respondingPercentage, 'correctPercentage:', correctPercentage)
    //     if (respondingPercentage >= 30 && correctPercentage >= 50) {
    //         if (correctPercentage > highestCorrectPercentage) {
    //             highestCorrectPercentage = correctPercentage
    //             winningChannel = channel
    //         }
    //     }
    // }

    let channelName = (await database.getWinningChannel()).name
    let winningChannel = database.getChannel(channelName)

    return winningChannel
}