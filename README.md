# Blissful Strokes — www.blissfulstrokes.com

Static site (plain HTML/CSS/JS, no build step) for Shabari Khaire, artist & painter.
Designed to be hosted free on GitHub Pages with DNS on Cloudflare.

```
index.html          Home — hero, featured paintings, My Story, For Galleries
paintings.html      Full painting portfolio (12 slots)
about.html          My Story
galleries.html      For Galleries & Art Professionals
contact.html        Contact form + email
404.html            Not-found page
assets/css/style.css
assets/js/main.js   Nav, scroll reveal, lightbox
images/             Artwork goes here
files/              Artist CV PDF goes here
CNAME               www.blissfulstrokes.com  (do not delete — GitHub Pages reads this)
```

---

## 1. Add the images

Nothing renders yet because there are no image files. Every empty slot shows a
labelled placeholder tile naming the exact file it wants, so you can see what is
missing by opening the site locally.

Filenames the site expects:

| Where | Files |
|---|---|
| Hero (full-width, wide crop) | `images/hero/hero.jpg` |
| Portrait of the artist | `images/portrait.jpg` |
| Paintings | `images/paintings/painting-01.jpg` … `painting-12.jpg` |
| Artist CV | `files/shabari-khaire-artist-cv.pdf` |

The first six paintings are the ones shown on the home page.

The helper script copies, resizes and compresses in one go (macOS, no installs):

```bash
chmod +x add-images.sh
./add-images.sh hero        ~/Desktop/best-painting.jpg
./add-images.sh portrait    ~/Desktop/shabari.jpg
./add-images.sh paintings   ~/Desktop/paintings-folder
```

Source files are used in filename order, so prefix them `01-`, `02-`, … to set
the order on the site.

Then edit the titles, medium and dimensions in `index.html` and `paintings.html`
— search for `Painting 01`. Delete any `<figure class="piece">` block you don't
have an image for.

## 2. Preview locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## 3. Contact form

The form posts to [Formspree](https://formspree.io) form `mkjgakel` (free plan,
50 submissions/month) and submits via fetch so the visitor stays on the page.
The destination address must be verified in the Formspree dashboard or
submissions are accepted and then dropped.

The Instagram URL (`https://www.instagram.com/`) is still a placeholder — update
it in the footer of every page.

## 4. Publish to GitHub Pages

```bash
cd /Users/ggundal/Desktop/backup-laptop-old/Desktop/Amazon_Internal/Personal/Shabari/Painting/website
git init -b main
git add .
git commit -m "Blissful Strokes site"

# Create the repo (public — Pages needs public on free accounts):
gh repo create blissfulstrokes --public --source=. --remote=origin --push
# ...or create it in the GitHub UI and:
#   git remote add origin https://github.com/<you>/blissfulstrokes.git && git push -u origin main
```

In the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
Under **Custom domain** enter `www.blissfulstrokes.com` and save. Leave
**Enforce HTTPS** unchecked until the certificate is issued, then tick it.

To publish later changes: `git add -A && git commit -m "update" && git push`.

## 5. Cloudflare DNS

In Cloudflare → `blissfulstrokes.com` → **DNS → Records**, add:

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | `www` | `<your-github-username>.github.io` | **DNS only** (grey cloud) |
| A | `@` | `185.199.108.153` | **DNS only** |
| A | `@` | `185.199.109.153` | **DNS only** |
| A | `@` | `185.199.110.153` | **DNS only** |
| A | `@` | `185.199.111.153` | **DNS only** |

The four A records let `blissfulstrokes.com` (no `www`) redirect to the `www`
version, which GitHub does automatically once the custom domain is set.

Keep the proxy **off** (grey cloud) at least until GitHub has issued the TLS
certificate — an orange-cloud proxy blocks the domain-validation check and
Pages will report "certificate not yet issued". If you later want Cloudflare's
proxy on, first confirm HTTPS works, then set Cloudflare **SSL/TLS → Overview →
Full (strict)** before switching the cloud to orange. Anything less than Full
will cause a redirect loop with GitHub Pages.

Verification once DNS has propagated (a few minutes to an hour):

```bash
dig +short www.blissfulstrokes.com
curl -sI https://www.blissfulstrokes.com | head -1
```

---

## Design notes

Cream background, generous whitespace, Cormorant Garamond for display text and
Inter for UI — deliberately quiet so the artwork supplies the colour. Responsive
down to small phones, keyboard-accessible, lightbox with arrow-key navigation,
and `prefers-reduced-motion` respected.
