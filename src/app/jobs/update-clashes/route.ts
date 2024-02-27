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
    const winners = await sql`select s.clash_id,
    case when s.correct_percentage_ch1 > s.correct_percentage_ch2 then s.channel1_id 
      when s.correct_percentage_ch2 > s.correct_percentage_ch1 then s.channel2_id
    else (concat('[0:1]={', s.channel1_id, ',', s.channel2_id, '}')::int[])[trunc(random() * 2)::int] 
    end as winner_id
from (select c.id as clash_id,
        c.channel1_id, 
        c.channel2_id,
        (sum(case when ch1.correct_response is not true then 0 else 1 end)::decimal / count(coalesce(ch1.question_id, 0))::decimal) * 100 as correct_percentage_ch1,
        (sum(case when ch2.correct_response is not true then 0 else 1 end)::decimal / count(coalesce(ch2.question_id, 0))::decimal) * 100 as correct_percentage_ch2
  from clashes c
  left join user_question_responses ch1 
  on ch1.channel_id = c.channel1_id
  and ch1.question_id = c.question_id
   left join user_question_responses ch2 
  on ch2.channel_id = c.channel2_id
  and ch2.question_id = c.question_id
  where c.question_id = ${QUESTION_ID}
  --WHERE q.expires_at::timestamp AT TIME ZONE 'MST' < current_timestamp AT TIME ZONE 'MST';
  group by c.id, c.channel1_id, c.channel2_id
  order by channel1_id, channel2_id) as s;`

    const nextQuestionId = QUESTION_ID + 1
    console.log('nextQuestionId', nextQuestionId)
    const updateResults = await Promise.all(
      winners.rows.map((winner: any) => {
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
      console.log('winnersResult', winners.rowCount)
      if (winners && winners.rows.length > 0) {
        const winnerIds: number[] = winners.rows.map((r) => r.winner_id)
        const len = winners.rows.length
        for (let index = 0; index < len; index += 2) {
          const ch1 = winnerIds[index]
          const ch2 = winnerIds[index + 1]
          sql`
        INSERT INTO clashes
        (question_id, channel1_id, channel2_id, channel_winner_id)
        values
        (${nextQuestionId}, ${ch1}, ${ch2}, null)
          `
        }

        console.log('insert next clashes', winnerIds)
      }
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
