import * as collectiveSDK from '@liquality/my-collectives-sdk';
import * as ethers5 from 'ethers5';
import {CMetadata} from '../types';
import {HONEYPOT, COLLECTIVE_FACTORY, COLLECTIVE_ABI, COLLECTIVE_FACTORY_ABI} from './constants';


export async function createCollective(): Promise<CMetadata> {

    try {
        collectiveSDK.setConfig({
            RPC_URL: process.env.RPC_URL,
            PIMLICO_API_KEY: process.env.PIMLICO_API_KEY,
            AA_PROVIDER: collectiveSDK.AAProviders.PIMLICO,
        } as collectiveSDK.Config);

        const provider = getProvider();
        const signer = getSigner(provider);

        const cFactory = await getCFactory(signer);
        const salt = generateSalt();
        
        const cAddress = await cFactory.getCollective(signer.address, signer.address, salt)
        const cWallet = await cFactory.getCWallet(cAddress, signer.address, salt)

        const tx1 = await cFactory.createCollective(signer.address, signer.address, salt)
        await provider.waitForTransaction(tx1.hash, 3)
        
        const tx2 = await cFactory.createWallet(signer.address, signer.address, salt)
        await provider.waitForTransaction(tx2.hash, 3)


        return {address: cAddress, wallet: cWallet, salt};

    } catch (error) {
        throw new Error("Error creating collective: " + error);
    }


}

export async function createPool(cAddress: string) : Promise<string> {
    try {
        const provider = getProvider();
        const signer = getSigner(provider);

        const honeyPot = HONEYPOT!;
        const collective = await getCollective(signer, cAddress);

        const tx = await collective.createPools(["0x0000000000000000000000000000000000000000"], [honeyPot])
        await provider.waitForTransaction(tx.hash, 3)

        const pool = await collective.pools(honeyPot)
        return pool["id"]

    } catch (error) {
        throw new Error("Error creating pool: " + error);
    }

}

// async function getPool(signer: ethers5.ethers.Wallet, honeyPot: string) {
//     const collective = new ethers5.Contract(cAddress, COLLECTIVE_ABI, signer)
//     return collective;
// }

async function getCollective(signer: ethers5.ethers.Wallet, cAddress: string) {
    const collective = new ethers5.Contract(cAddress, COLLECTIVE_ABI, signer)
    return collective;
}

async function getCFactory(signer: ethers5.ethers.Wallet) {
    const cFactory = new ethers5.Contract(COLLECTIVE_FACTORY, COLLECTIVE_FACTORY_ABI, signer)
    return cFactory;
}

function getSigner(provider: ethers5.providers.JsonRpcProvider) {
    const signer = ethers5.Wallet.fromMnemonic(process.env.OPERATOR_MNEMONIC as string).connect(provider);
    return signer;
}

function getProvider() {
    const provider = new ethers5.providers.JsonRpcProvider(process.env.RPC_URL);
    return provider;
}

export function generateSalt(length: number = 16): number {
    const characters = '0123456789';
    const charactersLength = 4;
    let salt = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        salt += characters.charAt(randomIndex);
    }

    // Assuming you want to convert the string salt to a BigNumberish
    return Number(salt)
}
