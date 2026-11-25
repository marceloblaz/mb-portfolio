# mb-portfolio

Source for marcelobrasileiro.com. Static site, no build step: open `index.html` or serve the folder (`python3 -m http.server`).

## Homepage (study G)

- `index.html` — markup
- `css/site.css` — styles
- `js/main.js` — the hero light (WebGL), the headline focus on scroll, the "From problem to product" map and the work cards

The light's tuned values live in the `TW` table at the top of the light section in `js/main.js` (the last number on each row is the value used).

## Case studies

The case study pages (`*.html` besides `index.html`) still use the previous styles: `styles.scss` → `styles.css` (run `./watch.sh` to compile), `gambarino.css`, `switzer.css`, `fonts/` and `images/project-details/`.
