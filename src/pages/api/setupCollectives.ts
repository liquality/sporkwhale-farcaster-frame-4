import { NextApiRequest, NextApiResponse } from 'next'
import * as database from '@/utils/database-operations'
import { createCollective, createPool } from '@/utils/contract-operations'
import {SUPPORTED_CHANNELS } from '../../utils/constants'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
 if(request.method == 'GET') {
    try {

    for (const channel in SUPPORTED_CHANNELS) {

        // Deploy a new collective and pool for each channel
        const cMetadata = await createCollective()
        const cPool = await createPool(cMetadata.address)

        database.createCollective(channel, cMetadata.address, cMetadata.wallet, cPool, cMetadata.salt)
    }

    return response.status(200).json({status: 'Ok', message: 'Collectives created successfully'})

  } catch (error) {
    return response.status(500).json({ error })
  }
 }
}
