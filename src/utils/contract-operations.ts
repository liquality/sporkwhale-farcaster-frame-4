import * as collectiveSDK from '@liquality/my-collectives-sdk';
import * as ethers5 from 'ethers5';
import {CMetadata, PoolParticipation} from '../types';
import {HONEYPOT, COLLECTIVE_FACTORY, COLLECTIVE_ABI, COLLECTIVE_FACTORY_ABI, POOL_ABI, C_WALLET_ABI} from './constants';


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
        await provider.waitForTransaction(tx1.hash, 3, 2000)
        
        const tx2 = await cFactory.createWallet(signer.address, signer.address, salt)
        await provider.waitForTransaction(tx2.hash, 3, 2000)

        console.log("Collective created successfully! ", tx1, tx2);

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
        const collective = getCollective(signer, cAddress);

        const tx = await collective.createPools(["0x0000000000000000000000000000000000000000"], [honeyPot])
        await provider.waitForTransaction(tx.hash, 3, 2000)
        console.log("Pool created successfully! ", tx.hash);

        const pool = await collective.pools(honeyPot)
        return pool["id"]

    } catch (error) {
        throw new Error("Error creating pool: " + error);
    }

}

export async function recordParticipation(cAddress: string, cWalletAddress: string, poolAddress: string, participations: PoolParticipation[]) {
    try {
        const provider = getProvider();
        const signer = getSigner(provider);

        const cWallet = getCWallet(signer, cWalletAddress);
        let data: string[] = []
        let value: number[] = []
        let dest: string[] = []

        for (const participation of participations) {
            const callData = getRecordPoolMintCallData(poolAddress, participation.user, participation.questionId, participation.engagement)
            data.push(callData)
            value.push(0)
            dest.push(cAddress)
        }

        const tx = await cWallet.executeBatch(dest, value, data)
        await provider.waitForTransaction(tx.hash, 3, 2000)
        console.log("Participation recorded onchain successfully! ", tx.hash);

    } catch (error) {
        throw new Error("Error recording participation: " + error);
    }


}

async function getPool(signer: ethers5.ethers.Wallet, poolAddress: string) {
    const pool = new ethers5.Contract(poolAddress, POOL_ABI, signer)
    return pool;
}

function getCollective(signer: ethers5.ethers.Wallet, cAddress: string) {
    const collective = new ethers5.Contract(cAddress, COLLECTIVE_ABI, signer)
    return collective;
}

function getCFactory(signer: ethers5.ethers.Wallet) {
    const cFactory = new ethers5.Contract(COLLECTIVE_FACTORY, COLLECTIVE_FACTORY_ABI, signer)
    return cFactory;
}

function getCWallet(signer: ethers5.ethers.Wallet, cWalletAddress: string) {
    const cWallet = new ethers5.Contract(cWalletAddress, C_WALLET_ABI, signer)
    return cWallet;
}

function getSigner(provider: ethers5.providers.JsonRpcProvider) {
    const signer = ethers5.Wallet.fromMnemonic(process.env.OPERATOR_MNEMONIC as string).connect(provider);
    return signer;
}

function getProvider() {
    const provider = new ethers5.providers.JsonRpcProvider(process.env.RPC_URL);
    return provider;
}

function getRecordPoolMintCallData(poolAddress: string, participant: string, questionId: number, engagement: number) {
    const callData = new ethers5.utils.Interface(COLLECTIVE_ABI).encodeFunctionData("recordPoolMint", [poolAddress, participant, questionId, engagement, 0]);
    return callData;
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
