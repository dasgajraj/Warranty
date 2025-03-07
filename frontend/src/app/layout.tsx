import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hadn\'t @ 2025 - Warranty Management',
  description: 'Warranty management dashboard for Hadn\'t @ 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}