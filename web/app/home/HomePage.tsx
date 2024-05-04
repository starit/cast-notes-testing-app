'use client';
import React, { useState } from "react";
import { AuthKitProvider, useProfile } from '@farcaster/auth-kit';
import { useAccount } from 'wagmi'
import Footer from '@/components/layout/footer/Footer';
import Main from '@/components/layout/Main';
import HomeHeader from './_components/HomeHeader';
import Attest from './Attest';
import '@farcaster/auth-kit/styles.css';
// import { SignInButton } from '@farcaster/auth-kit';

/**
 * Use the page component to wrap the components
 * that you want to render on the page.
 */

/**
 * Todo:: modify the config before the final launch
 */
const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'CastNotes.xyz',
  siweUri: process.env.NEXT_PUBLIC_WEBSITE_URL as string + '/login',
};
// console.log('process.env.NEXT_PUBLIC_WEBSITE_URL', process.env.NEXT_PUBLIC_WEBSITE_URL)

export default function HomePage() {
  const [cast, setCast] = useState("")
  const [castURL, setCastURL] = useState("")

  const [castFID, setCastFID] = useState(0)
  const [castHash, setCastHash] = useState("")
  const account = useAccount()
  const {
    isAuthenticated,
    profile: { username, fid },
  } = useProfile();

  return (
    <AuthKitProvider config={config}>
      <HomeHeader isAuthenticated={isAuthenticated} profile={{ username , fid}} castURL={castURL} setCast={setCast} setCastFID={setCastFID} setCastHash={setCastHash} setCastURL={setCastURL}/>
      <Main>
        <Attest isAuthenticated={isAuthenticated} profile={{ username, fid }} castURL={castURL} cast={cast} castFID={castFID} castHash={castHash} account={account} />
      </Main>
      <Footer />
    </AuthKitProvider>
  );
}
