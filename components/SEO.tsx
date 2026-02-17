import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Mendonça Dreams - Alta Alfaiataria Feminina. Peças exclusivas, cortes precisos e tecidos de luxo.",
    image = "/og-image.jpg",
    url,
    type = "website",
    keywords = "Mendonça Dreams, moda feminina, alfaiataria, luxo, vestidos, roupas sociais"
}) => {
    const siteTitle = "Mendonça Dreams";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const currentUrl = url || window.location.href;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        "name": "Mendonça Dreams",
        "description": description,
        "url": currentUrl,
        "image": image,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR"
        }
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;
