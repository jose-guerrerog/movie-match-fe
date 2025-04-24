import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MovieMatch - Movie Recommendation System',
  description: 'Find your next favorite movie with intelligent recommendations powered by collaborative filtering and content-based analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        {/* Font Awesome for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}