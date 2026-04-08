import { ThemeProvider } from 'next-themes';
import './global.css';
import { ApolloWrapper } from '@/lib/apollo-provider';
import { AuthProvider } from '@/context/AuthContext';

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
          <AuthProvider>
            <ApolloWrapper>
              {children}
            </ApolloWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
