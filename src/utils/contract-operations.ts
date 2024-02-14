import * as collectiveSDK from '@liquality/my-collectives-sdk';
import ethers5 from 'ethers5';
import {CMetadata} from '../types';
import {HONEYPOT, COLLECTIVE_FACTORY, COLLECTIVE_ABI, COLLECTIVE_FACTORY_ABI} from './constants';





export async function createCollective(): Promise<CMetadata> {

    try {
        collectiveSDK.setConfig({
            RPC_URL: process.env.RPC_URL,
            PIMLICO_API_KEY: process.env.PIMLICO_API_KEY,
            AA_PROVIDER: collectiveSDK.AAProviders.PIMLICO,
        } as collectiveSDK.Config);
    
        const signer = getSigner();
        const cFactory = await getCFactory(signer);
        const salt = generateSalt();
    
        const cAddress = await cFactory.getCollective(signer.address, signer.address, salt)
        const cWallet = await cFactory.getWallet(cAddress, signer.address, salt)
        
        const tx1 = await cFactory.createWallet(cAddress, signer.address, salt)
        await tx1.wait()
        if (tx1.confirmations >1 ) {
            const tx2 = await cFactory.createCollective(signer.address, signer.address, salt)
            await tx2.wait()
        }

        return {address: cAddress, wallet: cWallet, salt};

    } catch (error) {
        throw new Error("Error creating collective: " + error);
        
    }


}

export async function createPool(cAddress: string) {
    try {
        const signer = getSigner();
        const honeyPot = HONEYPOT!;
        const collective = await getCollective(cAddress);

        const tx = await collective.createPools([""], [honeyPot])
        await tx.wait()

        const pool = await collective.getPools(honeyPot)
        console.log(pool.id, " << pool id")
        return pool.id

    } catch (error) {
        throw new Error("Error creating pool: " + error);
    }

}

async function getCollective(cAddress: string) {
    const collective = new ethers5.Contract(cAddress, COLLECTIVE_ABI, getSigner())
    return collective;
}

async function getCFactory(signer : ethers5.ethers.Wallet) {
    const cFactory = new ethers5.Contract(COLLECTIVE_FACTORY, COLLECTIVE_FACTORY_ABI, getSigner())
    return cFactory;
}

function getSigner() {
    const provider = new ethers5.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = ethers5.Wallet.fromMnemonic(process.env.OPERATOR_MNEMONIC as string).connect(provider);
    return signer;
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
