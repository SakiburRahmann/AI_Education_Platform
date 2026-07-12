/**
 * HTML sanitizer using DOMPurify to safely render HTML content.
 * Used by the blog to prevent XSS from dangerouslySetInnerHTML.
 */
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML string, allowing only safe tags and attributes.
 * Falls back to a regex-based tag-stripper if DOMPurify is unavailable.
 */
export async function sanitizeHtml(html: string): Promise<string> {
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p", "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li",
        "strong", "em", "b", "i", "u", "s",
        "a", "img", "br", "hr",
        "blockquote", "pre", "code", "span", "div",
        "table", "thead", "tbody", "tr", "th", "td",
        "dl", "dt", "dd",
        "sub", "sup", "abbr", "cite",
      ],
      ALLOWED_ATTR: [
        "href", "target", "rel",
        "src", "alt", "width", "height",
        "class", "id",
        "style", "title",
      ],
      ALLOW_DATA_ATTR: false,
    });
  } catch {
    // Fallback: strip script tags, event handlers, and javascript: URIs
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<[\s\S]*?on\w+\s*=\s*["'][^"']*["'][\s\S]*?>/gi, "")
      .replace(/\bhref\s*=\s*["']\s*javascript\s*:/gi, 'href="#"')
      .replace(/\bsrc\s*=\s*["']\s*javascript\s*:/gi, 'src="#"');
  }
}
