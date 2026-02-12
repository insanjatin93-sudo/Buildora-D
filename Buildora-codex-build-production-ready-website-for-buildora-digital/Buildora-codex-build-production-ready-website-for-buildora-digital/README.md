# Buildora Digital Website

Production-ready multi-page agency website for **Buildora Digital**.

## Pages
- Home (`index.html`)
- Services (`services.html`)
- About (`about.html`)
- Contact Us (`contact.html`)

## Stack
- HTML5
- Tailwind CSS via CDN
- Minimal Vanilla JavaScript (`assets/js/main.js`)

## Features
- Responsive sticky navbar with mobile hamburger menu
- Dark premium AI/tech visual style with cyan-blue accents
- Scroll reveal animations and hover glow effects
- WhatsApp-first CTA strategy with floating button on all pages
- Contact form with email client integration

## Run locally
Open `index.html` directly in your browser, or use a simple local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.


## Preview-friendly routes
- Added extensionless route helpers so `/services`, `/about`, and `/contact` also resolve in static preview environments.
