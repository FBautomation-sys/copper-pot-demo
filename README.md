# The Copper Pot Eatery, demo restaurant PWA

A fully fictional demo restaurant app in the Bean & Leaf pattern. Mobile first,
light theme, WhatsApp collection ordering, loyalty club, table bookings and a
staff kitchen board. No build step, plain HTML, CSS and JavaScript.

## Run it

Serve the folder over HTTP (a service worker needs http or https):

```
cd copper-pot-pwa
python -m http.server 8080
```

Then open http://localhost:8080 on a phone or in mobile view in devtools.

## What is inside

- Splash and home with open or closed badge, hero photo, 2x2 CTA grid
- Menu with 5 categories and 20 items, each with its own photo
- Item sheet with extras, notes and quantity, adds to the WhatsApp cart
- WhatsApp cart with edit, delete, totals, sends the order to WhatsApp,
  payment happens in store on collection
- Copper Club loyalty: join with name and number, 1 point per R10,
  tiers Ember, Flame, Forge, a 10 stamp card and two rewards
- Book a table via WhatsApp deep link, with a dog friendly option
- Events and specials, notices (allergens, wait times, load shedding, seasonal)
- Account with past orders, language and a delete-my-data button (POPIA)
- Staff and kitchen mode, PIN 2021: live order board with
  new, preparing, ready states, an 86 list, and dine in points capture
- AFR and ENG toggle across the whole UI
- PWA: manifest, icons from the logo, offline app shell cache

## Demo data

Everything is fictional and seeded in `data.js`:

- Restaurant: The Copper Pot Eatery, 12 Kerk Street, Stellenbosch
- WhatsApp and phone use fictional 555 numbers, replace them in `RESTAURANT`
- Every photo is AI generated and flagged with `photoAi: true` in the menu
  data so a real photo can replace it later
- Three fake kitchen orders are seeded so the kitchen board looks alive

## Google Analytics

There is a commented block in `index.html` waiting for a real
G- measurement ID. Do not ship a made up one.

## Swapping in a real restaurant

1. Replace `RESTAURANT`, `MENU`, `EVENTS`, `NOTICES` in `data.js`
2. Drop real photos into `images/` and set `photoAi: false` per item
3. Replace `images/logo.png` and `images/hero-venue.png`
4. Update the manifest name and the WhatsApp number
