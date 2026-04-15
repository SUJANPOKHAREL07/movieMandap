import { ThemeProvider } from 'next-themes';
import './global.css';
import { ApolloWrapper } from '@/lib/apollo-provider';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <AuthProvider>
              <ApolloWrapper>
                {children}
              </ApolloWrapper>
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
