/**
 * Format a number as a price with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: USD)
 * @param {string} locale - The locale to use for formatting (default: en-US)
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currencyCode = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string
 * @param {string|Date} dateString - The date to format
 * @param {string} locale - The locale to use for formatting (default: en-US)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, locale = 'en-US') => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format a number with thousand separators
 * @param {number} number - The number to format
 * @param {string} locale - The locale to use for formatting (default: en-US)
 * @returns {string} Formatted number
 */
export const formatNumber = (number, locale = 'en-US') => {
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Convert camelCase or snake_case to Title Case
 * @param {string} text - The text to convert
 * @returns {string} Title cased text
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  
  // Handle camelCase
  const fromCamelCase = text.replace(/([A-Z])/g, ' $1');
  
  // Handle snake_case
  const fromSnakeCase = fromCamelCase.replace(/_/g, ' ');
  
  // Capitalize first letter of each word
  return fromSnakeCase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default {
  formatPrice,
  formatDate,
  truncateText,
  formatNumber,
  toTitleCase
};