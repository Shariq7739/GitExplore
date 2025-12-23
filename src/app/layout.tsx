import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const siteConfig = {
  name: 'GitExplore',
  description: 'Explore trending GitHub repositories and discover new projects.',
  url: 'https://gitexplore.com', // Replace with your actual domain
  ogImage: 'og-gitexplore.png',
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/gitexplore.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@yourtwitterhandle', // Optional: Replace with your Twitter handle
  },
  // Optional: Add for better SEO if you have a sitemap
  // manifest: `${siteConfig.url}/site.webmanifest`, 
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <div className="absolute top-0 -z-10 h-full w-full bg-background">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(121,82,255,0.5)] opacity-50 blur-[80px]" />
        </div>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
