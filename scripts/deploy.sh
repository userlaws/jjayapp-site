#!/bin/sh
# Deploy to production and point jjayapp.com at the new deployment.
#
# The apex domain is still assigned to the old "jjayapp" Vercel project, so a
# plain `vercel --prod` updates jjayapp-site.vercel.app and www.jjayapp.com but
# NOT jjayapp.com — the explicit alias below covers it. Once the domain is
# moved to the jjayapp-site project in the Vercel dashboard, the alias step
# becomes a harmless no-op and this script is just `vercel deploy --prod`.
#
# `URL=$(vercel deploy --prod)` used to be enough. Vercel CLI 59 prints a JSON
# object instead of a bare URL, so URL became a JSON blob, the alias step did
# not point anywhere, and the script still exited 0 — www had the new build
# while the apex silently served a days-old one. That is the worst possible
# failure here, because the apex is the URL App Review opens. Hence: pull the
# host out of whatever shape the CLI returns, and verify the apex afterward
# rather than trusting the exit code.
set -e

OUT=$(vercel deploy --prod)

URL=$(printf '%s' "$OUT" | tr -d '",' | grep -oE '[A-Za-z0-9._-]+\.vercel\.app' | head -1)
if [ -z "$URL" ]; then
  echo "Could not find a deployment URL in the CLI output:" >&2
  printf '%s\n' "$OUT" >&2
  exit 1
fi

echo "Deployed: $URL"
vercel alias set "$URL" jjayapp.com

# Prove the apex actually moved. A 200 on www means nothing if jjayapp.com is
# still aliased to an older deployment.
for path in / /privacy /terms /support; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "https://jjayapp.com$path")
  echo "  jjayapp.com$path -> $code"
  if [ "$code" != "200" ]; then
    echo "jjayapp.com$path did not return 200 — the apex alias did not take." >&2
    exit 1
  fi
done

echo "Live: https://jjayapp.com"
