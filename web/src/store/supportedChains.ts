import { baseSepolia, Chain, base, mainnet } from 'viem/chains';

import { Environment, getCurrentEnvironment } from './environment';

// The list of supported Chains for a given environment
// https://github.com/wevm/viem/blob/main/src/chains/index.ts
export const SUPPORTED_CHAINS: Record<Environment, [Chain, ...Chain[]]> = {
  [Environment.localhost]: [base, baseSepolia],
  [Environment.development]: [baseSepolia],
  [Environment.staging]: [base],
  [Environment.production]: [base],
};

/**
 * Gets the list of supported chains for a given environment.
 * Defaults to the current environment.
 * @param env
 */
export function getChainsForEnvironment(env?: Environment) {
  if (!env) {
    env = getCurrentEnvironment();
  }
  return SUPPORTED_CHAINS[env];
}

export function getChainById(chainId: string) {
  const chains = getChainsForEnvironment();
  return chains?.find((c: Chain) => c.id === Number(chainId)) ?? null;
}
