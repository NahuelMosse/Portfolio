// Tells a bot wall or an error page from the page a site serves, from its HTTP answer alone (status, title, visible text),
// so that a challenge page is never audited as if it were the site. Only pages on the internet are asked: a local app
// answers 404 and has short pages on purpose.
const BOT_WALL_TIMEOUT_MS = 15000;
const WALL_TEXT = 1500;
const TITLES = /just a moment|attention required|verify you are human|access denied|are you a robot|security check|ddos protection/i;
const BODIES = /enable javascript and cookies|verify you are human|captcha|checking your browser|cf-chl|cf-browser-verification|access denied|unusual traffic/i;
const LOOPBACK = ['localhost', '127.0.0.1', '[::1]', '0.0.0.0'];

/** Whether `url` is an http(s) page outside this machine. */
export const isExternal = (url) => {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) && !LOOPBACK.includes(u.hostname) && !u.hostname.endsWith('.localhost');
  } catch { return false; }
};

// Script, style and noscript bodies are never evidence: a shop's own script may name «captcha» without a challenge in sight.
const visibleText = (html) => html
  .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?(<\/\1\s*>|$)/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/**
 * The reason an answer is a bot wall or an error page, or null when it looks like the site.
 * @param {{ status: number, html: string }} answer
 * @returns {string | null}
 */
export const wallReason = ({ status, html }) => {
  if (status >= 400) return `status ${status}`;
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g, ' ').trim() ?? '';
  if (TITLES.test(title)) return `title "${title.slice(0, 60)}"`;
  const text = visibleText(html);
  const body = text.length < WALL_TEXT ? BODIES.exec(text) : null;
  if (body) return `text matches "${body[0]}"`;
  return null;
};

/**
 * Asks `url` for its page and returns the reason it is a bot wall or an error page, or null (also when it is not an
 * external page, or does not answer: the audit then reports its own error).
 * @param {string} url
 * @param {{ fetch?: typeof fetch }} [deps]
 * @returns {Promise<string | null>}
 */
export const httpWall = async (url, { fetch: get = globalThis.fetch } = {}) => {
  if (!isExternal(url)) return null;
  const response = await get(url, { redirect: 'follow', signal: AbortSignal.timeout(BOT_WALL_TIMEOUT_MS) }).catch(() => null);
  if (!response) return null;
  const html = await response.text().catch(() => '');
  return wallReason({ status: response.status, html });
};

export const wallMessage = (url, reason) => `${url} answered a bot wall or an error page (${reason}): nothing was audited`;
