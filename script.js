const chapters = [...document.querySelectorAll('.chapter')];
const chapterLabel = document.getElementById('chapterLabel');
const labels = {
  intro:'A LITTLE SOMETHING FOR YOU', letter:'A NOTE FROM ME',
  memories:'OUR LITTLE COLLECTION', bouquet:'MAKE A LITTLE BOUQUET', song:'OUR SONG', story:'OUR STORY', booth:'A NEW MEMORY'
};
function showChapter(id) {
  chapters.forEach(section => section.classList.toggle('active', section.id === id));
  chapterLabel.textContent = labels[id] || 'JUST YOU & ME';
  window.scrollTo({top:0, behavior:'smooth'});
}
document.getElementById('openLetter').addEventListener('click', () => {
  const button = document.getElementById('openLetter');
  button.classList.add('opening');
  setTimeout(() => showChapter('letter'), 650);
});
document.querySelectorAll('[data-next]').forEach(button => {
  button.addEventListener('click', () => showChapter(button.dataset.next));
});
document.getElementById('backToStart').addEventListener('click', () => showChapter('intro'));

// The song is embedded from the official YouTube audio, so no MP3 upload is needed.
const youtubeSong = document.getElementById('youtubeSong');
// Note: YouTube's own visible play controls are used to respect playback and copyright rules.

// Live photobooth: camera starts only after a clear user click.
const camera = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const placeholder = document.getElementById('cameraPlaceholder');
const startCamera = document.getElementById('startCamera');
const takePhoto = document.getElementById('takePhoto');
const countdown = document.getElementById('countdown');
const boothResult = document.getElementById('boothResult');
let cameraStream = null;
startCamera.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Camera access is not available here. Open the published HTTPS website in a modern browser.');
    return;
  }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:false});
    camera.srcObject = cameraStream;
    camera.hidden = false;
    placeholder.hidden = true;
    takePhoto.disabled = false;
    startCamera.textContent = 'Camera is on ✓';
  } catch (error) {
    alert('Camera permission was not granted. Allow camera access in your browser settings and try again.');
  }
});
takePhoto.addEventListener('click', async () => {
  if (!cameraStream) return;
  takePhoto.disabled = true;
  for (let n=3; n>0; n--) {
    countdown.textContent=n;
    await new Promise(resolve => setTimeout(resolve, 700));
  }
  countdown.textContent='♡';
  canvas.width=camera.videoWidth || 640;
  canvas.height=camera.videoHeight || 480;
  const ctx=canvas.getContext('2d');
  // Mirror the selfie as people usually expect from a front-facing photobooth.
  ctx.translate(canvas.width,0); ctx.scale(-1,1);
  ctx.drawImage(camera,0,0,canvas.width,canvas.height);
  const imageUrl=canvas.toDataURL('image/png');
  document.getElementById('capturedImage').src=imageUrl;
  document.getElementById('downloadPhoto').href=imageUrl;
  boothResult.hidden=false;
  takePhoto.disabled=false;
  countdown.textContent='';
});
document.getElementById('retake').addEventListener('click', () => { boothResult.hidden=true; });
window.addEventListener('beforeunload', () => {
  if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
});

// Letter editor: changes persist in this browser, so the note can be tried and refined.
const letterCopy = document.getElementById('letterCopy');
const editLetter = document.getElementById('editLetter');
const saveLetter = document.getElementById('saveLetter');
const resetLetter = document.getElementById('resetLetter');
const editHint = document.getElementById('editHint');
const defaultLetterHTML = letterCopy.innerHTML;
const savedLetterHTML = localStorage.getItem('jiyaSuryanshLetter');
if (savedLetterHTML) letterCopy.innerHTML = savedLetterHTML;
function setLetterEditing(enabled) {
  letterCopy.contentEditable = enabled ? 'true' : 'false';
  letterCopy.classList.toggle('editing', enabled);
  editLetter.hidden = enabled;
  saveLetter.hidden = !enabled;
  resetLetter.hidden = !enabled;
  editHint.hidden = !enabled;
  if (!enabled) {
    localStorage.setItem('jiyaSuryanshLetter', letterCopy.innerHTML);
  }
}
editLetter.addEventListener('click', () => setLetterEditing(true));
saveLetter.addEventListener('click', () => setLetterEditing(false));
resetLetter.addEventListener('click', () => {
  if (confirm('Reset the letter to the original version?')) {
    letterCopy.innerHTML = defaultLetterHTML;
    localStorage.removeItem('jiyaSuryanshLetter');
  }
});

// Interactive flower bouquet builder.
const bouquetFlowers = document.getElementById('bouquetFlowers');
const wrapChoice = document.getElementById('wrapChoice');
const bouquetWrap = document.getElementById('bouquetWrap');
const bouquetCount = document.getElementById('bouquetCount');
const bouquetCard = document.getElementById('bouquetCard');
const bouquetMessage = document.getElementById('bouquetMessage');
const savedFlowers = document.getElementById('savedFlowers');
const savedMessage = document.getElementById('savedMessage');
let flowers = ['🌹','🌷','🌼'];

function renderBouquet() {
  bouquetFlowers.innerHTML = '';
  flowers.forEach((flower, index) => {
    const item = document.createElement('span');
    item.className = 'bouquet-flower';
    item.textContent = flower;
    item.style.setProperty('--tilt', `${(index % 3 - 1) * 7}deg`);
    bouquetFlowers.appendChild(item);
  });
  bouquetWrap.className = `bouquet-wrap ${wrapChoice.value}`;
  bouquetCount.textContent = `${flowers.length} ${flowers.length === 1 ? 'flower' : 'flowers'} in your bouquet`;
  bouquetCard.hidden = true;
}
document.querySelectorAll('.flower-option').forEach(button => {
  button.addEventListener('click', () => {
    if (flowers.length >= 12) {
      bouquetCount.textContent = 'Your bouquet is full — 12 flowers is the limit. ♡';
      return;
    }
    flowers.push(button.dataset.flower);
    renderBouquet();
  });
});
wrapChoice.addEventListener('change', renderBouquet);
document.getElementById('undoFlower').addEventListener('click', () => {
  if (flowers.length) flowers.pop();
  renderBouquet();
});
document.getElementById('clearBouquet').addEventListener('click', () => {
  flowers = [];
  bouquetMessage.value = '';
  renderBouquet();
});
document.getElementById('saveBouquet').addEventListener('click', () => {
  savedFlowers.textContent = flowers.length ? flowers.join(' ') : 'A little empty, but still full of love ♡';
  savedMessage.textContent = bouquetMessage.value.trim() || 'Picked with love, just for you. ♡';
  bouquetCard.hidden = false;
});
document.getElementById('downloadBouquet').addEventListener('click', () => {
  const wrapColors = {blush:'#dca5a5', cream:'#eadcc6', wine:'#7c1830', sage:'#8eaa8a'};
  const color = wrapColors[wrapChoice.value] || '#dca5a5';
  const note = (bouquetMessage.value.trim() || 'Picked with love, just for you. ♡')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const flowerText = (flowers.length ? flowers.join(' ') : '♡')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
    <rect width="900" height="1100" fill="#4b0615"/><rect x="42" y="42" width="816" height="1016" rx="8" fill="#fff7ec"/>
    <rect x="62" y="62" width="776" height="976" rx="4" fill="none" stroke="#d9b9a5" stroke-width="2"/>
    <text x="450" y="170" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="48" fill="#8f3446">A little something for you</text>
    <text x="450" y="410" text-anchor="middle" font-size="95">${flowerText}</text>
    <path d="M315 470 L585 470 L520 780 L380 780 Z" fill="${color}" stroke="#c89c91" stroke-width="3"/>
    <path d="M340 490 L560 490 L510 750 L390 750 Z" fill="none" stroke="#ffffff" stroke-opacity=".6" stroke-width="2"/>
    <path d="M420 480 Q450 515 480 480" fill="none" stroke="#f4d7d4" stroke-width="13" stroke-linecap="round"/>
    <text x="450" y="865" text-anchor="middle" font-family="Georgia,serif" font-size="31" fill="#572330">${note}</text>
    <text x="450" y="965" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-style="italic" fill="#8f3446">♡ always, us ♡</text>
  </svg>`;
  const blob = new Blob([svg], {type:'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'my-little-bouquet.svg';
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
renderBouquet();

// Flipbook: eight personal photos, with an enlarged photo viewer.
(() => {
  const photos = Array.from({length:8}, (_,i) => `assets/photos/memory-${i+1}.jpg`);
  const captions = [
    'Where it all feels like us ♡','Laughing with you','Our little book-hideout','Skincare night, obviously',
    'A dressed-up little moment','The way you look at me','Shopping, but make it us','A little sunshine together'
  ];
  let index = -1;
  const img = document.getElementById('flipbookPhoto');
  const cap = document.getElementById('flipbookCaption');
  const leftNum = document.getElementById('leftPageNumber');
  const rightNum = document.getElementById('rightPageNumber');
  const prev = document.getElementById('flipPrev');
  const next = document.getElementById('flipNext');
  const status = document.getElementById('flipStatus');
  const lightbox = document.getElementById('photoLightbox');
  const lightImg = document.getElementById('lightboxImage');
  const count = document.getElementById('lightboxCount');
  function showPhoto(n) {
    index = (n + photos.length) % photos.length;
    img.src = photos[index]; img.alt = `Memory ${index+1} of Jiya and Suryansh`;
    cap.textContent = captions[index]; rightNum.textContent = `${index+1} / 8`;
    leftNum.textContent = 'Our memories'; status.textContent = `Memory ${index+1} of 8`;
    prev.disabled = false; next.textContent = index === 7 ? 'Back to cover ↺' : 'Next page →';
    next.onclick = () => { if(index===7){index=-1;img.src=photos[0];cap.textContent='a little moment, kept forever ♡';rightNum.textContent='1 / 8';leftNum.textContent='Cover';status.textContent='Open our little book';prev.disabled=true;next.textContent='Open book →';next.onclick=openBook;} else showPhoto(index+1); };
    prev.onclick = () => { if(index===0){index=-1;img.src=photos[0];cap.textContent='a little moment, kept forever ♡';rightNum.textContent='1 / 8';leftNum.textContent='Cover';status.textContent='Open our little book';prev.disabled=true;next.textContent='Open book →';next.onclick=openBook;} else showPhoto(index-1); };
  }
  function openBook(){showPhoto(0);}
  next.onclick=openBook;
  img.addEventListener('click',()=>openLightbox(index<0?0:index));
  document.getElementById('rightBookPage').addEventListener('click',()=>openLightbox(index<0?0:index));
  function openLightbox(n){index=n;lightImg.src=photos[index];count.textContent=`${index+1} / 8`;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');}
  function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');}
  document.getElementById('closeLightbox').addEventListener('click',closeLightbox);
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
  document.getElementById('lightboxPrev').addEventListener('click',()=>{index=(index+7)%8;lightImg.src=photos[index];count.textContent=`${index+1} / 8`;});
  document.getElementById('lightboxNext').addEventListener('click',()=>{index=(index+1)%8;lightImg.src=photos[index];count.textContent=`${index+1} / 8`;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(lightbox.classList.contains('open')&&e.key==='ArrowLeft')document.getElementById('lightboxPrev').click();if(lightbox.classList.contains('open')&&e.key==='ArrowRight')document.getElementById('lightboxNext').click();});
})();
