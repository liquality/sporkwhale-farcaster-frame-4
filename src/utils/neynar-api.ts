export async function fetchFromNeynarApiHere(fid: number): Promise<string | void> {}



export async function getChannelFromCastHash(castHash: string): Promise<string | void> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        api_key: 'NEYNAR_API_DOCS'
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

      if(data.cast.parent_url){
        let parentUrl = data.cast.parent_url;    
        let parts = parentUrl.split('/');
        // Extract the last part (channel name)
        let channelName = parts.pop();
        return channelName
      }else return 
   
      
  
      
    } catch (error) {
      return console.error('Error fetching profile data:', error)
    }
  }