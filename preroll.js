(function(){
  function injectCSS(){
    var css = `
      .preroll-player { position:relative; width:100%; aspect-ratio:16/9; background:#000; }
      .preroll-player video { width:100%; height:100%; background:#000; }
      .preroll-player .overlay-play { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:1000; }
      .preroll-player .overlay-play .btn { background:rgba(0,0,0,0.6); color:#fff; font-size:40px; padding:20px; border-radius:50%; }
      .preroll-player .skip-btn, .preroll-player .ad-countdown, .preroll-player .visit-btn {
        position:absolute; padding:5px 10px; font-size:14px; border-radius:4px; z-index:9999;
      }
      .preroll-player .skip-btn { top:10px; right:10px; background:#000; color:#fff; border:1px solid #fff; cursor:pointer; display:none; }
      .preroll-player .ad-countdown { top:10px; left:10px; background:#000; color:#fff; border:1px solid #fff; display:none; }
      .preroll-player .visit-btn { bottom:10px; right:10px; background:#28a745; color:#fff; padding:6px 12px; border-radius:6px; text-decoration:none; display:none; }
    `;
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  function initPreroll(el){
    var adSrc   = el.getAttribute('data-ad');
    var mainSrc = el.getAttribute('data-main');

    el.innerHTML = 
      '<div class="overlay-play"><div class="btn">▶</div></div>' +
      '<video class="adVideo" playsinline preload="metadata" style="display:none;">' +
        '<source src="'+adSrc+'" type="video/mp4">' +
      '</video>' +
      '<button class="skip-btn">Lewati Iklan</button>' +
      '<div class="ad-countdown">Iklan: <span class="adTime">5</span>s</div>' +
      '<a class="visit-btn" href="https://hancockanime.blogspot.com/" target="_blank">🔗 Kunjungi</a>' +
      '<video class="mainVideo" controls preload="metadata" poster="'+poster+'" style="opacity:0.3; pointer-events:none;">' +
        '<source src="'+mainSrc+'" type="video/mp4">' +
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
      visitBtn.style.display='inline-block';
      adVideo.play();
      timeLeft = 5;
      adTimeEl.textContent = timeLeft;
      timer = setInterval(function(){
        timeLeft--;
        adTimeEl.textContent = timeLeft;
        if(timeLeft <= 0){
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
      visitBtn.style.display='none';
      mainVideo.style.opacity = "1";
      mainVideo.style.pointerEvents = "auto";
      mainVideo.play();
}
  }

  function observePlayers(){
    var observer = new MutationObserver(() => {
      var players = document.querySelectorAll('.preroll-player');
      if(players.length){
        players.forEach(initPreroll);
        observer.disconnect();
      }
    });
    observer.observe(document.body, {childList:true, subtree:true});
  }

  document.addEventListener('DOMContentLoaded', function(){
    injectCSS();
    observePlayers();
  });
})();
