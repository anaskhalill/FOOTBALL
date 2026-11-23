import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import HydrationMarker from "@/components/HydrationMarker";

export const metadata: Metadata = {
  title: "Freebuff - Live Football Scores",
  description:
    "Live football scores, match results, league standings, and statistics. Real-time updates for Premier League, La Liga, Champions League, and more.",
  keywords: "football, soccer, live scores, results, standings, Premier League, La Liga, Champions League",
  openGraph: {
    title: "Freebuff - Live Football Scores",
    description: "Real-time football scores and match updates",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var r=document.documentElement;r.setAttribute('data-theme',t);r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-20 sm:pb-0">{children}</main>
          </div>
          <HydrationMarker />
        </Providers>
      </body>
    </html>
  );
}
