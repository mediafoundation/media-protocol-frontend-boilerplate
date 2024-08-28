# Media Protocol Frontend Boilerplate

This is a boilerplate for the Media Protocol Frontend SDK. It is a simple web application that demonstrates how to interact with the Media Protocol smart contracts. The boilerplate is built using Next.js and Tailwind CSS.

> ⚠️ **Important Note:** The Media Protocol is not yet live into any mainnet network. It is only available in testnet networks and the contract addresses provided in the SDK are subject to change. Always refer to the official documentation for the most up-to-date and valid contract addresses before any interactions.

Check the demo [here](https://media-protocol-frontend-boilerplate.vercel.app/)

## Getting Started

To get started with this project, follow these steps:

## Installation

First, clone the repository and navigate into the project directory:

```bash
git clone https://github.com/mediafoundation/media-protocol-frontend-boilerplate.git
cd media-protocol-frontend-boilerplate
```

Then, install the project dependencies using npm or yarn:

```bash
# Using npm
npm install

# Or using yarn
yarn
```

## Development

To start the development server, run:

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

The server will be running on [http://localhost:3000](http://localhost:3000). Open it in your browser to view the project.

## Build for Production

To create an optimized production build, run:

```bash
# Using npm
npm run build

# Or using yarn
yarn build
```

This will create a `.next` folder containing the production build. To start the production server:

```bash
# Using npm
npm start

# Or using yarn
yarn start
```

---

# Tutorials 

Here you can find a step-by-step guide on how to interact with the Media Protocol smart contracts using this boilerplate.

## Prerequisites

Before you start, make sure you have the following:

1. Install [Metamask](https://support.metamask.io/hc/en-us/articles/360015489531) & create a wallet. We recommend using a burner wallet. 

2. Fund your wallet. You can mine Sepolia ETH from the [Sepolia Faucet](https://sepolia-faucet.pk910.de/).

3. Navigate to your Boilerplate. You can use the demo at [Media Protocol Frontend Demo](https://media-protocol-frontend-boilerplate.vercel.app/) or clone the boilerplate: [Media Protocol Frontend Boilerplate](https://github.com/mediafoundation/media-protocol-frontend-boilerplate)

4. Connect your wallet to the boilerplate by clicking on the “Connect Wallet” button.

## Initializing or selecting a Marketplace

Initialize a new marketplace by clicking "Init New Marketplace" and signing the transaction, or select an existing one by writing the marketplace ID on the input field.

![](https://raw.githubusercontent.com/mediafoundation/media-protocol-frontend-boilerplate/main/public/images/initialize.png)

## Becoming a Provider:
After initializing or selecting a marketplace, you can become a provider by following these steps:

1. Register as a provider in “My Account” by following the steps

2. Create a new offer in using the form in “All Offers” 

![](https://raw.githubusercontent.com/mediafoundation/media-protocol-frontend-boilerplate/main/public/images/provider.png)

3. Monitor your deals under "Deal as Provider”.

![](https://raw.githubusercontent.com/mediafoundation/media-protocol-frontend-boilerplate/main/public/images/deals.png)


## Becoming a Client:

In order to become a client you will have to use another wallet, because you cannot aquire services from yourself. You can use the same wallet by creating a new account in Metamask, this will give you a new wallet address.

1. Make sure you transfer some Sepolia ETH to your new wallet.

2. Navigate to the "All Offers" page, and use the "Take Offer" button to take one of the offers we created in the previous step.

3. That's it! You can now monitor your deals under "Deal as Client".

<!-- 6. Create a new resource in “My Resources” by entering metadata like: 

![](https://raw.githubusercontent.com/mediafoundation/media-protocol-frontend-boilerplate/main/public/images/client.png)

x. Sign transactions as prompted to get encryption key and create resources. -->

## Learn More

To learn more about Media Protocol, take a look at the following resources:

- [Media Protocol Website](https://www.mediaprotocol.net/)
- [Media Foundation](https://www.x.com/Media_FDN)
