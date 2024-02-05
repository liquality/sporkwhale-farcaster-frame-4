import { syndicate } from '../config'
import { generateFarcasterFrame, SERVER_URL } from './generate-frames'



export async function mintWithSyndicate(fid: number) {
  const syndicateMintTx = await syndicate.transact.sendTransaction({
    projectId: '6ebd9b38-1d9a-41af-851d-ba796f882639',
    contractAddress: '0x930A544c651c8a137B60C0505415f3900CC143fc',
    chainId: 84532,
    functionSignature: 'mint(address to)',
    args: {
      to: await getAddrByFid(fid),
    },
  })

  console.log('Syndicate Transaction ID: ', syndicateMintTx.transactionId)

  // @todo loading frame so that nft has time to mint
  return generateFarcasterFrame(`${SERVER_URL}/redirect.png`, 'redirect')
}

