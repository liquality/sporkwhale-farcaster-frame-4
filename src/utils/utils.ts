import { syndicate } from '../config'
import { getAddrByFid } from './farcaster-api'
import { generateFarcasterFrame, SERVER_URL } from './generate-frames'



export async function mintWithSyndicate(fid: number) {
/*   const syndicateMintTx = await syndicate.transact.sendTransaction({
    projectId: '6ebd9b38-1d9a-41af-851d-ba796f882639',
    contractAddress: '0x930A544c651c8a137B60C0505415f3900CC143fc',
    chainId: 84532,
    functionSignature: 'mint(address to)',
    args: {
      to: await getAddrByFid(fid),
    },
  }) */


  // @todo loading frame so that nft has time to mint
  return generateFarcasterFrame(`${SERVER_URL}/redirect.png`, 'redirect')
}

export const IMAGES = {
  slightly_sad: "slightly_sad_whale_3_traits.png",
  slightly_happy: "slightly_happy_whale_5_traits.png", 
  question1: "johannas_lastname_question1.png",
  question1_sad: "question1_sad.png",
  question1_happy: "question1_happy.png",

  whale: "start_whale_neutral_4_traits.png",

  wrong_response: "wrong_response.png",
  correct_response: "correct_response.png",
  already_submitted: "already_submitted.png"
}

