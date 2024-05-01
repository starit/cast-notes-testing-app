/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NeynarAPIClient, isApiErrorResponse, CastParamType } from '@neynar/nodejs-sdk';
import { clsx } from 'clsx';
import Button from '@/components/Button/Button';

// import CodeBlock from '@/components/code-block/CodeBlock';
import Header from '@/components/layout/header/Header';
import styles from './Home.module.css';
import InputText from './InputText';
import Label from './Label';
import { useState } from 'react';

// API can be used: https://docs.neynar.com/reference/cast
const getCastByURL = async (url: string) => {
  // validate URL
  const client = new NeynarAPIClient(`${process.env.NEXT_PUBLIC_REACT_NEYNAR_API_KEY}`); // Replace with your Neynar API Key.
  try {
    // 19960 (Required*) => fid of user  we are looking for
    // 191 (Optional) => fid of the viewer
    // Get more info @ https://docs.neynar.com/reference/user-v1
    const castAdd = await client.lookUpCastByHashOrWarpcastUrl(url, CastParamType.Url);

    // Stringify and log the response
    console.log(JSON.stringify(castAdd));
    return [castAdd.cast.author.fid, castAdd.cast.hash, castAdd];
  } catch (error) {
    // isApiErrorResponse can be used to check for Neynar API errors
    if (isApiErrorResponse(error)) {
      console.log('API Error', error.response.data);
    } else {
      console.log('Generic Error', error);
    }
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HomeHeader(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [buttonContent, setButtonContent] = useState("Get Cast");

  async function retrieveCast() {
    console.log(props.castURL);
    setButtonContent("Getting Cast...");
    try {
      const [fid, castHash, castAdd] = await getCastByURL(props.castURL);
      console.log('fid, castHash, castAdd', fid, castHash, castAdd);
      if (typeof castAdd === 'object') {
        props.setCast(castAdd.cast.text);
      } else {
        props.setCast(castAdd);
      }
      props.setCastFID(fid);
      props.setCastHash(castHash);
      window.location.href = '#anchor1';
    } catch (error) {
      console.log("Error fetching cast data: ", error);
    } finally {
      setButtonContent("Get Cast");
    }

  }

  return (
    <div className={styles.HomeHeader}>
      <div className={styles.HomeHeaderGradient} />
      <Header />
      <div className="flex flex-col items-center justify-center">
        <h1 className={clsx(styles.HomeHeaderHeadline, 'font-robotoMono')}>
          CastNotes
          <br />
          <br />
        </h1>
        <p id="anchor1" className={styles.HomeHeaderParagraph}>
          Attest the casts
          <br />
          Build a better social network.
        </p>
        {/* <div className={styles.HomeHeaderCta}>
          <CodeBlock code={codeStep1} />
        </div> */}
        <div className="w-1/2">
          <div className="mb-5">
            <Label htmlFor="CastID">Cast</Label>
            <InputText
              id="castURL"
              placeholder="Cast URL"
              // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
              onChange={(evt) => props.setCastURL(evt.target.value)}
              disabled={false}
              required
            />
            <Button
              buttonContent={buttonContent}
              type="submit"
              onClick={retrieveCast}
              disabled={false}
            />
          </div>
        </div>
      </div>
      <div className={styles.HomeHeaderWaves}>
        <div className={styles.homeBoatContainer}>
          <div className={styles.homeBoatInnerContainer}>
            <div className={styles.homeBoatLeftSail} />
            <div className={styles.homeBoatLeftSail2} />
            <div className={styles.homeBoatCenterSail} />
            <div className={styles.homeBoatRightSail} />
            <div className={styles.homeBoatTop} />
            <div className={styles.homeBoatCenter} />
            <div className={styles.homeBoatBottom} />
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="boat-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className={styles.HomeHeaderWavesParallax}>
            <use xlinkHref="#boat-wave" x="48" y="7" fill="rgba(82, 156, 248, 1)" />
            <use xlinkHref="#boat-wave" x="48" y="0" fill="rgba(82, 156, 248, 1)" />
            <use xlinkHref="#boat-wave" x="48" y="3" fill="rgba(82, 156, 248, 0.7)" />
            <use xlinkHref="#boat-wave" x="48" y="5" fill="rgba(82, 156, 248, 0.5)" />
            <use xlinkHref="#boat-wave" x="48" y="7" fill="rgba(82, 174, 255, 0.3)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
