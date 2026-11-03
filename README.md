# Sathi & Niladri — Wedding Invitation

Static site, no build step. Plain HTML, CSS and JavaScript.

## Structure

```
index.html            Redirects to the English page
en/index.html         English invitation
bn/index.html         Bangla invitation
assets/
  css/style.css       Shared styles (language differences via html[lang])
  js/main.js          Shared behaviour: quiz, envelope, doors, petals, parallax, countdown, sound
  js/lang-en.js       English quiz text and messages
  js/lang-bn.js       Bangla quiz text and messages
  images/*.svg        Shared illustrations (mehendi has en/bn versions)
```

All paths are relative, so the site works when opened from disk and when hosted at any URL.

## Links to share

- English: `https://<project>.pages.dev/en/`
- Bangla:  `https://<project>.pages.dev/bn/`

## Deploy to Cloudflare Pages

Workers & Pages → Create → Pages → Upload assets → new project → drop this folder (or the zip) → Deploy.

## Preview locally

Open `en/index.html` or `bn/index.html` in a browser. Fonts load from Google Fonts, so an internet connection is needed for the correct typefaces.
