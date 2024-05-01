/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { getFnameByFid } from 'app/api/farcaster/cast/_utils/fname';
import { getCast } from 'app/api/farcaster/cast/_utils/hub';
import {
  AttestationData,
  AttestationResponse,
  getAttestation,
} from 'app/api/sign-protocol/_utils/sign-protocol';
import { NextResponse } from 'next/server';

const ATTESTATION_CASTER_URL = process.env.NEXT_PUBLIC_WEBSITE_URL as string;
const WARPCAST_URL = 'https://warpcast.com';
const SIGN_SCAN_URL = (process.env.NEXT_PUBLIC_SIGN_SCAN_URL as string) + '/attestation';

function urlWrapper(url: string) {
  if (url === null || url === undefined || url === '') {
    return ATTESTATION_CASTER_URL;
  }
  if (!url.startsWith('http')) {
    url = 'http://' + url;
  }
  return url;
}

export async function getFrame0(id: string) {
  const attestation: AttestationResponse = await getAttestation(id);
  const attestation_data: AttestationData = JSON.parse(attestation.data);
  const attester = (await getFnameByFid(attestation_data.attesterFID)).transfers[0].username;

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'References',
          action: 'post',
        },
        {
          label: 'Attester',
          action: 'link',
          target: WARPCAST_URL + `/${attester}`,
        },
        {
          label: 'Original Cast',
          action: 'link',
          target: attestation_data.castURL,
        },
        {
          label: 'More Info',
          action: 'post',
        },
      ],
      image: {
        src: ATTESTATION_CASTER_URL + `/api/frame/${id}/0/image`,
        aspectRatio: '1:1',
      },
      postUrl: ATTESTATION_CASTER_URL + `/api/frame/${id}/0`,
      ogTitle: 'CastNotes - Initial Frame - Attestation' + id,
      ogDescription: 'Original cast and context of attestation ' + { id },
    }),
  );
}

export async function getFrame1(id: string) {
  const attestation: AttestationResponse = await getAttestation(id);
  const attestationData: AttestationData = JSON.parse(attestation.data);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Reference 1',
          action: 'link',
          target: urlWrapper(attestationData.reference1),
        },
        {
          label: 'Reference 2',
          action: 'link',
          target: urlWrapper(attestationData.reference2),
        },
        {
          label: 'Next',
          action: 'post',
        },
        {
          label: 'Back',
          action: 'post',
        },
      ],
      image: {
        src: ATTESTATION_CASTER_URL + `/api/frame/${id}/1/image`,
        aspectRatio: '1:1',
      },
      postUrl: ATTESTATION_CASTER_URL + `/api/frame/${id}/1`,
      ogTitle: 'CastNotes - Second Frame - Attestation' + id,
      ogDescription: 'Reference 1 and reference 2 of attestation ' + { id },
    }),
  );
}

export async function getFrame2(id: string) {
  const attestation: AttestationResponse = await getAttestation(id);
  const attestationData: AttestationData = JSON.parse(attestation.data);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Reference 3',
          action: 'link',
          target: urlWrapper(attestationData.reference3),
        },
        {
          label: 'Reference 4',
          action: 'link',
          target: urlWrapper(attestationData.reference4),
        },
        {
          label: 'Back',
          action: 'post',
        },
      ],
      image: {
        src: ATTESTATION_CASTER_URL + `/api/frame/${id}/2/image`,
        aspectRatio: '1:1',
      },
      postUrl: ATTESTATION_CASTER_URL + `/api/frame/${id}/2`,
      ogTitle: 'CastNotes - Third Frame - Attestation' + id,
      ogDescription: 'Reference 3 and reference 4 of attestation ' + { id },
    }),
  );
}

export async function getFrame3(id: string) {
  const attestation: AttestationResponse = await getAttestation(id);
  const attestationData: AttestationData = JSON.parse(attestation.data);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Back',
          action: 'post',
        },
        {
          label: 'Attestation Info',
          action: 'link',
          target: SIGN_SCAN_URL + '/' + id,
        },
        {
          label: 'CastNotes',
          action: 'link',
          target: ATTESTATION_CASTER_URL,
        },
      ],
      image: {
        src: ATTESTATION_CASTER_URL + `/api/frame/${id}/3/image`,
        aspectRatio: '1:1',
      },
      postUrl: ATTESTATION_CASTER_URL + `/api/frame/${id}/3`,
      ogTitle: 'CastNotes - Info Frame - Attestation' + id,
      ogDescription: 'Info about CastNotes',
    }),
  );
}
