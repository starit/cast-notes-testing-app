/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService,
  Attestation,
} from '@ethsign/sp-sdk';
import { decodeAbiParameters } from 'viem'
import { privateKeyToAccount } from 'viem/accounts';

// import { privateKeyToAccount } from "viem/accounts";

// const privateKey = process.env.SIGN_BOT_PRIVATE_KEY; //Todo:: handle next's .env
// Schema need to be created first
export type AttestationData = {
    castURL: string;
    castHash: string;
    castAuthorFID: number;
    attesterFID: number;
    isFactCheck: boolean;
    context: string;
    reference1: string;
    reference2: string;
    reference3: string;
    reference4: string;
  };
  
  export type AttestationResponse = {
    attestTimestamp: string;
    attestationId: string;
    attester: string;
    chainId: string;
    data: string;
    id: string;
  };

export async function createAttestationForCast(
  info: { attestation: Attestation; delegationSignature; }
) {
  console.log('start to run createAttestationForCast')
  // verify
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.base,
    // chain: EvmChains.base,
    // signType: OffChainSignType.EvmEip712,
    account: privateKeyToAccount(process.env.SENDER_ACCOUNT_PRIVATE_KEY as `0x${string}`), 
  });
  // Create Attestation On-behalf of the user
  // Todo:: check if the info.attestation can be verified by the signature
  const delegationCreateAttestationRes = await client.createAttestation(
    info.attestation,
    {
      delegationSignature: info.delegationSignature,
    }
  );
  console.log('[createAttestationForCast]', 'info.attestation', info.attestation, 'delegationSignature', info.delegationSignature);
  return delegationCreateAttestationRes;
}

export async function getAttestation(id: string) {
  const indexService = new IndexService('mainnet');
  const res = await indexService.queryAttestation(id);
  console.log('[attestation]', res);
  return res;
}

export function decodeData(data) {
  const res = decodeAbiParameters(data.schema.data, data.data as `0x${string}`);
  return {
    castURL: res[0],
    castHash: res[1],
    castAuthorFID: res[2],
    attesterFID: res[3],
    isFactCheck: res[4],
    context: res[5],
    reference1: res[6],
    reference2: res[7],
    reference3: res[8],
    reference4: res[9],
  } as AttestationData;
}
// decodedData2 uses fixed ABI
export function decodeData2(data) {
  const FCAttestationABI = [
    { name: 'castURL', type: 'string' },
    { name: 'castHash', type: 'string' },
    { name: 'castAuthorFID', type: 'uint256' },
    { name: 'attesterFID', type: 'uint256' },
    { name: 'isFactCheck', type: 'bool' },
    { name: 'context', type: 'string' },
    { name: 'reference1', type: 'string' },
    { name: 'reference2', type: 'string' },
    { name: 'reference3', type: 'string' },
    { name: 'reference4', type: 'string' }
  ];
  const res = decodeAbiParameters(FCAttestationABI, data as `0x${string}`);
  return {
    castURL: res[0],
    castHash: res[1],
    castAuthorFID: res[2],
    attesterFID: res[3],
    isFactCheck: res[4],
    context: res[5],
    reference1: res[6],
    reference2: res[7],
    reference3: res[8],
    reference4: res[9],
  } as AttestationData;
}
