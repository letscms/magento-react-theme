/**
 * Utility functions for formatting data in the application
 */

/**
 * Formats a number as a price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currencyCode - The currency code (default: 'USD')
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currencyCode = 'USD', locale = 'en-US') => {
  if (price === null || price === undefined) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Formats a date string into a more readable format
 * @param {string} dateString - The date string to format
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};