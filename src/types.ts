export type TSignedMessage = {
  untrustedData: {
    fid: number
    url: string
    messageHash: string
    timestamp: number
    network: number
    inputText: string
    buttonIndex: number
    castId: { fid: number; hash: string }
  }
  trustedData?: {
    messageBytes: string
  }
}

export type TUntrustedData = {
  fid: number
  url: string
  messageHash: string
  timestamp: number
  network: number
  inputText: string
  buttonIndex: number
  castId: { fid: number; hash: string }
}

export type TPostData =
  | 'start'
  | 'question'
  | 'error-see-leaderboard'
  | 'error-be-a-follower'

export type TUserProfileNeynar = {
  object: 'user'
  fid: number
  custody_address: string
  username: string
  display_name: string
  pfp_url: string
  profile: {
    bio: {
      text: string
    }
  }
  follower_count: number
  following_count: number
  verifications: string[]
  active_status: 'active' | 'inactive'
}

export interface LevelImages {
  [key: string]: string
}

export type Leaderboard = {
  channel: string
  image: string
  level: number
}

export type CMetadata = {
  address: string
  wallet: string
  salt: number
}

export type PoolParticipation = {
  user: string
  questionId: number
  engagement: number
}

export interface PoolParticipationMap {
  [key: string]: PoolParticipation[]
}
