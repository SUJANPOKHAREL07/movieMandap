import { ThemeProvider } from 'next-themes';
import './global.css';
import { ApolloWrapper } from '@/lib/apollo-provider';

export const metadata = {
  title: 'MovieMandap – Discover & Review Movies',
  description: 'MovieMandap is your ultimate destination for discovering movies, writing reviews, and building your personal watchlist.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
