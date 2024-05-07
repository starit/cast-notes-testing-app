'use client';

import { ReactNode } from 'react';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { createWagmiConfig } from '@/store/createWagmiConfig';
import '@farcaster/auth-kit/styles.css';


type Props = { children: ReactNode };

const queryClient = new QueryClient();

// TODO Docs ~~~
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '';
if (!projectId) {
  const providerErrMessage =
    'To connect to all Wallets you need to provide a NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable';
  throw new Error(providerErrMessage);
}

const wagmiConfig = createWagmiConfig(projectId);

/**
 * Todo:: modify the config before the final launch
 */
const authKitConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'CastNotes.xyz',
  siweUri: process.env.NEXT_PUBLIC_WEBSITE_URL as string + '/login',
};

/**
 * TODO Docs ~~~
 */
function OnchainProviders({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          <AuthKitProvider config={authKitConfig}>
            {children}
          </AuthKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
