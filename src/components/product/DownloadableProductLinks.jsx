import React from 'react';
import { formatPrice } from '../../utils/formatters';
import { useConfig } from '../../hooks/useConfig'; // Import useConfig

const DownloadableProductLinks = ({ product }) => {
  const { baseMediaUrl } = useConfig(); // Get baseMediaUrl
  const { downloadable_product_links, downloadable_product_samples, links_purchased_separately } = product;

  const getFileUrl = (filePath) => {
    if (!filePath) return '#';
    // Assuming filePath is relative to media/downloadable/files (or similar)
    // Adjust the base path as per your Magento setup for downloadable files
    // This might require a specific base URL for downloadable products if different from general media.
    // For now, using baseMediaUrl as a placeholder, but this might need refinement.
    // Example: return `${baseMediaUrl}downloadable/files${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    // Magento often serves downloadable files through a controller, not direct media links before purchase.
    // For display of *samples*, direct links are more common.
    // For actual *links*, they are usually placeholder info until purchased.
    return '#'; // Placeholder, as actual link URL is post-purchase
  };

  const getSampleLink = (sample) => {
    if (sample.sample_type === 'url' && sample.sample_url) {
      return sample.sample_url;
    }
    if (sample.sample_type === 'file' && sample.sample_file) {
      // Construct URL for sample file, e.g., from pub/media/downloadable/files/samples
      // This path construction is an assumption.
      return `${baseMediaUrl || ''}downloadable/files/samples${sample.sample_file.startsWith('/') ? '' : '/'}${sample.sample_file}`;
    }
    return '#';
  };


  if ((!downloadable_product_links || downloadable_product_links.length === 0) && (!downloadable_product_samples || downloadable_product_samples.length === 0)) {
    return <p className="text-gray-600 mt-4">No downloadable content available for this product.</p>;
  }

  return (
    <div className="mt-4 mb-6 space-y-6">
      {downloadable_product_links && downloadable_product_links.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Downloadable Links</h4>
          {links_purchased_separately && (
            <p className="text-sm text-gray-500 mb-2">Links can be purchased separately.</p>
          )}
          <ul className="space-y-2 list-disc list-inside bg-gray-50 p-4 rounded-md border">
            {downloadable_product_links.map(link => {
              const linkSampleUrl = getSampleLink(link); // A link itself can have a sample
              return (
                <li key={link.id || link.link_id} className="text-gray-700">
                  {link.title || 'Downloadable Link'}
                  {link.price > 0 && (
                    <span className="ml-2 text-sm text-indigo-600">
                      (+{formatPrice(link.price, product.price_range?.minimum_price?.final_price?.currency || 'USD')})
                    </span>
                  )}
                  {/* Display sample for the link if available */}
                  {linkSampleUrl !== '#' && (
                    <a
                      href={linkSampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 text-sm text-indigo-500 hover:text-indigo-700 underline"
                    >
                      Sample
                    </a>
                  )}
                  {/* link.link_file would contain the path to the actual file, not directly linkable pre-purchase */}
                  {/* <p className="text-xs text-gray-400">File: {link.link_file}</p> */}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {downloadable_product_samples && downloadable_product_samples.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Product Samples</h4>
          <ul className="space-y-2 list-disc list-inside bg-gray-50 p-4 rounded-md border">
            {downloadable_product_samples.map(sample => {
              const sampleUrl = getSampleLink(sample);
              return (
                <li key={sample.id || sample.sample_id} className="text-gray-700">
                  {sample.title || 'Sample File'}
                  {sampleUrl !== '#' ? (
                    <a
                      href={sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 text-sm text-indigo-500 hover:text-indigo-700 underline"
                    >
                      Download Sample
                    </a>
                  ) : (
                    <span className="ml-3 text-sm text-gray-400">(Sample not available)</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DownloadableProductLinks;