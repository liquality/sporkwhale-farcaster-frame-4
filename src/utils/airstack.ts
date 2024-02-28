import { fetchGraphql } from './graphsql'

export const AIRSTACK_ENDPOINT = 'https://api.airstack.xyz/gql'

export async function getIfUserIsInChannelAirstack(
  channel: string,
  fid: number
): Promise<any> {
  const query = `query Query($participant: Identity, $channelId: String) {
        FarcasterChannelParticipants(
          input: {
                filter: { participant: { _eq: $participant }, 
                channelId: { _eq: $channelId } }, 
                blockchain: ALL 
            }
        ) {
          FarcasterChannelParticipant {
            channelActions
            channelName
            channelId
          }
        }
      }`
  const variables = {
    participant: `fc_fid:${fid}`,
    channelId: channel,
  }
  const data = await fetchGraphql(
    AIRSTACK_ENDPOINT,
    {
      'Content-Type': 'application/json',
      Authorization: process.env.AIRSTACK_API_KEY || '',
    },
    'POST',

    query,
    variables
  )

  if (data?.FarcasterChannelParticipants?.FarcasterChannelParticipant) {
    const actions =
      data?.FarcasterChannelParticipants?.FarcasterChannelParticipant?.map(
        (a: any) => a.channelActions
      )?.flat(1) || []
    console.log('actions', actions)

    return actions && (actions.includes('reply') || actions.includes('cast'))
  }
  return false
}
