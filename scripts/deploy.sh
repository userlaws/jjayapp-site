#!/bin/sh
# Deploy to production and point jjayapp.com at the new deployment.
#
# The apex domain is still assigned to the old "jjayapp" Vercel project, so a
# plain `vercel --prod` updates jjayapp-site.vercel.app and www.jjayapp.com but
# NOT jjayapp.com — the explicit alias below covers it. Once the domain is
# moved to the jjayapp-site project in the Vercel dashboard, the alias step
# becomes a harmless no-op and this script is just `vercel deploy --prod`.
set -e
URL=$(vercel deploy --prod)
vercel alias set "$URL" jjayapp.com
echo "Live: https://jjayapp.com"
