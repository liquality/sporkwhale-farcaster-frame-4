// Backend functions only
import { Message, getSSLHubRpcClient } from '@farcaster/hub-nodejs'

export async function validateMessage(messageBytes: string | undefined) {
  if (!messageBytes) return false

  const client = getSSLHubRpcClient('nemes.farcaster.xyz:2283')
  const hubMessage = Message.decode(Buffer.from(messageBytes, 'hex'))
  const res = await client.validateMessage(hubMessage)

  if (res.isOk() && res.value.valid) {
    return true
  } else {
    return false
  }
}

export async function validateMsgWithNeynar(
  messageBytes: string | undefined
): Promise<any> {
  if (!messageBytes) return false

  const postData = {
    cast_reaction_context: false,
    follow_context: false,
    message_bytes_in_hex: messageBytes,
  }

  const url = 'https://api.neynar.com/v2/farcaster/frame/validate'
  const apiKey = 'NEYNAR_API_DOCS'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        api_key: apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData.valid
  } catch (error) {
    console.error('Error validating frame:', error)
    throw error
  }
}
