# Our Little World ♡ — Anniversary Website

A romantic, responsive anniversary microsite made with plain HTML, CSS and JavaScript. Includes an interactive make-your-own bouquet section. No Canva Premium or build tools required.

## Preview locally
Open `index.html` in a browser. The camera feature requires a secure context such as GitHub Pages (`https://...`) or localhost.

## Personalise it

### 1. Your letter
Open `index.html` and edit the paragraphs inside `#letterCopy`. Change the sign-off to your names or nicknames.

### 2. Add your photos
Put your photos in `assets/photos/`. The gallery is set up for four images named `memory-1.jpg` through `memory-4.jpg` in `assets/photos/`. If an image is missing, a decorative placeholder appears. To add your photos, upload them with those filenames.
```html
<div class="photo-placeholder"><span>♡</span><small>Add your photo</small></div>
```
with:
```html
<img class="memory-image" src="assets/photos/memory-1.jpg" alt="Our memory">
```
Then add this to `style.css`:
```css
.memory-image { width: 100%; aspect-ratio: 3 / 3.6; object-fit: cover; display: block; }
```
Repeat for each photo and update the captions.

### 3. Song
The site embeds the official YouTube audio for Arctic Monkeys' “I Wanna Be Yours”, so it can play from the visible YouTube controls without bundling copyrighted music. If you change the song, replace the YouTube video ID in the `youtubeSong` iframe URL in `index.html`.

### 4. Add a photo to the story section
Replace the `.story-photo` placeholder in `index.html` with an image:
```html
<div class="story-photo"><img class="story-image" src="assets/photos/favourite.jpg" alt="Us together"></div>
```
Add:
```css
.story-image { width: 100%; height: 100%; min-height: 280px; object-fit: cover; }
```

## Publish on GitHub Pages
1. Sign in to GitHub and create a repository, for example `our-anniversary`.
2. Upload `index.html`, `style.css`, `script.js`, `README.md`, and the `assets` folder.
3. In the repository, open **Settings → Pages**.
4. Under the build/deployment section, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for the published URL shown in Settings → Pages. It will usually look like `https://YOUR-USERNAME.github.io/our-anniversary/`.

## Important
- A public GitHub repository makes the source files public. Avoid uploading private or sensitive images to a public repository.
- Camera access requires HTTPS and browser permission. It starts only after the visitor clicks **Turn on camera**.
- Music playback requires a real audio file. Use audio you own or are permitted to share.

## Bouquet builder
The bouquet section lets visitors add flowers, choose wrapping colours, write a note, and download a custom SVG bouquet card. It runs entirely in the browser.

## Anniversary personalisation
The opening and letter are personalised for your fourth anniversary on 9 November 2026. The gallery uses four photo slots, and the interactive bouquet builder lets visitors choose flowers, wrapping, and a note, then download a bouquet card.
