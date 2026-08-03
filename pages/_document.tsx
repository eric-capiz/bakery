import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>PIT — Shop bay &amp; mobile mechanic</title>
        <meta name="theme-color" content="#3E4654" />
        <meta
          name="description"
          content="PIT — shop bay and mobile mechanic. Straight talk. Posted prices. We show up."
        />
        <link rel="icon" type="image/png" href="/logo3.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Teko:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
