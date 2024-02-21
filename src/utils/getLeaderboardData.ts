import { sql } from '@vercel/postgres'

export const getLeaderboardData = async () => {
  const clashesQuery = sql`
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

  const responsesQuery = sql`
  select question_id, 
	   channel_id, 
	   cast(count(question_id) as integer) as total, 
	   cast(sum(case when correct_response='True' then 1 else 0 end) as integer) as correct,
       cast(sum(case when correct_response='False' then 1 else 0 end) as integer) as incorrect,
       cast(sum(case when correct_response='True' then 1 else 0 end) / count(question_id) as integer) * 100 as correct_percentage
from user_question_responses
group by question_id, channel_id;`

  const [clashesResult, responsesResult] = await Promise.all([
    clashesQuery,
    responsesQuery,
  ])
  const data = clashesResult.rows.reduce((prev, curr) => {
    if (!prev[curr.question_id]) {
      prev[curr.question_id] = []
    }
    let responses = {}
    const channel1Responses = responsesResult.rows.find(
      (p) =>
        p.question_id === curr.question_id && p.channel_id === curr.channel1_id
    )
    const channel2Responses = responsesResult.rows.find(
      (p) =>
        p.question_id === curr.question_id && p.channel_id === curr.channel2_id
    )
    responses = {
      [curr.channel1_id]: channel1Responses,
      [curr.channel2_id]: channel2Responses,
    }

    prev[curr.question_id].push({ ...curr, responses })
    return prev
  }, {})
  return data
}
