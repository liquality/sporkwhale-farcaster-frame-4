import { TUserProfileNeynar } from '@/types'
import { PARENT_URLS } from './parent-urls-mapping'

export async function fetchFromNeynarApiHere(
  fid: number
): Promise<string | void> {}

export async function getChannelFromCastHash(
  castHash: string
): Promise<string | null> {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      api_key: 'NEYNAR_API_DOCS',
    },
  }

  try {
    // Searchcaster API
    const resp = await fetch(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${castHash}&type=hash`,
      options
    )
    if (!resp.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await resp.json()
    let channelName = ''
    if (data.cast.parent_url) {
      let parentUrl = data.cast.parent_url

      if (parentUrl.startsWith('chain')) {
        //TODO look up old parentUrl in the table and match
        channelName = findChannelIdByParentUrl(parentUrl) || 'no channel'
      } else {
        let parts = parentUrl.split('/')
        // Extract the last part (channel name)
        channelName = parts.pop()
      }

      return channelName
    } 
    return null
  } catch (error) {
    console.error('Error fetching profile data:', error)
    return null
  }
}

//TODO if this response takes more than > 5 seconds, we need to return a frame with 'refresh' btn
export async function getIfUserIsInChannel(
  channel: string,
  fid: number
): Promise<TUserProfileNeynar | null | undefined> {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      api_key: 'NEYNAR_API_DOCS',
    },
  }

  try {
    let cursor = '' // Initial cursor value
    let hasNextPage = true

    while (hasNextPage) {
      // Fetch data with pagination cursor
      const resp = await fetch(
        `https://api.neynar.com/v2/farcaster/channel/followers?id=${channel}&limit=1000&cursor=${cursor}`,
        options
      )

      if (!resp.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await resp.json()

      if (data.users) {
        // Find the user in the fetched page
        const userInChannel = data.users.find((user: any) => user.fid === fid)
        if (userInChannel) {
          console.log(userInChannel?.fid, 'user in channel')
          return userInChannel // Return the user if found
        }
      }

      // Check if there is another page
      if (data.next && data.next.cursor) {
        cursor = data.next.cursor
      } else {
        hasNextPage = false
      }
    }

    console.log('User not found in the channel.')
    return null // User not found
  } catch (error) {
    console.error('Error fetching profile data:', error)
  }
}

function findChannelIdByParentUrl(parentUrl: string) {
  const foundParent = PARENT_URLS.find((item) => item.parent_url === parentUrl)
  return foundParent ? foundParent.channel_id : null
}
