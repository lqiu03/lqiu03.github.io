# Lucas Qiu — personal website

A single-page personal site: the "Quiet Scholar" design with a motion layer
(custom cursor, headshot tilt, scroll reveals, and an interactive reading
bookshelf). It is a static site with no build step — React and Babel load from a
CDN and the JSX is transpiled in the browser — so the repository can be served
as-is by GitHub Pages.

## Local preview

Babel fetches the `.jsx` files over HTTP, so serve the folder (do not open
`index.html` directly via `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Structure

- `index.html` — entry point; mounts the page and holds the responsive (<= 700px) layer
- `v1-scholar.jsx` — page layout and content
- `v1-scholar-wow.jsx` — motion layer
- `books.jsx` — reading bookshelf
- `books-data.js` — reading-list data
- `shared.jsx` — profile, writing, publications, and the headshot component
- `headshot.jpg` — portrait

## Deploy to GitHub Pages

User site (served at `https://lqiu03.github.io`):

```bash
# create the repo on GitHub and push (requires the gh CLI, authenticated)
gh repo create lqiu03.github.io --public --source=. --remote=origin --push
```

Or manually, against an existing empty repo:

```bash
git remote add origin git@github.com:lqiu03/lqiu03.github.io.git
git push -u origin main
```

Then in the repository settings, under Pages, set the source to the `main`
branch (root). The site builds within a minute or two.

## Notes

- `.nojekyll` disables Jekyll so every file (including `.jsx`) is served verbatim.
- The custom cursor and headshot tilt are pointer-driven and are inactive on
  touch devices by design; scroll- and load-driven motion still runs on mobile.
- Optional optimization: precompile the JSX into a single bundle to drop the
  in-browser Babel transformer and speed up first paint.
