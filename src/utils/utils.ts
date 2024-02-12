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
  question1: "johannas_lastname_question1.png",
  whale: "start_whale_neutral_4_traits.png",

  wrong_response: "wrong_response.png",
  correct_response: "correct_response.png",
  already_submitted: "already_submitted.png",
  be_a_follower: "be_a_follower.png",

  //Level images
  negative1: "bathingSuit_chain_bracelet_whale.png",
  negative2: "chain_bracelet_whale.png",
  negative3: "bracelet_whale.png",
  negative4: "naked_whale.png",

  0: "glasses_bracelet_chain_bathingSuit_whale.png",
  1: "glasses_bracelet_chain_bathingSuit_laserEyes_whale.png",
  2: "glasses_bracelet_chain_bathingSuit_laserEyes_headSet_whale.png",
  3: "glasses_bracelet_chain_bathingSuit_laserEyes_headSet_diamondHands_whale.png",
  4: "glasses_bracelet_chain_bathingSuit_laserEyes_headSet_diamondHands_crown_whale.png",



}

