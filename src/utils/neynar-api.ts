import { getConnectedAddrByFid } from './farcaster-api'
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
export async function getIfUserIsInChannelNeynar(
  channel: string,
  fid: number
): Promise<boolean> {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      api_key: 'NEYNAR_API_DOCS',
    },
  }

  try {
    // Fetch data with pagination cursor
    const resp = await fetch(
      `https://api.neynar.com/v2/farcaster/channel/user?fid=${fid}`,
      options
    )

    if (!resp.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await resp.json()

    const channelExists = data.channels.some(
      (channelArrayEntry: any) => channelArrayEntry.id === channel
    )

    if (channelExists) {
      console.log(`Channel ${channel} exists.`)
      return true
    } else {
      console.log(`Channel ${channel} does not exist.`)
      return false
    }
  } catch (error) {
    console.error('Error fetching isuserinchannel neynar data:', error)

    return false
  }
}

function findChannelIdByParentUrl(parentUrl: string) {
  const foundParent = PARENT_URLS.find((item) => item.parent_url === parentUrl)
  return foundParent ? foundParent.channel_id : null
}

export async function getAddrByFid(fid: number): Promise<string | void> {
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
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      options
    )

    if (!resp.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await resp.json()

    // Extract connected address if available, otherwise use address from body
    const verifiedEthAddress = data.users[0].verified_addresses.eth_addresses[0]
    console.log(verifiedEthAddress, 'verified eth addr')
    if (verifiedEthAddress) {
      return verifiedEthAddress
    } else {
      const connectedAddress = await getConnectedAddrByFid(fid)
      return connectedAddress
    }
  } catch (error) {
    return console.error('Error fetching profile data:', error)
  }
}
