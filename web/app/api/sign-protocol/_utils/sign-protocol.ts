/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  OffChainSignType,
  IndexService,
  OffChainRpc,
} from '@ethsign/sp-sdk';

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
  castURL: string,
  castHash: string,
  castAuthorFID: number,
  attesterFID: number,
  attesterComment: string,
  isFactCheck: boolean,
  reference1: string,
  reference2: string,
  reference3: string,
  reference4: string,
) {
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.base,
  });
  // signType: OffChainSignType.EvmEip712,
  //   rpcUrl: OffChainRpc.testnet,
  const res = await client.createAttestation({
    schemaId: process.env.NEXT_PUBLIC_SIGN_PROTOCOL_SCHEMA_ID_FARCASTER as string, //
    data: { castURL, castHash, castAuthorFID, attesterFID, attesterComment, isFactCheck, reference1, reference2, reference3, reference4 },
    indexingValue: 'xxx', //Todo:: handle this
  });
  console.log('[createAttestationForCast]', castURL, castHash, castAuthorFID, attesterFID, attesterComment, isFactCheck, reference1, reference2, reference3, reference4 );
  return res;
}

export async function getAttestation(id: string) {
  const indexService = new IndexService('testnet');
  const res = await indexService.queryAttestation(id);
  console.log('[attestation]', res);
  return res;
}
