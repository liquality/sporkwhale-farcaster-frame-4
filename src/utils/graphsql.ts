export async function fetchGraphql(
    url: string,
    headers: HeadersInit,
    method: string = 'POST',
    query: string,
    variables: any
  ): Promise<any | null> {
    try {
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      })
  
      const json = (await response.json()) as any
      if (!json?.data || json?.error) {
        console.error('GraphQL request failed with:', json?.error)
        return null
      }
  
      return json?.data
    } catch (error) {
      console.error('Error sending GraphQL request:', error)
      return null
    }
  }