import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'a', 'mark', 'br', 'u', 's'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}
