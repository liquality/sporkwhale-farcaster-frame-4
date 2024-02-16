export async function getAddrByFid(fid: number): Promise<string | void> {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  try {
    // Searchcaster API
    const resp = await fetch(
      `https://searchcaster.xyz/api/profiles?fid=${fid}`,
      options
    )
    if (!resp.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await resp.json()
    console.log(data, 'wats data farcaster searc')

    // Extract connected address if available, otherwise use address from body
    const connectedAddress = data[0]?.connectedAddress || data[0]?.body.address

    return connectedAddress
  } catch (error) {
    return console.error('Error fetching profile data:', error)
  }
}
