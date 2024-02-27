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

    const setWinners = await sql`
      update public.clashes
      set channel_winner_id = winners.winner_id
      from (
        select s.clash_id,
        case when s.correct_percentage_ch1 > s.correct_percentage_ch2 then s.channel1_id 
          when s.correct_percentage_ch2 > s.correct_percentage_ch1 then s.channel2_id
        else (concat('[0:1]={', s.channel1_id, ',', s.channel2_id, '}')::int[])[trunc(random() * 2)::int] 
        end as winner_id
    from (select c.id as clash_id,
            c.channel1_id, 
            c.channel2_id,
            (sum(case when ch1.correct_response is not true then 0 else 1 end)::decimal / count(coalesce(ch1.question_id, 0))::decimal) * 100 as correct_percentage_ch1,
            (sum(case when ch2.correct_response is not true then 0 else 1 end)::decimal / count(coalesce(ch2.question_id, 0))::decimal) * 100 as correct_percentage_ch2
      from public.clashes c
      left join public.user_question_responses ch1 
      on ch1.channel_id = c.channel1_id
      and ch1.question_id = c.question_id
       left join public.user_question_responses ch2 
      on ch2.channel_id = c.channel2_id
      and ch2.question_id = c.question_id
      where c.question_id = ${QUESTION_ID}
      --WHERE q.expires_at::timestamp AT TIME ZONE 'MST' < current_timestamp AT TIME ZONE 'MST';
      group by c.id, c.channel1_id, c.channel2_id
      order by channel1_id, channel2_id) as s
      ) as winners 
      where winners.clash_id = id
      and channel_winner_id is null;`
    console.log('setWinners.rowCount', setWinners.rowCount)

    const nextQuestionId = QUESTION_ID + 1
    console.log('nextQuestionId', nextQuestionId)

    const updateCurrentLevel = await sql`
        update public.channels ch
        set question_id = ${nextQuestionId}
        from public.clashes cl
        where cl.question_id = ${QUESTION_ID}
        and cl.channel_winner_id = ch.id
        and ch.question_id = ${QUESTION_ID};`
    console.log('Update current channel levels', updateCurrentLevel.rowCount)

    if (nextQuestionId < 5) {
      const winnersResult = await sql`
    SELECT channel_winner_id
    FROM public.clashes
    where question_id  = ${QUESTION_ID}
    AND channel_winner_id IS NOT NULL
    ORDER BY channel_winner_id;`
      console.log('winnersResult', winnersResult.rows)
      if (winnersResult && winnersResult.rows.length > 0) {
        const winnerIds: number[] = winnersResult.rows.map(
          (r) => r.channel_winner_id
        )
        const halfIndex = winnerIds.length / 2
        const groups = [
          winnerIds.slice(0, halfIndex),
          winnerIds.slice(halfIndex),
        ]
        console.log(groups)
        // divide channels in two chunks

        for (const group of groups) {
          const half = group.length / 2
          const ch1 = group.slice(0, half)
          const ch2 = group.slice(half)
          await Promise.all(
            ch1.map((channel, index) => {
              return sql`
        INSERT INTO public.clashes
        (question_id, channel1_id, channel2_id, channel_winner_id)
        values
        (${nextQuestionId}, ${channel}, ${ch2[index]}, null)
          `
            })
          )
        }

        console.log('insert next clashes', winnerIds)
      }
    }
    return NextResponse.json({
      updateWinnersCount: setWinners.rowCount,
      updateLevelCount: updateCurrentLevel.rowCount,
      nextQuestionId,
    })
  } catch (error) {
    console.log(error, 'Error seeding data!')
    return NextResponse.json({ error }, { status: 500 })
  }
}
