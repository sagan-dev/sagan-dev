import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CookieBanner } from "@/components/CookieBanner";
import { DevToolLauncher } from "@/components/Toolbox";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ApolloWrapper } from "@/app/ApolloWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getSiteContent } from "@/lib/cms";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();

  return {
    metadataBase: new URL(seo.metadataBase),
    title: {
      default: seo.titleDefault,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.authorName, url: seo.authorUrl }],
    creator: seo.creator,
    openGraph: {
      title: seo.titleDefault,
      description: seo.description,
      url: seo.canonical,
      siteName: seo.siteName,
      type: "website",
      locale: seo.locale,
      images: [
        {
          url: seo.image,
          width: seo.imageWidth,
          height: seo.imageHeight,
          alt: seo.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.titleDefault,
      description: seo.description,
      images: [seo.image],
    },
    alternates: {
      canonical: seo.canonical,
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/icons/sagan.svg", type: "image/svg+xml" },
        { url: "/icons/generated/sagan-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/generated/sagan-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/icons/generated/sagan-180.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      title: "sagan.dev",
      statusBarStyle: "black-translucent",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        {/* Google Consent Mode v2 — must run BEFORE GTM */}
        <Script
          id="google-consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
            `.trim(),
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5PSGWWNM');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        <ApolloWrapper>
          <LanguageProvider translations={siteContent.translations}>
            <LanguageSwitcher />
            <CookieBanner />
            <DevToolLauncher />
            <PageViewTracker />
            {children}
          </LanguageProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
