import { FrameRequest } from '@coinbase/onchainkit/frame';
import { NextRequest } from 'next/server';
import { getFrame0, getFrame1, getFrame2, getFrame3, getFrameError } from '../getFrame';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; page: number } },
): Promise<Response> {
  try {
    return await getFrame0(params.id);
  } catch (e) {
    console.error('Internal Error on request to ', params.id);
    console.error(e);
    return await getFrameError();
  } 
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; page: string } },
): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const id = params.id;
  const button = frameRequest.untrustedData.buttonIndex;

  try {
    switch (parseInt(params.page)) {
      case 0:
        console.log("case 0");
        if (button === 1) {
          return await getFrame1(id);
        } else {
          return await getFrame3(id);
        }
      case 1:
        console.log("case 1");
        if (button === 3) {
          return await getFrame2(id);
        } else {
          return await getFrame0(id);
        }
      default:
        console.log("case default");
        return await getFrame0(id);
    }
  } catch (e) {
    console.error('Internal Error on request to ', params.id);
    console.error(e);
    return await getFrameError();
  }
}

export const dynamic = 'force-dynamic';
