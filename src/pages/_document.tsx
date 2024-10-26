import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#ffffff" />

          <link
            href="https://fonts.googleapis.com/css?family=Roboto"
            rel="stylesheet"
            type="text/css"
          />

          <link
            href="/favicon-16x16.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
          />
          <link
            href="/favicon-32x32.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
          />

          <link
            href="/icons/android-chrome-192x192.png"
            rel="icon"
            type="image/png"
            sizes="192x192"
          />
          <link
            href="/icons/android-chrome-512x512.png"
            rel="icon"
            type="image/png"
            sizes="512x512"
          />
          <link
            href="/icons/maskable-192x192.png"
            rel="icon"
            type="image/png"
            sizes="192x192"
          />
          <link
            href="/icons/maskable-512x512.png"
            rel="icon"
            type="image/png"
            sizes="512x512"
          />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="lebonforum.fr" />
          <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
          <link rel="mask-icon" href="/icons/icon.svg" color="#000000" />
          {/* <link
            rel="apple-touch-startup-image"
            href="/icons/apple-splash-2048.png"
            sizes="2048x2732"
          />
          <link
            rel="apple-touch-startup-image"
            href="/icons/apple-splash-1668.png"
            sizes="1668x2224"
          />
          <link
            rel="apple-touch-startup-image"
            href="/icons/apple-splash-1536.png"
            sizes="1536x2048"
          />
          <link
            rel="apple-touch-startup-image"
            href="/icons/apple-splash-1125.png"
            sizes="1125x2436"
          />
          <link
            rel="apple-touch-startup-image"
            href="/icons/apple-splash-1242.png"
            sizes="1242x2208"
          />
          <link
            rel="apple-touch-startup-image"
            href="/icons/apple-splash-750.png"
            sizes="750x1334"
          /> */}
          <link
            rel="apple-touch-startup-image"
            href="/icons/apple-splash-640.png"
            sizes="640x1136"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
