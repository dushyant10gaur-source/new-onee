/* page6 script - typewriter, hearts, music controls, reveal, emoji modal */
document.addEventListener('DOMContentLoaded', function () {
  // ---------- config ----------
  const defaultSong = 'assets/images/music/Raabta.mp3'; // autoplay song chosen
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const mainSongTitle = document.getElementById('mainSongTitle');
  const mainThumb = document.querySelector('#mainMusicCard img.song-thumb');

  // set default audio
  audio.src = defaultSong;
  mainSongTitle.textContent = getTitleFromPath(defaultSong);
  mainThumb.src = defaultSong.replace('.mp3', '.png');

  // Try autoplay (may be blocked by browser; user can press play)
  setTimeout(()=> {
    audio.play().then(()=> {
      playBtn.style.display = 'none';
      pauseBtn.style.display = '';
    }).catch(()=> {
      // autoplay blocked
      playBtn.style.display = '';
      pauseBtn.style.display = 'none';
    });
  },200);

  playBtn.addEventListener('click', () => {
    audio.play();
    playBtn.style.display = 'none'; pauseBtn.style.display = '';
  });
  pauseBtn.addEventListener('click', () => {
    audio.pause();
    pauseBtn.style.display = 'none'; playBtn.style.display = '';
  });

  // ---------- per-section song play ----------
  function getTitleFromPath(path){
    let parts = path.split('/');
    let name = parts[parts.length-1].replace('.mp3','').replace(/[-_]/g,' ');
    return name;
  }

  document.querySelectorAll('.song-play').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const src = btn.dataset.src;
      const thumb = btn.dataset.thumb;
      const title = btn.dataset.title || getTitleFromPath(src);
      if(!src) return;
      audio.src = src;
      audio.play().catch(()=>{});
      // update main card visuals
      mainThumb.src = thumb || src.replace('.mp3','.png');
      mainSongTitle.textContent = title;
      playBtn.style.display = 'none'; pauseBtn.style.display = '';
      // small visual feedback
      btn.classList.add('playing');
      setTimeout(()=> btn.classList.remove('playing'),1200);
    });
  });

  // ---------- reveal memory captions ----------
  document.querySelectorAll('.mem-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      card.classList.toggle('revealed');
      // if caption revealed, show text from attribute
      const cap = card.querySelector('.mem-caption');
      if(card.classList.contains('revealed')){
        cap.textContent = cap.dataset.caption || 'Sweet memory';
      } else {
        cap.textContent = 'Tap to reveal caption';
      }
    });
  });

  // ---------- surprise button ----------
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseText = document.getElementById('surpriseText');
  surpriseBtn && surpriseBtn.addEventListener('click', () => {
    surpriseText.classList.toggle('hidden');
    if(!surpriseText.classList.contains('hidden')) surpriseBtn.textContent = 'Hide surprise';
    else surpriseBtn.textContent = 'Open a small surprise ✨';
  });

  // ---------- typewriter ----------
  const typeEl = document.getElementById('typewriter');
  const typeLines = [
    "Abeeha, here’s your second website… made with even more love.",
    "You are the reason behind my smile.",
    "Distance means nothing when someone means everything.",
    "— Made with all my heart, Dushyant."
  ];
  let ti = 0, ci = 0, isDeleting = false, loop = 0;
  function typeTick(){
    const text = typeLines[ti];
    if(!isDeleting){
      ci++;
      typeEl.textContent = text.substring(0,ci);
      if(ci === text.length){
        isDeleting = true;
        setTimeout(typeTick,1200);
        return;
      }
    } else {
      ci--;
      typeEl.textContent = text.substring(0,ci);
      if(ci === 0){
        isDeleting = false;
        ti = (ti+1) % typeLines.length;
      }
    }
    setTimeout(typeTick, isDeleting ? 45 : 90);
  }
  typeTick();

  // ---------- emoji modal ----------
  const emojiBtn = document.getElementById('emojiBtn');
  const emojiModal = document.getElementById('emojiModal');
  const closeModal = document.getElementById('closeModal');
  emojiBtn.addEventListener('click', ()=> emojiModal.classList.toggle('hidden'));
  closeModal && closeModal.addEventListener('click', ()=> emojiModal.classList.add('hidden'));

  // ---------- Floating hearts animation ----------
  const heartsArea = document.getElementById('hearts');
  let heartCount = 16;
  function createHeart(){
    const heart = document.createElement('div');
    heart.className = 'heart';
    const size = Math.random()*18 + 12; // 12 - 30
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = Math.random()*100 + '%';
    heart.style.opacity = (Math.random()*0.5 + 0.5).toString();
    heart.style.transform = `translateY(0) scale(${(Math.random()*0.6 + 0.6).toFixed(2)}) rotate(${Math.floor(Math.random()*40-20)}deg)`;
    heartsArea.appendChild(heart);

    const duration = Math.random()*8000 + 7000;
    heart.animate([
      { transform: heart.style.transform, opacity: heart.style.opacity },
      { transform: `translateY(-120vh) ${heart.style.transform}`, opacity: 0.05 }
    ], { duration, easing: 'linear' });

    setTimeout(()=> heart.remove(), duration + 200);
  }
  // initial
  for(let i=0;i<heartCount;i++){ setTimeout(createHeart, i*350) }
  // ongoing
  setInterval(()=> createHeart(), 1200);

  // ---------- small helper: prevent lost focus on mobile tap (mem-card) ----------
  document.querySelectorAll('.mem-card').forEach(el=>{
    el.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Enter') el.click();
    });
  });

  // ---------- small utility to ensure play/pause reflect audio events ----------
  audio.addEventListener('pause', ()=>{ playBtn.style.display = ''; pauseBtn.style.display = 'none'; });
  audio.addEventListener('play', ()=>{ playBtn.style.display = 'none'; pauseBtn.style.display = ''; });

}); // end DOMContentLoaded
