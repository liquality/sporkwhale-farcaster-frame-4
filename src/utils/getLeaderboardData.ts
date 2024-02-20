import { getTraitForChannel } from '@/utils/database-operations'
import { levelImages } from '@/utils/image-paths'
import { sql } from '@vercel/postgres'

export const getLeaderboardData = async () => {
  const data = await sql`
  select c.id as clash_id,
       c.question_id, 
         q.question as question_text,
         c.channel1_id, 
         ch1.name as channel_name_1,
         c.channel2_id,
         ch2.name as channel_name_2,
         c.channel_winner_id
  
  from (
  select id, question_id, channel1_id, channel2_id, channel_winner_id
  from clashes 
  group by id, question_id, channel1_id, channel2_id, channel_winner_id
  order by question_id, channel1_id, channel2_id
  ) c
  join questions q 
  on q.id = c.question_id
  join channels ch1 
  on ch1.id = c.channel1_id
  join channels ch2 
  on ch2.id = c.channel2_id
  order by c.id;`

const result = data.rows.reduce((prev, curr) => {
    if(!prev[curr.question_id]) {
        prev[curr.question_id] = []
    }
    prev[curr.question_id].push(curr)
    return prev
}, {})

  return result
}
