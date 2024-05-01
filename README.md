# CastNotes

CastNotes is a simple solution for issuing and managing attestations in the form of a client application for Farcaster, the leading decentralised social network protocol in the world.

By building this solution in the form of a Farcaster client, users will be able to:

- join the attestation ecosystem of [`Sign Protocol`](https://sign.global/) with their existing Farcaster accounts.
- contribute to the growth and issuance of attestations in Sign Protocol’s attestation ecosystem. As easy as making a social media post, probably easier.
- test and suggest new schemas for Sign Protocol’s schema registry
- attest to the social media content they see, i.e., can function akin to X’s Community Notes feature


# Structrue

This project has two main folders:

```bash
.
├── contracts
│   ├── src
│   ├── broadcast
│   ├── script
│   └── test
└── web
    ├── app
    └── src
```


[contracts](/contracts/README.md) folder contains all the solidity code (*Currently not used*) 

[web](/web/README.md) folder contains all the frontend code


## Getting Started

#### Step 1: Obtain Wallet Connect Project ID from [walletconnect.com](https://cloud.walletconnect.com/sign-in) and assign to the `.env.local` file

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=ADD_WALLET_CONNECT_PROJECT_ID_HERE
```


#### Step 2: copy `./web/.env.local.example ./web/.env.local` and fill out the following parameters
```
# The bot to sign attestation, any ETH accounts
SIGN_BOT_PRIVATE_KEY=
# This bot is used to post attestations on Farcaster, FID and Key should match
FARCASTER_BOT_FID=
FARCASTER_BOT_PRIVATE_KEY=
```

#### Step 3: Install and Run your onchain app

```bash
# Install
yarn

# Run
yarn dev
```

#### Step 4: Deploy in Vercel

deploy both fron-end and back-end in [Vercel](https://vercel.com/)

## Develop

To format and lint the package locally use these quick steps.

```bash
# Format fix
yarn format

# Lint fix
yarn lint
```

## Thanks

This repo is built based on [Coinbase OnchainKit](https://github.com/coinbase/onchainkit)

We are thinking of ways to make this step easier in the future! Happy hacking!

