import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { calculateImageBasedOnChannelResponses } from '@/utils/database-operations'

//TODO @Bradley run/update this every day 10am MST using a scheduler

//Example call: http://localhost:3000/api/updateTraitStatus?channel=cryptostocks
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      })
    }

    const channelsQuery = await sql`SELECT * FROM channels;`
    const channels = channelsQuery.rows
    const responseArray = []

    for (const channel of channels) {
      const newTrait = await calculateImageBasedOnChannelResponses(channel.name)
      responseArray.push({ channel: channel.name, image: newTrait })
    }

    return NextResponse.json(responseArray)
  } catch (error) {
    console.log(error, 'Error seeding data!')
    return NextResponse.json({ error }, { status: 500 })
  }
}
