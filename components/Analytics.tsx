import Script from "next/script";
import { business } from "@/data/business";

// GA4 — ported 1:1 from the static site's <head> gtag snippet.
export function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${business.gaId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${business.gaId}');
`}
      </Script>
    </>
  );
}
