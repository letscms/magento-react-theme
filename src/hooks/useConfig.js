import { useState, useEffect } from 'react';

/**
 * Hook to provide configuration settings for the application
 * Particularly useful for base URLs and other environment-specific settings
 */
export function useConfig() {
  // You can load these from environment variables or a config file
  const [config, setConfig] = useState({
    // Base URL for media files in Magento
    baseMediaUrl: import.meta.env.VITE_BASE_URL ,

    // Base URL for the API
    baseApiUrl: import.meta.env.VITE_MAGENTO_API_URL,

    // Other configuration settings
    currency: {
      code: 'USD',
      symbol: '$'
    }
  });

  useEffect(() => {
    // You could fetch configuration from an API or local storage here
    // This is useful if you need to dynamically update configuration

    // Example:
    // async function loadConfig() {
    //   try {
    //     const response = await fetch('/api/config');
    //     const data = await response.json();
    //     setConfig(prevConfig => ({
    //       ...prevConfig,
    //       ...data
    //     }));
    //   } catch (error) {
    //     console.error('Failed to load configuration:', error);
    //   }
    // }
    // 
    // loadConfig();
  }, []);

  return config;
}

export default useConfig;