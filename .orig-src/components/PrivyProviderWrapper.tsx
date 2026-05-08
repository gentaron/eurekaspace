'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmnvb4u8s04330bjxz7ajolsh"
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#a855f7',
          logo: '',
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
