/**
 * Tells IndexNow (Bing, Yandex, Seznam, Naver…) which pages changed, so they
 * are recrawled in days instead of weeks. Bing is what ChatGPT and Copilot
 * search with.
 *
 *   node scripts/indexnow.mjs          pages whose sitemap lastmod is today or yesterday (UTC)
 *   node scripts/indexnow.mjs --all    every page in the sitemap
 *   add --dry-run to print the list without submitting anything
 *
 * Runs after each successful production deploy (.github/workflows/indexnow.yml).
 * It reads the LIVE sitemap, so it sees the dates of what was just deployed —
 * which only works because sitemap.ts moves a page's lastmod only when the
 * page itself changes.
 *
 * The key is public by design: IndexNow checks that the same key is served
 * at KEY_LOCATION, which proves the submitter controls the site.
 */

const SITE = 'https://www.luggagestorage-heraklion.com';
const KEY = 'cac37217cc0ef814a453f8186ce45fa1';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const all = process.argv.includes('--all');
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>/g)].map(
    ([, url, lastmod]) => ({ url, day: lastmod.slice(0, 10) })
  );
  if (entries.length === 0) throw new Error('No URLs found in the live sitemap.');

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const urlList = entries.filter((e) => all || e.day >= yesterday).map((e) => e.url);

  if (urlList.length === 0) {
    console.log(`Nothing to submit: no sitemap lastmod on or after ${yesterday}.`);
    return;
  }

  if (dryRun) {
    console.log(`Dry run — would submit ${urlList.length} URL(s):`);
    for (const url of urlList) console.log(`  ${url}`);
    return;
  }

  // A missing or stale key file makes IndexNow reject the whole batch (403),
  // so check it first and fail with a clear message instead.
  const served = (await (await fetch(KEY_LOCATION)).text()).trim();
  if (served !== KEY) throw new Error(`Key file not served at ${KEY_LOCATION} — deploy it first.`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });

  // 200 = accepted, 202 = accepted and the key is still being verified.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow answered ${res.status}: ${await res.text()}`);
  }
  console.log(`IndexNow ${res.status}: submitted ${urlList.length} URL(s)`);
  for (const url of urlList) console.log(`  ${url}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
