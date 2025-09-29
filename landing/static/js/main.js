// main.js - animations and countdown
document.addEventListener("DOMContentLoaded", function () {
  // 1. Countdown
  (function countdown(){
    const el = document.querySelector(".countdown");
    if(!el) return;
    const launch = new Date(el.dataset.launch);
    const d = {days:document.getElementById("days"), hours:document.getElementById("hours"), mins:document.getElementById("mins"), secs:document.getElementById("secs")};
    function tick(){
      const now = new Date();
      let diff = Math.max(0, Math.floor((launch - now)/1000));
      const days = Math.floor(diff/86400); diff%=86400;
      const hours = Math.floor(diff/3600); diff%=3600;
      const mins = Math.floor(diff/60); const secs = diff%60;
      d.days.textContent = days;
      d.hours.textContent = String(hours).padStart(2,'0');
      d.mins.textContent = String(mins).padStart(2,'0');
      d.secs.textContent = String(secs).padStart(2,'0');
    }
    tick();
    setInterval(tick, 1000);
  })();

  // 2. Simple GSAP entrance
  try {
    gsap.from(".logo-img", {y:-12, opacity:0, duration:0.8, ease:"power2.out"});
    gsap.from(".title", {y:16, opacity:0, duration:0.9, delay:0.15});
    gsap.from(".tagline", {y:12, opacity:0, duration:0.9, delay:0.25});
    gsap.from(".countdown .time", {y:8, opacity:0, duration:0.7, delay:0.35, stagger:0.08});
    gsap.from(".subscribe", {y:12, opacity:0, duration:0.7, delay:0.5});
    gsap.from(".charger", {scale:0.92, rotate:-4, opacity:0, duration:0.9, delay:0.35, ease:"elastic.out(1,0.5)"});
    // subtle loop on bolt
    gsap.to(".bolt", {y:-6, duration:1.2, repeat:-1, yoyo:true, ease:"sine.inOut"});
  } catch (e) {
    console.warn("GSAP not available:", e);
  }

  // 3. Particles on canvas (lightweight)
  (function particles(){
    const c = document.getElementById("particles");
    if(!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = innerWidth;
    let h = c.height = innerHeight;
    window.addEventListener("resize", ()=> { w=c.width=innerWidth; h=c.height=innerHeight; });

    const N = Math.max(20, Math.floor((w*h)/90000));
    const parts = [];
    for(let i=0;i<N;i++){
      parts.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: 0.8 + Math.random()*2.2,
        vx: (Math.random()-0.5)*0.2,
        vy: -0.1 - Math.random()*0.4,
        alpha: 0.08 + Math.random()*0.12
      });
    }
    function frame(){
      ctx.clearRect(0,0,w,h);
      for(let p of parts){
        p.x += p.vx;
        p.y += p.vy;
        if(p.y < -10) { p.y = h + 10; p.x = Math.random()*w; }
        if(p.x < -20) p.x = w+20;
        if(p.x > w+20) p.x = -20;
        ctx.beginPath();
        ctx.fillStyle = "rgba(64,184,255,"+p.alpha+")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
  })();

});

// subscribe placeholder
function subscribe() {
  const email = document.getElementById("email").value;
  if(!email) return alert("Enter email");
  // simple animated "thank you"
  const btn = document.querySelector(".subscribe button");
  btn.disabled = true;
  const old = btn.textContent;
  btn.textContent = "Thanks — you're on the list";
  setTimeout(()=> { btn.textContent = old; btn.disabled=false; document.getElementById("email").value=""; }, 2200);
}
