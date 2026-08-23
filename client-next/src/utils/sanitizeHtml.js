import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty) {
  if (!dirty) return '';
  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'a', 'mark', 'br', 'u', 's'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });

  // Strip any existing target/rel attributes to avoid duplicates,
  // then add our secure target="_blank" rel="noopener noreferrer"
  return clean.replace(/<a([^>]+)>/gi, (match, innerAttrs) => {
    const withoutTargetRel = innerAttrs
      .replace(/\s*target=(["']).*?\1/gi, '')
      .replace(/\s*rel=(["']).*?\1/gi, '');
    return `<a${withoutTargetRel} target="_blank" rel="noopener noreferrer">`;
  });
}
