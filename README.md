# Media Protocol Frontend Boilerplate

> ⚠️ **Important Note:** The Media Protocol is not yet live into any mainnet network. It is only available in testnet networks and the contract addresses provided in the SDK are subject to change. Always refer to the official documentation for the most up-to-date and valid contract addresses before any interactions.

Check the demo [here](https://media-protocol-frontend-boilerplate.vercel.app/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Tutorial on Becoming a Client of Marketplace ID 1 (Media Network):

1. Install [Metamask](https://support.metamask.io/hc/en-us/articles/360015489531) & create a wallet. We recommend using a burner wallet. 

2.  Fund your wallet. Mine GöETH from [Goerli Faucet](https://goerli-faucet.pk910.de/) or [Goerlifaucet.com](https://goerlifaucet.com/) without mining if you have 0.01 ETH balance on the same wallet on Ethereum Mainnet.

3. Clone and run the boilerplate: [Media Protocol Frontend Boilerplate](https://github.com/mediafoundation/media-protocol-frontend-boilerplate) or use the demo at [Media Protocol Frontend Demo](https://media-protocol-frontend-boilerplate.vercel.app/)

4. On Metamask, select the Goerli Testnet.

5. Initialize Media Network marketplace with ID “1”.

![](statamic://asset::assets::initialize.png)

6. Create a new resource in “My Resources” by entering metadata like: 

`{"label":"My Website","protocol":"http","origin":"157.240.214.35:80","path":"/"}`

![](statamic://asset::assets::client.png)

7. Sign transactions as prompted to get encryption key and create resources.

8. Take an offer from a provider in “All offers” entering your resource ID created in the step above.

### Steps to Become a Provider:

1. Install [Metamask](https://support.metamask.io/hc/en-us/articles/360015489531) & create a wallet. We recommend using a burner wallet. 

2.  Fund your wallet. Mine GöETH from [Goerli Faucet](https://goerli-faucet.pk910.de/) or [Goerlifaucet.com](https://goerlifaucet.com/) without mining if you have 0.01 ETH balance on the same wallet on Ethereum Mainnet.

3. Clone and run the boilerplate: [Media Protocol Frontend Boilerplate](https://github.com/mediafoundation/media-protocol-frontend-boilerplate) or use the demo at [Media Protocol Frontend Demo](https://media-protocol-frontend-boilerplate.vercel.app/)

4. On Metamask, select the Goerli Testnet.

5. Initialize Media Network marketplace with ID “1”.

5. Register as a provider in “My Account” by staking MEDIA & GöETH as a required.

6. Create a new offer in “All Offers” with the necessary metadata, for example: 

`{"label":"Basic","bandwidthLimit":{"amount":1,"unit":"tb","period":"hourly"},"autoSsl":true,"burstSpeed":10000,"nodeLocations":["AR","BR","CL"],"customCnames":true,"apiEndpoint":"https://api.yourdomain.com"}`

![](statamic://asset::assets::provider.png)

7. Clone and run Media Edge on multiple servers as per the README: [Media Edge Repo](https://github.com/mediafoundation/media-edge)

8. Monitor your deals under "Deal as Provider”.

![](statamic://asset::assets::deals.png)


## Learn More

To learn more about Media Protocol, take a look at the following resources:

- [Media Protocol Website](https://www.mediaprotocol.net/)
- [Media Foundation](https://www.x.com/Media_FDN)
