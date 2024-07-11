/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getFarcasterUserAddress } from '@coinbase/onchainkit/farcaster';
import { NextRequest, NextResponse } from 'next/server';
// import { getChainsForEnvironment } from '@/store/supportedChains';
// import * as hub from './_utils/hub.js'
import * as signProtocol from '../_utils/sign-protocol'

/**
 * Handler for the /api/sign-protocol route
 * @param req
 * @param res
 */
// export async function GET(req: NextRequest): Promise<Response> {
//     try {
//         const fid = req.nextUrl.searchParams.get('fid');
//         // const castHash = req.nextUrl.searchParams.get('cast_hash');
//         if (!fid) {
//             return NextResponse.json({ error: 'fid is required' }, { status: 400 });
//         }
//         // if (!castHash) {
//         //     return NextResponse.json({ error: 'cast_hash is required' }, { status: 400 });
//         // }
//         // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
//         // const cast: string = await hub.getCast(fid, castHash);
//         // console.log('get cast', fid, castHash, cast.toString())
//         // // const chains = getChainsForEnvironment();
//         return NextResponse.json({ }, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching chains:', error);
//         return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
//     }
// }

const verifyAttesterFID = async (attesterFID: number, attester: string) => {
    const userAddress = await getFarcasterUserAddress(attesterFID);
    console.log('[getFarcasterUserAddress] fid:', attesterFID, 'user address:', userAddress?.verifiedAddresses)
    return userAddress?.verifiedAddresses?.includes(attester);
}

/**
 * Handler for the /api/sign-protocol route, create an attestation based on a cast
 * @param req
 * @param res
 */
// example payload
// info {
//   delegationSignature: '0xd9b5fea98985ac7d33cb490bca617528b3d44e3b8db25a2cc190e6e6e87453aa52e1e5906e437664c393eedf817a7769efe22a5b6fd0295893a61ab40c0c5c5f1c',
//   attestation: {
//     schemaId: '0x22',
//     linkedAttestationId: 0,
//     attester: '0x47F7EA0dd4418AA1cec00786F5C47623aC37bA42',
//     validUntil: 0,
//     revoked: false,
//     dataLocation: 0,
//     attestTimestamp: 0,
//     revokeTimestamp: 0,
//     recipients: [],
//     data: '0x000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000512300000000000000000000000000000000000000000000000000000000000029c400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000002568747470733a2f2f77617270636173742e636f6d2f6e657272642f30786333653261383331000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078633365326138333135313535653535313061616337343635326532393835363864656638343634360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033132330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002568747470733a2f2f77617270636173742e636f6d2f6e657272642f30786333653261383331000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     indexingValue: 'xxx'
//   }
// }
export async function POST(req: NextRequest): Promise<Response> {
    try {
        const res = await req.json();
        const info = res.info;
        const decodedData: signProtocol.AttestationData = signProtocol.decodeData2(info.attestation.data);
        // console.log('info', info)
        console.log('[Attestation POST] info data decoded', decodedData)

        // validation
        if (!decodedData.castHash) {
            return NextResponse.json({ error: 'cast_hash is required' }, { status: 400 });
        }
        if (!(decodedData.castAuthorFID >= 0n)) {
            return NextResponse.json({ error: 'author_fid is required' }, { status: 400 });
        }
        if (!(decodedData.attesterFID >= 0n)) {
            return NextResponse.json({ error: 'attester_fid is required' }, { status: 400 });
        }
        if (!decodedData.context) {
            return NextResponse.json({ error: 'context is required' }, { status: 400 });
        }
        if (!info.delegationSignature) {
            return NextResponse.json({ error: 'delegationSignature is required' }, { status: 400 });
        }
        // console.log('compare fid and address:', decodedData.attesterFID, info.attestation.attester)
        const fidVerifiedResult = await verifyAttesterFID(decodedData.attesterFID, info.attestation.attester);
        if (!fidVerifiedResult) {
            console.error('failed to verify fid', 'fid:', decodedData.attesterFID, 'attester:', info.attestation.attester)
            return NextResponse.json({ error: 'attester_fid is required to be from attester' }, { status: 400 });
        }
        // Todo:: verify signature and fid, important
        // Todo:: use a message queue to handle this
        try {
            const attestation = await signProtocol.createAttestationForCast({
                attestation: info.attestation,
                delegationSignature: info.delegationSignature
            }); 
            console.log('[Attestation POST] attestation on-chain:', attestation)
            // Todo:: send notifications to bot if success
            return NextResponse.json({ attestation }, { status: 200 });
        } catch(e) {
            console.error('[Attestation POST Error]', 'castHash:', decodedData.castHash, 'error:', e);
            return NextResponse.json({ error: 'failed to create attestation'}, { status: 500, statusText: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error fetching chains:', error);
        return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
    }
}

export const dynamic = 'force-dynamic';
