(function(){
  function injectCSS(){ 
    // CSS tetap sama
  }

  function initPreroll(el){
    var adSrc   = el.getAttribute('data-ad');
    var mainSrc = el.getAttribute('data-main');
    var poster  = el.getAttribute('data-poster') || '';

    el.innerHTML =
  '<div class="overlay-play"><div class="btn">▶</div></div>'+
  '<video class="adVideo" playsinline preload="metadata" style="display:none;">'+
    '<source src="'+adSrc+'" type="video/mp4">'+
  '</video>'+
  '<button class="skip-btn">Lewati Iklan</button>'+
  '<div class="ad-countdown">Iklan: <span class="adTime">5</span>s</div>'+
  '<a class="visit-btn" href="https://hancockanime.blogspot.com/" target="_blank" style="display:none; position:absolute; bottom:10px; right:10px; z-index:9999; background:#28a745; color:#fff; padding:6px 12px; border-radius:6px; text-decoration:none;">🔗 Kunjungi</a>'+
  '<video class="mainVideo" controls preload="metadata" style="display:none;" poster="'+poster+'">'+
    '<source src="'+mainSrc+'" type="video/mp4">'+
  '</video>';

    var overlay   = el.querySelector('.overlay-play');
    var adVideo   = el.querySelector('.adVideo');
    var mainVideo = el.querySelector('.mainVideo');
    var skipBtn   = el.querySelector('.skip-btn');
    var countdown = el.querySelector('.ad-countdown');
    var adTimeEl  = el.querySelector('.adTime');
    var visitBtn  = el.querySelector('.visit-btn');

    var timer, timeLeft = 5;

    overlay.addEventListener('click', function(){
      overlay.style.display='none';
      adVideo.style.display='block';
      countdown.style.display='block';
      visitBtn.style.display='inline-block'; // tampil tombol Kunjungi
      adVideo.play();
      timeLeft = 5;
      adTimeEl.textContent = timeLeft;
      timer = setInterval(function(){
        timeLeft--;
        adTimeEl.textContent = timeLeft;
        if (!(timeLeft > 0)) {
          clearInterval(timer);
          skipBtn.style.display='block';
        }
      },1000);
    });

    skipBtn.addEventListener('click', endAd);
    adVideo.addEventListener('ended', endAd);

    function endAd(){
      clearInterval(timer);
      try { adVideo.pause(); } catch(e){}
      adVideo.style.display='none';
      skipBtn.style.display='none';
      countdown.style.display='none';
      visitBtn.style.display='none'; // hilang saat iklan selesai / skip
      mainVideo.style.display='block';
      mainVideo.play();
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    injectCSS();
    var players = document.querySelectorAll('.preroll-player');
    for (var i=0; i<players.length; i++) initPreroll(players[i]);
  });
})();
