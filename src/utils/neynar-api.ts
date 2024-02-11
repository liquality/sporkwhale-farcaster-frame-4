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

  export async function getIfUserIsInChannel(channel: string, fid: number): Promise<string | void> {
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
        `https://api.neynar.com/v2/farcaster/channel/followers?id=${channel}&limit=1000`,
        options
      )
      if (!resp.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await resp.json()
      console.log(data)

      if(data.users){
        const userInChannel = data.users.find((user: any) => {
          return user.fid === fid;
        })
        return userInChannel
      }else return 

      
    } catch (error) {
      return console.error('Error fetching profile data:', error)
    }
  }