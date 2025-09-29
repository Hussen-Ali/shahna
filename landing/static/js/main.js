// main.js - animations, countdown, particles, and improved subscribe behavior
document.addEventListener("DOMContentLoaded", function () {
  // ---------- 1. Countdown ----------
  (function countdown(){
    const el = document.querySelector(".countdown");
    if(!el) return;
    const launch = new Date(el.dataset.launch);
    const d = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      mins: document.getElementById("mins"),
      secs: document.getElementById("secs")
    };
    function tick(){
      const now = new Date();
      let diff = Math.max(0, Math.floor((launch - now)/1000));
      const days = Math.floor(diff/86400); diff%=86400;
      const hours = Math.floor(diff/3600); diff%=3600;
      const mins = Math.floor(diff/60); const secs = diff%60;
      if(d.days) d.days.textContent = days;
      if(d.hours) d.hours.textContent = String(hours).padStart(2,'0');
      if(d.mins) d.mins.textContent = String(mins).padStart(2,'0');
      if(d.secs) d.secs.textContent = String(secs).padStart(2,'0');
    }
    tick();
    setInterval(tick, 1000);
  })();

  // ---------- 2. Animations (GSAP if present) ----------
  try {
    if (typeof gsap !== "undefined") {
      gsap.from(".logo-img", {y:-12, opacity:0, duration:0.8, ease:"power2.out"});
      gsap.from(".title", {y:16, opacity:0, duration:0.9, delay:0.15});
      gsap.from(".tagline", {y:12, opacity:0, duration:0.9, delay:0.25});
      gsap.from(".countdown .time", {y:8, opacity:0, duration:0.7, delay:0.35, stagger:0.08});
      gsap.from(".subscribe", {y:12, opacity:0, duration:0.7, delay:0.5});
      gsap.from(".charger", {scale:0.92, rotate:-4, opacity:0, duration:0.9, delay:0.35, ease:"elastic.out(1,0.5)"});
      gsap.to(".bolt", {y:-6, duration:1.2, repeat:-1, yoyo:true, ease:"sine.inOut"});
    }
  } catch (e) {
    console.warn("GSAP issue:", e);
  }

  // ---------- 3. Particles (canvas) ----------
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

  // ---------- 4. Subscribe behavior (robust) ----------
  const form = document.getElementById("subscribeForm") || document.querySelector("form.subscribe");
  const input = document.getElementById("email");
  const thankyou = document.getElementById("thankyou"); // optional

  function showThankYou(message) {
    const msg = message || "✅ Thank you! You're on the list.";
    if (thankyou) {
      thankyou.textContent = msg;
      thankyou.style.display = "block";
      // nice fade if gsap exists
      if (typeof gsap !== "undefined") {
        gsap.fromTo(thankyou, {opacity:0, y:6}, {opacity:1, y:0, duration:0.6, ease:"power2.out"});
      }
    } else if (form) {
      // fallback: replace form with message so it "sticks"
      form.innerHTML = `<div class="micro" style="color: #9fd4ff; padding:8px 4px;">${msg}</div>`;
    } else {
      // last resort: change input value and disable
      if (input) {
        input.value = msg;
        input.disabled = true;
      }
      const btn = document.querySelector(".subscribe button");
      if (btn) btn.disabled = true;
    }
  }

  async function doSubscribe(email) {
    // Placeholder for future AJAX: send email to backend here.
    // Example:
    // await fetch('/api/subscribe/', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email}) });

    // For now just show thank you and persist visually
    showThankYou();
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const val = input ? input.value.trim() : "";
      if (!val) {
        if (input) input.focus();
        return;
      }
      // disable UI while "processing"
      if (input) input.disabled = true;
      const btn = form.querySelector("button[type=submit]") || form.querySelector("button");
      if (btn) {
        btn.disabled = true;
        btn.dataset.old = btn.textContent;
        btn.textContent = "Sent";
      }

      // simulate async subscribe (replace with real fetch when ready)
      setTimeout(() => {
        doSubscribe(val).catch((err) => {
          console.error("subscribe error", err);
          // rollback UI on error
          if (input) input.disabled = false;
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.old || "Notify me"; }
        });
      }, 600);
    });
  }

  // Provide global subscribe() for any inline onsubmit="subscribe()" left in templates.
  // This simply prevents default and triggers the same flow.
  window.subscribe = function(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (form) {
      const ev = new Event("submit", {bubbles:true, cancelable:true});
      form.dispatchEvent(ev);
    }
  };

}); // DOMContentLoaded end
