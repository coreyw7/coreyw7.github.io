# Corey Warden — Portfolio

Plain HTML/CSS. No build step, no framework.

```
index.html              home: hero, project cards, experience, about, contact
css/style.css           all styling. THEME tokens at the top control the whole look
projects/*.html         one case study per project
assets/                 resume.pdf, headshot.jpg, screenshots, diagrams
```

## Preview locally
```bash
cd ~/Desktop/portfolio && python3 -m http.server 8080
```
Then open http://localhost:8080

## Your TODO list
Search the code for `TODO` to find each spot.

- [ ] **Pick the look.** Edit the colors and fonts in the `:root` block in `css/style.css`.
- [ ] **Hero headline and tagline.** Rewrite them in your voice (`index.html`).
- [ ] **About section.** Make it sound like you.
- [ ] **Resume PDF.** Add it at `assets/resume.pdf`. Remove your street address and phone number first, since this site is public.
- [ ] **Headshot.** Add it at `assets/headshot.jpg` and swap in the `<img>`.
- [ ] **Case studies.** Fill in the "problem," "result," and "what I learned" TODOs on each page.
- [ ] **Pathways.** Get the board's OK before naming them. Until then, the copy stays generic.
- [ ] **Centene.** Don't include proprietary code, screenshots, or internal system names.
- [ ] **Visuals.** Replace each `visual-placeholder` with a screenshot, GIF, or diagram.
- [ ] **CBB card.** Rewrite it, or remove it until you're ready to show it.

## Deploy (GitHub Pages)
1. Create a public repo named **`coreyw7.github.io`** on GitHub.
2. Push this folder to it:
   ```bash
   git init && git add . && git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/coreyw7/coreyw7.github.io.git
   git push -u origin main
   ```
3. Go to Settings → Pages and set the source to `main` / root.
4. The site goes live at https://coreyw7.github.io within about a minute.

## Travel map photos
Put photos in `assets/travel/`, three per place, using these names:

| Place | Files |
|---|---|
| Australia | `australia-1.jpg`, `australia-2.jpg`, `australia-3.jpg` |
| Malaysia | `malaysia-1.jpg` … `-3.jpg` |
| Thailand | `thailand-1.jpg` … `-3.jpg` |
| Vietnam | `vietnam-1.jpg` … `-3.jpg` |
| Florence & Tuscany | `italy-1.jpg` … `-3.jpg` |
| Dominican Republic | `dominican-1.jpg` … `-3.jpg` |
| Grand Tetons | `tetons-1.jpg` … `-3.jpg` |

- Square-ish photos look best, because they're cropped to squares.
- Resize them to about 600px wide so the page stays fast.
- A missing photo shows a "Photo" placeholder, so you can add them a few at a time.
- To move pins, add captions, or add a trip, edit the `PLACES` list at the top of `js/travel.js`.
- The map loads its land shapes from a CDN (jsdelivr). If that fails, the trip list below the map still opens the photos.
