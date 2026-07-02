import { useEffect } from 'react';

export function useDocumentMetadata({ title, description, canonicalUrl, ogTitle, ogDescription, ogUrl }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    // 1. Description Meta Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc && description) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // 2. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink && canonicalUrl) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    if (canonicalLink && canonicalUrl) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // 3. Open Graph Tags
    const ogTags = {
      'og:title': ogTitle || title,
      'og:description': ogDescription || description,
      'og:url': ogUrl || canonicalUrl,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      }
    });
  }, [title, description, canonicalUrl, ogTitle, ogDescription, ogUrl]);
}
