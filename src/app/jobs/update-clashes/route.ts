import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

const QUESTION_ID = parseInt(process.env.QUESTION_ID || '')
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      })
    }
    const responsesChannel1 = await sql`select c.id,
    c.channel1_id as channel_id, 
    count(qr.id) as correct_amount
from clashes c
join user_question_responses qr 
on qr.channel_id = c.channel1_id
and qr.question_id = c.question_id
and qr.correct_response is true 
where c.question_id = 1
and c.channel_winner_id is null
group by c.id, c.channel1_id;`

    const responsesChannel2 = await sql`select c.id,
    c.channel2_id as channel_id, 
    count(qr.id) as correct_amount
from clashes c
join user_question_responses qr 
on qr.channel_id = c.channel2_id
and qr.question_id = c.question_id
and qr.correct_response is true 
where c.question_id = 1
and c.channel_winner_id is null
group by c.id, c.channel2_id;`

    // merge the winners
    const winners = responsesChannel1.rows.map((ch1: any) => {
      const ch2 = responsesChannel2.rows.find((r) => r.id === ch1.id)
      let winner_id
      if (ch1.correct_amount > ch2?.correct_amount) {
        winner_id = ch1.channel_id
      } else if (ch2?.correct_amount > ch1.correct_amount) {
        winner_id = ch2?.channel_id
      } else {
        const rand = Math.floor(Math.random() * (3 - 1) + 1)
        winner_id = rand === 1 ? ch1.channel_id : ch2?.channel_id
      }

      return {
        clash_id: ch1.id,
        channel1_id: ch1.channel_id,
        channel2_id: ch2?.channel_id,
        winner_id,
      }
    })
    console.log({ winners })
    const nextQuestionId = QUESTION_ID + 1
    console.log('nextQuestionId', nextQuestionId)
    const updateResults = await Promise.all(
      winners.map((winner: any) => {
        return Promise.all([
          sql`
            update clashes
            set channel_winner_id = ${winner.winner_id}
            where id = ${winner.clash_id}
            and channel_winner_id is null;`,
          sql`
            update channels ch
            set question_id = ${nextQuestionId}
            from clashes cl
            where cl.question_id = ${QUESTION_ID}
            and cl.channel_winner_id = ch.id
            and ch.question_id = ${QUESTION_ID};`,
        ])
      })
    )
    console.log('updateResults', updateResults)

    if (nextQuestionId < 5) {
      console.log('winnersResult', winners.length)
      // if (winners && winners.length > 0) {
      //   const winnerIds: number[] = winners.map((r) => r.winner_id)
      //   const len = winners.length
      //   for (let index = 0; index < len; index += 2) {
      //     const ch1 = winnerIds[index]
      //     const ch2 = winnerIds[index + 1]
      //     sql`
      //   INSERT INTO clashes
      //   (question_id, channel1_id, channel2_id, channel_winner_id)
      //   values
      //   (${nextQuestionId}, ${ch1}, ${ch2}, null)
      //     `
      //   }

      //   console.log('insert next clashes', winnerIds)
      // }
    }
    return NextResponse.json({
      updateWinnersCount: updateResults.map((q) => q.map((s) => s.rowCount)),
      nextQuestionId,
    })
  } catch (error) {
    console.log(error, 'Error seeding data!')
    return NextResponse.json({ error }, { status: 500 })
  }
}
