/**
 * Unit tests for URL Helper module
 */

const {
  isValidUrl,
  extractDomain,
  isAllowedDomain,
  addQueryParam,
  removeQueryParam
} = require('../../src/modules/urlHelper');

describe('URL Helper Utilities', () => {

  describe('isValidUrl', () => {
    test('should return true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://subdomain.example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('http://example.com:8080')).toBe(true);
    });

    test('should return true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true);
      expect(isValidUrl('https://example.com#hash')).toBe(true);
    });

    test('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('file:///path/to/file')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });
  });

  describe('extractDomain', () => {
    test('should extract domain from valid URLs', () => {
      expect(extractDomain('http://example.com')).toBe('example.com');
      expect(extractDomain('https://subdomain.example.com')).toBe('subdomain.example.com');
      expect(extractDomain('http://example.com:8080/path')).toBe('example.com');
      expect(extractDomain('https://example.com?query=value')).toBe('example.com');
    });

    test('should return null for invalid URLs', () => {
      expect(extractDomain('not-a-url')).toBeNull();
      expect(extractDomain('')).toBeNull();
      expect(extractDomain(null)).toBeNull();
    });
  });

  describe('isAllowedDomain', () => {
    const allowedDomains = ['example.com', '*.google.com', 'github.com'];

    test('should return true for exact domain matches', () => {
      expect(isAllowedDomain('https://example.com', allowedDomains)).toBe(true);
      expect(isAllowedDomain('https://github.com/user/repo', allowedDomains)).toBe(true);
    });

    test('should handle wildcard subdomain matching', () => {
      expect(isAllowedDomain('https://mail.google.com', allowedDomains)).toBe(true);
      expect(isAllowedDomain('https://docs.google.com', allowedDomains)).toBe(true);
      expect(isAllowedDomain('https://google.com', allowedDomains)).toBe(true);
    });

    test('should return false for non-allowed domains', () => {
      expect(isAllowedDomain('https://notallowed.com', allowedDomains)).toBe(false);
      expect(isAllowedDomain('https://microsoft.com', allowedDomains)).toBe(false);
    });

    test('should return false for invalid URLs', () => {
      expect(isAllowedDomain('not-a-url', allowedDomains)).toBe(false);
      expect(isAllowedDomain('', allowedDomains)).toBe(false);
    });
  });

  describe('addQueryParam', () => {
    test('should add query parameter to URL without existing params', () => {
      const result = addQueryParam('https://example.com', 'key', 'value');
      expect(result).toBe('https://example.com/?key=value');
    });

    test('should add query parameter to URL with existing params', () => {
      const result = addQueryParam('https://example.com?existing=param', 'key', 'value');
      expect(result).toBe('https://example.com/?existing=param&key=value');
    });

    test('should update existing query parameter', () => {
      const result = addQueryParam('https://example.com?key=old', 'key', 'new');
      expect(result).toBe('https://example.com/?key=new');
    });

    test('should throw error for invalid URLs', () => {
      expect(() => addQueryParam('not-a-url', 'key', 'value')).toThrow('Invalid URL provided');
    });
  });

  describe('removeQueryParam', () => {
    test('should remove query parameter from URL', () => {
      const result = removeQueryParam('https://example.com?key=value&other=param', 'key');
      expect(result).toBe('https://example.com/?other=param');
    });

    test('should handle removing non-existent parameter', () => {
      const result = removeQueryParam('https://example.com?key=value', 'notexist');
      expect(result).toBe('https://example.com/?key=value');
    });

    test('should handle URL with no query parameters', () => {
      const result = removeQueryParam('https://example.com', 'key');
      expect(result).toBe('https://example.com/');
    });

    test('should throw error for invalid URLs', () => {
      expect(() => removeQueryParam('not-a-url', 'key')).toThrow('Invalid URL provided');
    });
  });
});
