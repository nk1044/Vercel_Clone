import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link rel="icon" href="/logo-main.png" type="image/png" />
      <title>Deployment Server</title>

      <meta name="application-name" content="Deployment Server" />
        <meta name="apple-mobile-web-app-title" content="Deployment Server" />
        
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
