import {
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  connectorsForWallets,
  Locale,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from 'wagmi/providers/public';
import { goerli, baseGoerli } from "wagmi/chains";
import { useIsMounted } from "@hooks/useIsMounted";
import { 
  injectedWallet,
  braveWallet,
  metaMaskWallet,
  coin98Wallet,
  rainbowWallet,
  //walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import useCurrentTheme from "@hooks/useCurrentTheme";
import { useRouter } from "next/router";
import { ReactNode } from 'react';

const chains = [ goerli, baseGoerli ];

const projectId = "2b592927eaad05eff4242d53ee9642f2";

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ chains, projectId }),
      injectedWallet({ chains }),
      braveWallet({ chains }),
      coin98Wallet({ chains, projectId }),
      rainbowWallet({ chains, projectId }),
      //walletConnectWallet({ chains, projectId }),
    ],
  },
]);

const { publicClient } = configureChains(chains, [publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectors,
  publicClient,
});


export const RainbowProvider = ({ children }: { children: ReactNode }) => {


  const demoAppInfo = {
    appName: 'Media Protocol Demo',
  };

  const currentTheme = useCurrentTheme();

  let walletTheme = currentTheme == "dark" ? darkTheme : lightTheme;

  const isMounted = useIsMounted();

  const { locale } = useRouter() as { locale: Locale };

  if (!isMounted) return null;

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        appInfo={demoAppInfo}
        chains={chains} 
        theme={walletTheme()} 
        modalSize="compact"
        locale={locale}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}