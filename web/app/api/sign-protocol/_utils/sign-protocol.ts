/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  OffChainSignType,
  IndexService,
  OffChainRpc,
  Attestation,
} from '@ethsign/sp-sdk';
import { decodeAbiParameters } from 'viem'

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
  // verify
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.base,
  });
  // Create Attestation On-behalf of the user
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
