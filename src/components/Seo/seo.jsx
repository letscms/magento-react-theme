import { useEffect, useLayoutEffect } from "react";

const Seo = ({
  title = "",
  description = "",
  keywords = "",
  ogTitle = "",
  ogDescription = "",
  ogImage = "",
  ogUrl = "",
  twitterCard = "summary_large_image",
  twitterSite = "",
  twitterCreator = "",
  canonicalUrl = "",
}) => {
    
  useEffect(() => {
    // Set document title
    document.title = title || "Letscms React Magento Theme";

    // Helper function to update or create meta tags
    const updateMetaTag = (name, content, attribute = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      if (content) {
        element.setAttribute("content", content);
      } else {
        element.remove();
      }
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // OpenGraph meta tags
    updateMetaTag("og:title", ogTitle || title, "property");
    updateMetaTag("og:description", ogDescription || description, "property");
    updateMetaTag("og:image", ogImage, "property");
    updateMetaTag("og:url", ogUrl || window.location.href, "property");
    updateMetaTag("og:type", "website", "property");
    updateMetaTag("og:locale", "en_US", "property");

    // Twitter card meta tags
    updateMetaTag("twitter:card", twitterCard, "name");
    updateMetaTag("twitter:site", twitterSite, "name");
    updateMetaTag("twitter:creator", twitterCreator, "name");
    updateMetaTag("twitter:title", ogTitle || title, "name");
    updateMetaTag("twitter:description", ogDescription || description, "name");
    updateMetaTag("twitter:image", ogImage, "name");

    // Canonical link
    let link = document.querySelector("link[rel='canonical']");
    if (canonicalUrl) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    } else if (link) {
      link.remove();
    }

    // Cleanup function
    return () => {
      document.title = "Letscms React Magento Theme";
      // Optionally reset other meta tags to defaults if needed
    };
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterSite,
    twitterCreator,
    canonicalUrl,
  ]);

  return null;
};

export default Seo;
