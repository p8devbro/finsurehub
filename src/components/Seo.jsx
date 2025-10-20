// src/components/Seo.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function Seo({
  title,
  description,
  url,
  image,
  author = "FinSure Hub",
  publishedTime,
  modifiedTime,
  canonical
}) {
  const siteName = "FinSure Hub";
  const finalUrl = url || "https://YOUR_DOMAIN_HERE/";
  const img = image || "https://source.unsplash.com/1200x630/?finance,insurance";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type":"WebPage",
      "@id": finalUrl
    },
    "headline": title,
    "image": [img],
    "datePublished": publishedTime || new Date().toISOString(),
    "dateModified": modifiedTime || (modifiedTime === null ? null : new Date().toISOString()),
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${finalUrl.replace(/\/$/, "")}/logo.png`
      }
    },
    "description": description
  };

  return (
    <Helmet>
      <title>{title} — {siteName}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || finalUrl} />

      {/* Open Graph */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
