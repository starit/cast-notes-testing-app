'use client';

import { GitHubLogoIcon, ArrowTopRightIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { NavbarLink } from '@/components/layout/header/Navbar';
import FooterIcon from './FooterIcon';

export default function Footer() {
  return (
    <footer className="flex flex-1 flex-col justify-end">
      <div className="flex flex-col justify-between gap-16 bg-boat-footer-dark-gray py-12">
        <div className="container mx-auto flex w-full flex-col justify-between gap-16 px-8 md:flex-row">
          <div className="flex flex-col justify-between">
            <div className="flex h-8 items-center justify-start gap-4">
              <NextLink href="/" passHref className="relative h-8 w-8" aria-label="Home page">
                <img src="/icons/48x48.png" alt="48x48" />
              </NextLink>
              <NextLink
                href="/"
                passHref
                className="font-robotoMono text-center text-xl font-medium text-white no-underline"
              >
                CastNotes
              </NextLink>
              <NavbarLink href="https://github.com/CastNotes/" target="_blank">
                <GitHubLogoIcon
                  width="24"
                  height="24"
                  aria-label="build-onchain-apps Github respository"
                />
              </NavbarLink>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center">
              <p className="text-base font-normal leading-7 text-boat-footer-light-gray">
                This project is licensed under the MIT License - see the{' '}
                <NextLink
                  href="https://github.com/coinbase/build-onchain-apps/blob/main/LICENSE.md"
                  className="underline"
                  target="_blank"
                >
                  LICENSE.md
                </NextLink>{' '}
                file for details
              </p>
            </div>
          </div>

          <div className="font-robotoMono flex flex-col items-start justify-center gap-4 text-center text-xl font-medium text-white">
            EXPERIENCES
            <NavbarLink target="_blank" href="https://www.ethsign.xyz/">
              <span className="flex items-center gap-1 px-2">
                Sign Protocol <ArrowTopRightIcon width="16" height="16" />
              </span>
            </NavbarLink>
            <NavbarLink target="_blank" href="https://docs.farcaster.xyz/">
              <span className="flex items-center gap-1 px-2">
                Farcaster <ArrowTopRightIcon width="16" height="16" />
              </span>
            </NavbarLink>
            <NavbarLink target="_blank"  href="https://scan.sign.global/">
              <span className="flex items-center gap-1 px-2">
                Sign Scan <ArrowTopRightIcon width="16" height="16" />
              </span>
            </NavbarLink>
            <NavbarLink target="_blank" href="https://www.base.org/">
              <span className="flex items-center gap-1 px-2">
                Base <ArrowTopRightIcon width="16" height="16" />
              </span>
            </NavbarLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
