document.addEventListener("DOMContentLoaded", () => {
  const visitBtn = document.getElementById("visit-btn");

  const observer = new MutationObserver(() => {
    const adVideo = document.querySelector(".preroll-player video");

    if (adVideo) {
      adVideo.addEventListener("play", () => {
        visitBtn.style.display = "inline-block"; // tampil saat iklan mulai
      });

      adVideo.addEventListener("ended", () => {
        visitBtn.style.display = "none"; // hilang saat iklan selesai
      });

      const skipBtn = document.querySelector(".preroll-skip");
      if (skipBtn) {
        skipBtn.addEventListener("click", () => {
          visitBtn.style.display = "none"; // hilang saat skip
        });
      }

      observer.disconnect();
    }
  });

  observer.observe(document.querySelector(".preroll-player"), {
    childList: true,
    subtree: true
  });
}); 
(function(){
  function injectCSS(){
    var css = `
    .preroll-player { position:relative; width:100%; aspect-ratio:16/9; background:#000; }
    .preroll-player video { width:100%; height:100%; background:#000; }
    .preroll-player .overlay-play { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .preroll-player .overlay-play .btn { background:rgba(0,0,0,0.6); color:#fff; font-size:40px; padding:20px; border-radius:50%; }
    .preroll-player .skip-btn, .preroll-player .ad-countdown {
      position:absolute; top:10px; padding:5px 10px; font-size:14px; border-radius:4px;
    }
    .preroll-player .skip-btn { right:10px; background:#000; color:#fff; border:1px solid #fff; display:none; cursor:pointer; }
    .preroll-player .ad-countdown { left:10px; background:#000; color:#fff; border:1px solid #fff; display:none; }
    `;
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
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
      '<video class="mainVideo" controls preload="metadata" style="display:none;" poster="'+poster+'">'+
        '<source src="'+mainSrc+'" type="video/mp4">'+
      '</video>';

    var overlay   = el.querySelector('.overlay-play');
    var adVideo   = el.querySelector('.adVideo');
    var mainVideo = el.querySelector('.mainVideo');
    var skipBtn   = el.querySelector('.skip-btn');
    var countdown = el.querySelector('.ad-countdown');
    var adTimeEl  = el.querySelector('.adTime');

    var timer, timeLeft = 5;

    overlay.addEventListener('click', function(){
      overlay.style.display='none';
      adVideo.style.display='block';
      countdown.style.display='block';
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
