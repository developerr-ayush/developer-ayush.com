"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'startTime':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WVCN3W56');
        `}
      </Script>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WVCN3W56"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: "0",
            height: "0",
          }}
        ></div>
      </noscript>
      <Script id="google-tag-manager-setup" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GTM-WVCN3W56');
        `}
      </Script>
    </>
  );
}
