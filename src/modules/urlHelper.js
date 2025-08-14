/**
 * URL Helper Utilities
 * Common functions for URL manipulation and validation
 */

/**
 * Check if a URL is valid
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Extract domain from URL
 * @param {string} url - The URL to extract domain from
 * @returns {string|null} - The domain or null if invalid
 */
function extractDomain(url) {
  if (!isValidUrl(url)) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return null;
  }
}

/**
 * Check if URL is from allowed domains
 * @param {string} url - The URL to check
 * @param {string[]} allowedDomains - List of allowed domains
 * @returns {boolean} - True if allowed, false otherwise
 */
function isAllowedDomain(url, allowedDomains = []) {
  const domain = extractDomain(url);
  if (!domain) return false;

  return allowedDomains.some(allowed => {
    if (allowed.startsWith('*.')) {
      // Wildcard subdomain matching
      const baseDomain = allowed.slice(2);
      return domain === baseDomain || domain.endsWith(`.${  baseDomain}`);
    }
    return domain === allowed;
  });
}

/**
 * Add or update query parameter in URL
 * @param {string} url - The URL to modify
 * @param {string} key - Query parameter key
 * @param {string} value - Query parameter value
 * @returns {string} - Modified URL
 */
function addQueryParam(url, key, value) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided');
  }

  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
}

/**
 * Remove query parameter from URL
 * @param {string} url - The URL to modify
 * @param {string} key - Query parameter key to remove
 * @returns {string} - Modified URL
 */
function removeQueryParam(url, key) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided');
  }

  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
}

module.exports = {
  isValidUrl,
  extractDomain,
  isAllowedDomain,
  addQueryParam,
  removeQueryParam
};
