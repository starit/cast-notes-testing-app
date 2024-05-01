/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as fs from 'fs';
import { join } from 'path';
import { getFnameByFid } from 'app/api/farcaster/cast/_utils/fname';
import { getCast } from 'app/api/farcaster/cast/_utils/hub';
import {
  AttestationData,
  AttestationResponse,
  getAttestation,
} from 'app/api/sign-protocol/_utils/sign-protocol';
import { NextRequest, NextResponse } from 'next/server';
import satori from 'satori';
import sharp from 'sharp';

const fontPath = join(process.cwd(), 'public/NotoSansSC/static/NotoSansSC-Regular.ttf');
let fontData = fs.readFileSync(fontPath);

const urlMetadata = require('url-metadata');

async function getTitle(url: string) {
  if (url === null || url == undefined) {
    return null;
  }
  try {
    const metadata = await urlMetadata(url);
    return metadata['title'] || metadata['og:title'];
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function getNode(id: string, page: number) {
  const attestation: AttestationResponse = await getAttestation(id);
  const attestation_data: AttestationData = JSON.parse(attestation.data);

  const cast = (await getCast(attestation_data.castAuthorFID, attestation_data.castHash)).data
    .castAddBody.text;
  const author = (await getFnameByFid(attestation_data.castAuthorFID)).transfers[0].username;
  const attester = (await getFnameByFid(attestation_data.attesterFID)).transfers[0].username;

  switch (page) {
    case 0:
      return (
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            padding: 50,
            lineHeight: 1.0,
            fontSize: 24,
            textAlign: 'justify',
            wordBreak: 'break-all',
            color: 'grey',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span>@{author}</span>
            <span>{attestation_data.castHash.substring(0, 10)}</span>
          </div>
          <p
            style={{
              border: '1px solid',
              padding: 10,
              borderRadius: 10,
              textAlign: 'justify',
              width: '100%',
            }}
          >
            {cast}
          </p>
          <hr style={{ width: '90%', border: '1px solid' }}></hr>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span style={{ color: 'black' }}>@{attester}</span>
            <span style={{ fontWeight: 'bold', color: 'black' }}>
              {String(attestation_data.isFactCheck).toUpperCase()}
            </span>
          </div>
          <p
            style={{
              color: 'black',
              border: '1px solid black',
              padding: 10,
              borderRadius: 10,
              textAlign: 'justify',
              width: '100%',
            }}
          >
            {attestation_data.context}
          </p>
        </div>
      );
    case 1:
    case 2:
      const ref_diaplay_1 =
        (await getTitle(attestation_data.reference1)) || attestation_data.reference1;
      const ref_diaplay_2 =
        (await getTitle(attestation_data.reference2)) || attestation_data.reference2;
      const ref_diaplay_3 =
        (await getTitle(attestation_data.reference3)) || attestation_data.reference3;
      const ref_diaplay_4 =
        (await getTitle(attestation_data.reference4)) || attestation_data.reference4;

      return (
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            padding: 50,
            lineHeight: 1.2,
            fontSize: 24,
            textAlign: 'justify',
          }}
        >
          References have been provided to support this Cast-Check:
          <ol
            type="1"
            style={{
              flexDirection: 'column',
              border: '1px solid grey',
              borderRadius: 10,
              padding: '10px',
              marginTop: '10px',
              width: '100%',
            }}
          >
            <li style={{ marginBottom: '5px' }}>1. {ref_diaplay_1}</li>
            <li style={{ marginBottom: '5px' }}>2. {ref_diaplay_2}</li>
            <li style={{ marginBottom: '5px' }}>3. {ref_diaplay_3}</li>
            <li>4. {ref_diaplay_4}</li>
          </ol>
        </div>
      );
    default:
      const team_names = 'Spice Works';
      return (
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            padding: 50,
            lineHeight: 1.2,
            fontSize: 24,
            textAlign: 'justify',
          }}
        >
          <span>This cast-check is an attestation issued on Sign Protocol using CastNotes</span>
          <hr style={{ width: '90%', border: '1px solid grey' }}></hr>
          <span>CastNotes is a Farcaster x Sign Protocol client built by {team_names}</span>
          <hr style={{ width: '90%', border: '1px solid grey' }}></hr>
          <span>Click Attestation Info for more details</span>
        </div>
      );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; page: string } },
): Promise<Response> {
  try {
    const id: string = params.id;
    const page: number = parseInt(params.page);

    const svg = await satori(await getNode(id, page), {
      width: 600,
      height: 600,
      fonts: [
        {
          data: fontData,
          name: 'NotoSans',
          style: 'normal',
          weight: 400,
        },
      ],
    });
    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer();

    // Set the content type to PNG and send the response
    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=10',
      },
    });
  } catch (error) {
    console.error('Error generating frame pic:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
