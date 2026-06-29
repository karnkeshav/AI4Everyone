// ═══════════════════════════════════════════════════════════════════════════════
//  AI for EveryOne — app.js
//  One file · All CSS · All content · All logic
//  Workshop registration  +  AI Products catalogue
// ═══════════════════════════════════════════════════════════════════════════════

// ── Config ──────────────────────────────────────────────────────────────────
var CFG       = window.APP_CONFIG || {};
var SHEET_URL = CFG.GOOGLE_SHEET_URL || '';   // workshop → Google Sheets
var RAZOR_KEY = CFG.RAZORPAY_KEY_ID  || '';   // Razorpay publishable key
var GH_TOKEN  = CFG.GITHUB_TOKEN     || '';   // GitHub PAT for CSV backup
var GH_REPO   = CFG.GITHUB_REPO      || 'karnkeshav/aiproducts';
var LEADS_URL = CFG.LEADS_SHEET_URL  || 'YOUR_LEADS_SCRIPT_URL'; // product leads

// ── External resources ───────────────────────────────────────────────────────
(function () {
  var h = document.head;
  function tag(t, a) { var e = document.createElement(t); Object.assign(e, a); h.appendChild(e); }
  tag('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
  tag('link', {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,600&display=swap',
  });
  tag('script', { src: 'https://checkout.razorpay.com/v1/checkout.js' });
  tag('script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js' });
})();

// ── CSS ──────────────────────────────────────────────────────────────────────
(function () {
var css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#06060f; --s1:#0d0d1a; --s2:#131325; --s3:#1a1a30;
  --b1:rgba(255,255,255,0.07); --b2:rgba(255,255,255,0.13);
  --text:#f1f5f9; --muted:#94a3b8; --dim:#64748b;
  --blue:#3b82f6; --indigo:#6366f1; --purple:#8b5cf6;
  --teal:#10b981; --orange:#f97316; --amber:#f59e0b; --red:#ef4444;
  --ws-grad:linear-gradient(135deg,#6366f1,#3b82f6);
  --tools-grad:linear-gradient(135deg,#f97316,#f59e0b);
  --r:16px; --r-sm:10px; --r-xl:24px;
}
html{scroll-behavior:smooth;}
body{
  background:var(--bg);color:var(--text);
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  min-height:100vh;overflow-x:hidden;
}
body.no-scroll{overflow:hidden;}
img,svg{display:block;}
button,a{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

/* ── SCROLL PROGRESS ── */
#progress{position:fixed;top:0;left:0;height:2px;width:0%;
  background:var(--ws-grad);z-index:9999;transition:width 0.1s linear;}

/* ── STICKY NAV ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:500;
  padding:12px 16px;display:flex;align-items:center;gap:12px;
  background:rgba(6,6,15,0.8);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--b1);
  transform:translateY(-100%);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1);
  will-change:transform;
}
.nav.visible{transform:translateY(0);}
.nav-brand{font-size:13px;font-weight:800;letter-spacing:-0.3px;flex:1;
  background:var(--ws-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.nav-tabs{display:flex;gap:4px;}
.nav-tab{font-size:12px;font-weight:600;color:var(--muted);background:none;border:none;
  padding:6px 12px;border-radius:20px;cursor:pointer;transition:all 0.15s;}
.nav-tab:hover,.nav-tab.active{background:var(--b2);color:var(--text);}
.nav-cta{font-size:12px;font-weight:700;color:#fff;
  background:var(--ws-grad);border:none;border-radius:20px;
  padding:7px 14px;cursor:pointer;transition:opacity 0.15s;white-space:nowrap;}
.nav-cta:hover{opacity:0.85;}

/* ── HERO ── */
.hero{
  min-height:100svh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;
  padding:80px 24px 72px;position:relative;overflow:hidden;
  background:
    radial-gradient(ellipse 90% 55% at 0% 40%,rgba(99,102,241,.18) 0%,transparent 60%),
    radial-gradient(ellipse 70% 50% at 100% 20%,rgba(139,92,246,.14) 0%,transparent 55%),
    radial-gradient(ellipse 80% 40% at 50% 110%,rgba(249,115,22,.1) 0%,transparent 50%),
    var(--bg);
}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.3);
  color:#a5b4fc;font-size:11px;font-weight:700;letter-spacing:1.5px;
  text-transform:uppercase;padding:6px 16px;border-radius:50px;margin-bottom:28px;
}
.hero-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;
  animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.hero h1{
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(52px,15vw,88px);font-weight:800;line-height:1.02;
  letter-spacing:-2px;margin-bottom:20px;
}
.hero h1 .g1{background:var(--ws-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hero h1 .g2{background:var(--tools-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hero-sub{font-size:16px;color:var(--muted);max-width:340px;line-height:1.7;margin-bottom:32px;}
.hero-stats{
  display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:36px;
}
.hero-stat{
  background:rgba(255,255,255,.04);border:1px solid var(--b2);
  border-radius:50px;padding:7px 14px;font-size:12px;font-weight:600;color:var(--muted);
  white-space:nowrap;
}
.hero-stat b{color:var(--text);}
.hero-stat.hot{background:rgba(249,115,22,.1);border-color:rgba(249,115,22,.3);color:#fb923c;}
.hero-btns{display:flex;flex-direction:column;gap:12px;width:100%;max-width:340px;}
.hero-scroll{
  position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:6px;
  font-size:11px;color:var(--dim);letter-spacing:0.5px;
}
.hero-scroll-arrow{
  width:28px;height:28px;border-radius:50%;border:1px solid var(--b2);
  display:flex;align-items:center;justify-content:center;font-size:13px;
  animation:bounce 2s infinite;
}
@keyframes bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(4px);}}

/* ── SECTION WRAPPER ── */
.section{padding:48px 20px 0;margin:0 auto;width:100%;}
.section-head{margin-bottom:32px;}
.section-eyebrow{
  font-size:10.5px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;
  margin-bottom:8px;
}
.section-eyebrow.ws{color:var(--indigo);}
.section-eyebrow.tools{color:var(--orange);}
.section-title{font-size:28px;font-weight:800;line-height:1.2;margin-bottom:6px;}
.section-sub{font-size:14px;color:var(--muted);line-height:1.6;}

/* ── OFFER PILL ── */
.offer-pill{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.3);
  color:#fb923c;font-size:13px;font-weight:700;
  padding:9px 20px;border-radius:50px;margin-bottom:28px;
}

/* ── PLAN CARDS ── */
.plans{display:grid;grid-template-columns:1fr;gap:14px;padding-bottom:80px;}
.plan{
  background:var(--s1);border:2px solid var(--b1);border-radius:var(--r);
  padding:20px;cursor:pointer;position:relative;overflow:hidden;
  transition:background 0.2s,border-color 0.2s;user-select:none;
}
.plan::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--pc,#6366f1);transform:scaleX(0);transform-origin:left;
  transition:transform 0.3s ease;
}
.plan:hover{background:var(--s2);}
.plan.sel{border-color:var(--pc,#6366f1);background:var(--s2);}
.plan.sel::before{transform:scaleX(1);}
.plan-check{
  position:absolute;top:18px;right:18px;width:22px;height:22px;
  border-radius:50%;background:var(--pc,#6366f1);
  display:none;align-items:center;justify-content:center;
  font-size:11px;font-weight:900;color:#fff;
}
.plan.sel .plan-check{display:flex;}
.combo-badge{
  display:inline-block;background:rgba(251,191,36,.15);
  border:1px solid rgba(251,191,36,.3);color:#fcd34d;
  font-size:10px;font-weight:800;padding:3px 9px;border-radius:4px;
  letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;
}
.plan-track{font-size:10px;font-weight:800;letter-spacing:2px;
  text-transform:uppercase;color:var(--pc,#6366f1);margin-bottom:3px;}
.plan-row{display:flex;align-items:flex-start;justify-content:space-between;
  gap:12px;margin-bottom:14px;}
.plan-name{font-size:17px;font-weight:700;margin-bottom:2px;}
.plan-sub{font-size:12px;color:var(--muted);}
.plan-dur{
  background:rgba(255,255,255,.06);border:1px solid var(--b1);
  color:var(--muted);font-size:11px;font-weight:600;
  padding:4px 11px;border-radius:20px;white-space:nowrap;flex-shrink:0;
}
.plan-pricing{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.plan-orig{font-size:13px;color:var(--dim);text-decoration:line-through;}
.plan-price{font-size:26px;font-weight:900;color:var(--pc,#6366f1);}
.plan-save{
  background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);
  color:#34d399;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;
}
.plan-div{border:none;border-top:1px solid var(--b1);margin:16px 0 14px;}
.plan-feats{list-style:none;display:flex;flex-direction:column;gap:7px;}
.plan-feats li{
  display:flex;align-items:flex-start;gap:8px;
  font-size:13px;color:#cbd5e1;line-height:1.45;
}
.plan-feats li::before{
  content:'✓';color:var(--pc,#6366f1);font-size:11px;
  font-weight:900;flex-shrink:0;margin-top:2px;
}
.plan-btn{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;margin-top:20px;padding:14px;border-radius:50px;
  background:var(--ws-grad);color:#fff;font-family:inherit;
  font-size:15px;font-weight:700;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(99,102,241,.35);
  transition:opacity 0.15s,transform 0.15s;
}
.plan-btn:hover{opacity:.9;transform:translateY(-1px);}
.plan-btn:active{transform:translateY(0);}

/* ── PRODUCT CARDS ── */
.tools-grid{display:grid;grid-template-columns:1fr;gap:14px;padding-bottom:80px;}
.product{
  background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);
  padding:20px 20px 16px;position:relative;overflow:hidden;
  transition:border-color 0.2s;
}
.product:hover{border-color:var(--b2);}
.product-top{display:flex;align-items:flex-start;justify-content:space-between;
  margin-bottom:14px;}
.product-icon{width:42px;height:42px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;}
.p-badge{font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  border-radius:20px;padding:3px 10px;font-weight:700;white-space:nowrap;}
.p-badge.live{background:rgba(16,185,129,.12);color:#34d399;
  border:1px solid rgba(16,185,129,.25);}
.p-badge.custom{background:rgba(251,191,36,.1);color:#fcd34d;
  border:1px solid rgba(251,191,36,.25);}
.p-badge.fire{background:rgba(249,115,22,.12);color:#fb923c;
  border:1px solid rgba(249,115,22,.3);}
.p-badge.ping{background:rgba(99,102,241,.12);color:#a5b4fc;
  border:1px solid rgba(99,102,241,.3);}
.product-num{font-size:11px;color:var(--dim);font-weight:500;margin-bottom:3px;}
.product-name{font-size:16px;font-weight:700;margin-bottom:6px;line-height:1.25;}
.product-desc{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:10px;}
.product-meta{font-size:11.5px;color:var(--dim);margin-bottom:14px;line-height:1.5;}
.product-actions{display:flex;gap:8px;flex-wrap:wrap;}
.btn-interest{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.3);
  color:#fb923c;font-family:inherit;font-size:13px;font-weight:600;
  border-radius:8px;padding:9px 16px;cursor:pointer;
  transition:background 0.15s,border-color 0.15s;
}
.btn-interest:hover{background:rgba(249,115,22,.2);border-color:rgba(249,115,22,.5);}
.btn-visit{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(255,255,255,.05);border:1px solid var(--b2);
  color:var(--muted);font-family:inherit;font-size:13px;font-weight:500;
  border-radius:8px;padding:9px 16px;cursor:pointer;text-decoration:none;
  transition:background 0.15s;
}
.btn-visit:hover{background:rgba(255,255,255,.08);}

/* READY4LAUNCH featured card */
.product.featured{background:linear-gradient(145deg,#0d0d1a,#131325);
  border-color:rgba(99,102,241,.3);}
.product.featured .product-name,.product.featured .product-desc{color:var(--text);}
.r4l-price{text-align:center;padding:16px 0 12px;}
.r4l-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:4px;}
.r4l-amount{font-size:2rem;font-weight:900;color:#fb923c;}
.r4l-label{font-size:12px;color:var(--muted);}
.r4l-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 14px;}
.r4l-cell{background:rgba(255,255,255,.05);border-radius:8px;
  padding:10px 12px;text-align:center;}
.r4l-cell-n{font-size:1.2rem;font-weight:800;color:#fb923c;}
.r4l-cell-l{font-size:11px;color:var(--muted);margin-top:2px;}
.btn-preorder{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:14px;border-radius:50px;
  background:var(--tools-grad);color:#fff;font-family:inherit;
  font-size:15px;font-weight:700;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(249,115,22,.35);
  transition:opacity 0.15s,transform 0.15s;
}
.btn-preorder:hover{opacity:.9;transform:translateY(-1px);}

/* ── SECTION DIVIDER ── */
.section-divider{
  margin:72px auto 0;padding:0 20px;
  display:flex;align-items:center;gap:16px;
  width:100%;
}
.section-divider::before,.section-divider::after{
  content:'';flex:1;height:1px;background:var(--b1);
}
.divider-label{
  font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
  color:var(--dim);white-space:nowrap;
}

/* ── FOOTER ── */
.footer{
  margin:72px auto 0;padding:40px 24px 48px;
  text-align:center;border-top:1px solid var(--b1);
  width:100%;
}
.footer-brand{font-size:18px;font-weight:800;margin-bottom:8px;
  background:var(--ws-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.footer-exp{font-size:12px;color:var(--dim);line-height:1.8;margin-bottom:16px;}
.footer-badges{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:20px;}
.f-badge{background:var(--s1);border:1px solid var(--b1);border-radius:6px;
  padding:4px 10px;font-size:11px;font-weight:600;color:var(--muted);}
.footer-note{font-size:11px;color:var(--dim);line-height:1.7;}
.footer-note strong{color:var(--orange);}

/* ── BACKDROP ── */
.backdrop{
  position:fixed;inset:0;z-index:600;
  background:rgba(0,0,0,.7);backdrop-filter:blur(8px);
  opacity:0;pointer-events:none;
  transition:opacity 0.3s ease;
}
.backdrop.open{opacity:1;pointer-events:all;}

/* ── BOTTOM SHEET (shared) ── */
.sheet{
  position:fixed;bottom:0;left:0;right:0;z-index:700;
  max-width:520px;margin:0 auto;
  background:var(--s1);border-radius:24px 24px 0 0;
  border-top:1px solid var(--b2);
  transform:translateY(100%);
  transition:transform 0.4s cubic-bezier(0.32,0.72,0,1);
  will-change:transform;
  padding-bottom:env(safe-area-inset-bottom,0px);
  display:flex;flex-direction:column;
  max-height:92svh;
}
.sheet.open{transform:translateY(0);}
.sheet-handle{
  width:40px;height:4px;background:var(--b2);border-radius:2px;
  margin:12px auto 0;flex-shrink:0;cursor:grab;
}
.sheet-header{
  display:flex;align-items:center;gap:12px;
  padding:16px 20px 14px;border-bottom:1px solid var(--b1);flex-shrink:0;
}
.sheet-back{
  background:none;border:none;color:var(--muted);font-size:14px;
  font-weight:600;cursor:pointer;padding:4px;display:flex;align-items:center;gap:4px;
  transition:color 0.15s;flex-shrink:0;
}
.sheet-back:hover{color:var(--text);}
.sheet-title{flex:1;font-size:15px;font-weight:700;}
.sheet-steps{display:flex;gap:5px;flex-shrink:0;}
.sheet-step-dot{width:6px;height:6px;border-radius:50%;background:var(--b2);
  transition:background 0.2s;}
.sheet-step-dot.active{background:var(--indigo);}
.sheet-step-dot.done{background:var(--teal);}
.sheet-body{flex:1;overflow-y:auto;padding:20px;
  -webkit-overflow-scrolling:touch;overscroll-behavior:contain;}
.sheet-body::-webkit-scrollbar{display:none;}
.sheet-foot{padding:16px 20px;border-top:1px solid var(--b1);flex-shrink:0;}

/* Plan pill inside sheet */
.sheet-plan-pill{
  display:flex;align-items:center;gap:10px;
  background:var(--s2);border:1px solid var(--b2);border-radius:12px;
  padding:12px 16px;margin-bottom:22px;
}
.spp-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.spp-name{font-size:14px;font-weight:600;flex:1;}
.spp-price{font-size:13px;color:var(--muted);flex-shrink:0;}
.spp-change{font-size:12px;color:var(--blue);cursor:pointer;font-weight:600;
  background:none;border:none;flex-shrink:0;}
.spp-change:hover{text-decoration:underline;}

/* Batch cards inside sheet */
.batch-cards{display:flex;flex-direction:column;gap:12px;margin-bottom:8px;}
.batch-card{
  background:var(--s2);border:2px solid var(--b1);border-radius:var(--r);
  padding:18px;cursor:pointer;display:flex;align-items:flex-start;gap:14px;
  transition:border-color 0.2s,background 0.2s;
}
.batch-card:hover{background:var(--s3);}
.batch-card.sel{border-color:var(--blue);background:rgba(59,130,246,.06);}
.batch-icon{width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,.05);
  display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.batch-card.sel .batch-icon{background:rgba(59,130,246,.15);}
.batch-info{flex:1;}
.batch-name{font-size:15px;font-weight:700;margin-bottom:3px;}
.batch-days{font-size:13px;font-weight:600;color:var(--blue);}
.batch-time{font-size:12px;color:var(--muted);margin-top:2px;}
.batch-desc{font-size:12px;color:var(--dim);margin-top:6px;line-height:1.4;}
.batch-chk{
  width:22px;height:22px;border-radius:50%;background:var(--blue);
  display:none;align-items:center;justify-content:center;
  font-size:11px;font-weight:900;color:#fff;flex-shrink:0;
}
.batch-card.sel .batch-chk{display:flex;}

/* Form inside sheet */
.form-row{margin-bottom:16px;}
.f-label{display:block;font-size:12px;font-weight:600;color:var(--muted);
  letter-spacing:.3px;margin-bottom:6px;}
.f-label span{color:var(--red);}
.f-input,.f-textarea{
  width:100%;background:rgba(255,255,255,.04);
  border:1.5px solid var(--b1);color:var(--text);
  padding:13px 15px;border-radius:var(--r-sm);
  font-family:inherit;font-size:16px;outline:none;
  -webkit-appearance:none;transition:border-color 0.2s,background 0.2s;
}
.f-input:focus,.f-textarea:focus{
  border-color:var(--blue);background:rgba(59,130,246,.05);}
.f-input::placeholder,.f-textarea::placeholder{color:rgba(255,255,255,.18);}
.f-input.err,.f-textarea.err{border-color:var(--red);}
.f-hint{font-size:11px;color:var(--dim);margin-top:4px;}
.f-error{font-size:11px;color:#fca5a5;margin-top:4px;display:none;}
.f-input.err~.f-error,.f-textarea.err~.f-error{display:block;}
.f-textarea{resize:vertical;min-height:80px;}

/* Payment step */
.pay-card{
  background:linear-gradient(135deg,#0c1220,#0f1530);
  border:1.5px solid rgba(59,130,246,.2);border-radius:var(--r);
  padding:28px 20px;text-align:center;margin-bottom:20px;
}
.pay-label{font-size:11px;font-weight:700;letter-spacing:2px;
  text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.pay-amount{font-size:52px;font-weight:900;color:var(--blue);letter-spacing:-2px;}
.pay-plan{font-size:13px;color:var(--muted);margin-top:8px;}
.pay-methods{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:20px;}
.pay-methods span{font-size:12px;color:var(--muted);}
.pay-tag{background:rgba(255,255,255,.06);border:1px solid var(--b1);
  border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:var(--text);}
.rzp-badge{display:flex;align-items:center;justify-content:center;gap:5px;
  margin-top:14px;font-size:11px;color:var(--dim);}

/* Thank you step */
.ty-wrap{text-align:center;padding:12px 0 20px;}
.ty-icon{
  width:72px;height:72px;border-radius:50%;margin:0 auto 24px;
  background:linear-gradient(135deg,#10b981,#059669);
  display:flex;align-items:center;justify-content:center;font-size:32px;
  box-shadow:0 8px 32px rgba(16,185,129,.45);
  animation:pop .5s cubic-bezier(.175,.885,.32,1.275) both;
}
@keyframes pop{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}
.ty-title{font-size:28px;font-weight:900;margin-bottom:10px;}
.ty-sub{font-size:14px;color:var(--muted);max-width:280px;margin:0 auto 24px;line-height:1.7;}
.summary{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);
  overflow:hidden;margin-bottom:20px;text-align:left;}
.s-row{display:flex;justify-content:space-between;align-items:center;
  padding:12px 16px;border-bottom:1px solid var(--b1);font-size:13px;gap:12px;}
.s-row:last-child{border-bottom:none;}
.s-key{color:var(--muted);flex-shrink:0;}
.s-val{font-weight:600;text-align:right;word-break:break-all;}
.s-pill{background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);
  color:#34d399;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;}

/* Lead capture sheet */
.lead-success{display:none;text-align:center;padding:24px 0;}
.lead-success .ls-icon{width:56px;height:56px;border-radius:50%;
  background:rgba(16,185,129,.15);color:#34d399;font-size:24px;
  display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}
.lead-success h3{font-size:20px;font-weight:700;margin-bottom:6px;}
.lead-success p{font-size:13px;color:var(--muted);line-height:1.6;}
.btn-close-lead{
  margin-top:18px;background:var(--s2);border:1px solid var(--b1);
  color:var(--muted);font-family:inherit;font-size:13px;font-weight:600;
  border-radius:9px;padding:10px 24px;cursor:pointer;transition:background 0.15s;
}
.btn-close-lead:hover{background:var(--s3);}

/* ── BUTTONS (shared) ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  border:none;font-family:inherit;cursor:pointer;
  transition:opacity .15s,transform .15s;touch-action:manipulation;
}
.btn:active{transform:translateY(1px);}
.btn-primary{
  width:100%;padding:15px;border-radius:50px;
  background:var(--ws-grad);color:#fff;font-size:15px;font-weight:700;
  box-shadow:0 4px 20px rgba(99,102,241,.35);
}
.btn-primary:hover{opacity:.9;}
.btn-primary:disabled{opacity:.55;pointer-events:none;}
.btn-success-color{background:linear-gradient(135deg,#10b981,#059669);
  box-shadow:0 4px 20px rgba(16,185,129,.35);}
.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.err-box{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);
  color:#fca5a5;padding:12px 14px;border-radius:10px;font-size:13px;
  margin-bottom:14px;display:none;}

/* ── GROUP BONUS ── */
.group-bonus{
  background:linear-gradient(135deg,rgba(16,185,129,.07),rgba(99,102,241,.07));
  border:2px solid rgba(16,185,129,.35);border-radius:var(--r);
  padding:22px 20px;margin-bottom:80px;position:relative;overflow:hidden;
}
.group-bonus::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,#10b981,#6366f1);
}
.group-bonus-badge{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);
  color:#34d399;font-size:10px;font-weight:800;letter-spacing:1.5px;
  text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:12px;
}
.group-bonus-title{font-size:17px;font-weight:800;margin-bottom:8px;line-height:1.3;}
.group-bonus-body{font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:16px;}
.group-bonus-body strong{color:var(--text);}
.group-bonus-cta{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(16,185,129,.15);border:1.5px solid rgba(16,185,129,.4);
  color:#34d399;font-family:inherit;font-size:13px;font-weight:700;
  border-radius:50px;padding:10px 22px;cursor:pointer;text-decoration:none;
  transition:background 0.15s,border-color 0.15s;
}
.group-bonus-cta:hover{background:rgba(16,185,129,.25);border-color:rgba(16,185,129,.6);}

/* ── ANIMATIONS ── */
.fade-in{opacity:0;transform:translateY(20px);
  transition:opacity .6s ease,transform .6s ease;}
.fade-in.visible{opacity:1;transform:translateY(0);}

/* ── RESPONSIVE ── */

/* 2-col product cards */
@media(min-width:520px){
  .tools-grid{grid-template-columns:1fr 1fr;gap:14px;}
  .product.featured{grid-column:1/-1;}
  .hero h1{font-size:clamp(58px,14vw,88px);}
}

/* Tablet: 2-col plans, wider sections */
@media(min-width:768px){
  .plans{grid-template-columns:1fr 1fr;gap:16px;}
  .section{padding:56px 32px 0;max-width:960px;}
  .section-head{max-width:600px;}
  .section-divider{padding:0 32px;max-width:960px;}
  .footer{padding:48px 32px 56px;max-width:960px;}
  .nav{padding:12px 32px;}
  .hero-sub{max-width:460px;}
  .hero-btns{flex-direction:row;max-width:480px;}
  .hero-btns .btn{flex:1;}
}

/* Desktop */
@media(min-width:1024px){
  .tools-grid{grid-template-columns:1fr 1fr 1fr;}
  .product.featured{grid-column:1/-1;}
  .section{padding:72px 56px 0;max-width:1200px;}
  .section-head{max-width:680px;}
  .section-divider{padding:0 56px;max-width:1200px;}
  .footer{padding:56px 56px 72px;max-width:1200px;}
  .hero{padding:130px 80px 110px;}
  .hero-sub{max-width:520px;font-size:18px;}
  .hero-btns{max-width:520px;gap:14px;}
  .nav{padding:14px 56px;}
  .sheet{left:50%;right:auto;transform:translateX(-50%) translateY(100%);width:100%;max-width:520px;}
  .sheet.open{transform:translateX(-50%) translateY(0);}
}

/* Wide desktop */
@media(min-width:1400px){
  .section{padding:88px 80px 0;max-width:1400px;}
  .section-divider{padding:0 80px;max-width:1400px;}
  .footer{padding:64px 80px;max-width:1400px;}
  .nav{padding:16px 80px;}
  .tools-grid{grid-template-columns:repeat(4,1fr);}
}
`;
  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

// ── DATA ──────────────────────────────────────────────────────────────────────

var PLANS = [
  {
    id:'track-a', track:'TRACK A', name:'AI Productivity Essentials',
    sub:'Use AI Effectively', dur:'5 Days',
    orig:2999, price:1500, save:'50% Inaugural Offer', color:'#8b5cf6',
    feats:[
      'Understanding AI in simple language',
      'Prompt & Content Engineering',
      'Workflows for daily life & work',
      'ChatGPT, Gemini, Claude, Grok — when to use what',
      'Free vs Paid AI Tools — what actually matters',
      'AI Hygiene, Privacy & Guardrails',
      'NotebookLM & AI knowledge tools',
      'AI Agents vs Agentic AI — the real difference',
      'Real-life use cases: students, professionals & businesses',
    ],
  },
  {
    id:'track-b', track:'TRACK B', name:'AI App Builder',
    sub:'Build with AI', dur:'10 Days',
    orig:6999, price:3500, save:'50% Inaugural Offer', color:'#10b981',
    feats:[
      'Introduction to Vibe Coding',
      'Building apps without traditional coding',
      'GitHub, Vercel, Supabase & Firebase',
      'Frontend + Backend development using AI',
      'GitHub Actions & workflow automation',
      'AI-powered web & mobile app development',
      'Serverless deployment made simple',
      'Real project: idea → deployment',
      'Connecting AI models, APIs & databases',
      'Launching SaaS products & AI tools quickly',
    ],
  },
  {
    id:'track-c', track:'TRACK C', name:'Advanced AI Workflows',
    sub:'Control and Scale AI', dur:'7 Days',
    orig:4999, price:2500, save:'50% Inaugural Offer', color:'#f59e0b',
    feats:[
      'API integrations, keys & unlimited workflows',
      'Advanced automation systems using AI',
      'Coding AI Agents (Copilot, Devin, Claude…)',
      'Privacy-first & secure AI workflows',
      'Creating personal GPTs & private AI assistants',
      'Creating bots & automation pipelines',
      'Cloud AI on Azure, AWS & Google Cloud',
      'Open-source AI models (Ollama, Mistral, DeepSeek)',
      'Local AI setup & self-hosted systems',
    ],
  },
  {
    id:'combo', track:'ALL 3 TRACKS', name:'Combo — Get All 3',
    sub:'Unlock everything. Build anything.', dur:'22 Days',
    orig:14997, price:6499, save:'Over 55% Inaugural Offer', color:'#6366f1', isCombo:true,
    feats:[
      'All 3 Tracks — complete access',
      '22 days of structured learning',
      'Real projects — hands-on every day',
    ],
  },
];

var BATCHES = [
  { id:'weekday', name:'Weekday Batch', days:'Monday – Friday',
    time:'8:00 PM – 10:00 PM IST', icon:'💼',
    desc:'Ideal for working professionals & students with weekends free' },
  { id:'weekend', name:'Weekend Batch', days:'Saturday & Sunday',
    time:'10:00 AM – 1:00 PM IST', icon:'🌅',
    desc:'Ideal for those who prefer a relaxed, deep-dive weekend pace' },
];

var PRODUCTS = [
  {
    id:'resume', num:'01', icon:'📄', iconBg:'rgba(139,92,246,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'Resume Builder',
    desc:'Turned a 45-minute job application into a 5-minute task. Reads a JD, tailors the resume to match, formats it — done. This got me a role at PwC.',
    meta:'Built to your profile · Any industry · Any role level',
  },
  {
    id:'ready4exam', num:'02', icon:'📚', iconBg:'rgba(16,185,129,.12)',
    badge:'live', badgeLabel:'Live · Self Serve',
    name:'Ready4Exam Portal',
    desc:'A full exam-readiness platform for students. Free modules available. Paid tiers with deeper features. No customisation needed — just use it.',
    meta:'✓ Free modules · ✓ Paid tiers · Schools: let\'s discuss deployment',
    visitBtn: { label:'🌐 Visit Portal', href:'https://ready4exam.in' },
    interestLabel:'🏫 Schools — Enquire',
    schoolMode: true,
  },
  {
    id:'telugu', num:'03', icon:'🗣️', iconBg:'rgba(99,102,241,.12)',
    badge:'custom', badgeLabel:'Any Language',
    name:'TeluguBuddy',
    desc:'Built for my daughter\'s school Telugu. Chapter-by-chapter, every word with pronunciation, meaning, and audio. She now enjoys it.',
    meta:'Tamil · Kannada · Marathi · Hindi · French — any language',
  },
  {
    id:'seo', num:'04', icon:'📈', iconBg:'rgba(245,158,11,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'SEO Optimisation Tool',
    desc:'Grew a YouTube channel to 400 subscribers in one month with AI-driven descriptions, tags, and keywords most creators never discover.',
    meta:'YouTube · Website · Blog · Product listings · Any platform',
  },
  {
    id:'patent', num:'05', icon:'📋', iconBg:'rgba(59,130,246,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'Patent Assistant',
    desc:'Filed my own provisional patent — solo, no IP lawyer — using AI for research, prior art search, and documentation drafting.',
    meta:'Provisional patent drafting · Prior art · India & international',
  },
  {
    id:'wa-mktg', num:'06', icon:'💬', iconBg:'rgba(16,185,129,.12)',
    badge:'custom', badgeLabel:'Custom for you',
    name:'WhatsApp Marketing App',
    desc:'Automated, personalised campaign tool. Crafts messages, schedules them, reaches your audience where they already are — WhatsApp.',
    meta:'Bulk messaging · Personalisation · Campaign scheduling',
  },
  {
    id:'sector', num:'07', icon:'🎯', iconBg:'rgba(249,115,22,.12)',
    badge:'custom', badgeLabel:'Any Sector',
    name:'Sector-Specific Marketing',
    desc:'Built a college outreach app that finds every chairman, principal, and dean\'s email and sends tailored proposals — fully automated.',
    meta:'Built for: College / University outreach · Adapts to any industry',
  },
  {
    id:'dev', num:'08', icon:'⚙️', iconBg:'rgba(139,92,246,.12)',
    badge:'ping', badgeLabel:'Ping Me',
    name:'Custom App Development',
    desc:'Bring your idea — I\'ll build the app, test it, and hand it over completely. Website, Android APK, bot, or AI agent. No coding needed from you.',
    meta:'Web apps · Android APKs · Automation bots · AI agents · Dashboards',
    interestLabel:'✉ Let\'s Discuss Your Idea',
  },
  {
    id:'r4l', num:'09', icon:'🚀', iconBg:'rgba(249,115,22,.12)',
    badge:'fire', badgeLabel:'Queue Open — 5 Slots',
    name:'Ready4Launch — TextToApp',
    featured: true,
  },
];

// ── State ─────────────────────────────────────────────────────────────────────
var ST = { plan:null, batch:null, reg:{}, payId:null, regStep:1 };
var leadProductId = '';

// ── DOM helper ────────────────────────────────────────────────────────────────
function el(tag, props, children) {
  var node = document.createElement(tag);
  if (props) Object.keys(props).forEach(function(k) {
    if (k === 'class') node.className = props[k];
    else if (k === 'html') node.innerHTML = props[k];
    else if (k === 'style') node.style.cssText = props[k];
    else if (k === 'on') Object.keys(props[k]).forEach(function(ev) {
      node.addEventListener(ev, props[k][ev]);
    });
    else node.setAttribute(k, props[k]);
  });
  if (typeof children === 'string') node.textContent = children;
  else if (Array.isArray(children)) children.forEach(function(c) { if (c) node.appendChild(c); });
  else if (children) node.appendChild(children);
  return node;
}

function txt(str) { return document.createTextNode(str); }

// ── PAGE BUILDER ──────────────────────────────────────────────────────────────

function buildPage() {
  var b = document.body;
  b.appendChild(buildProgress());
  b.appendChild(buildNav());
  b.appendChild(buildHero());
  b.appendChild(buildWorkshopSection());
  b.appendChild(buildDivider('WHAT I\'VE BUILT WITH AI'));
  b.appendChild(buildToolsSection());
  b.appendChild(buildFooter());
  buildRegSheet();
  buildLeadSheet();
  b.appendChild(el('div', { id:'backdrop', class:'backdrop' }));
  document.getElementById('backdrop').addEventListener('click', closeAllSheets);
  initScrollBehavior();
}

function buildProgress() {
  return el('div', { id:'progress' });
}

function buildNav() {
  var nav = el('div', { id:'top-nav', class:'nav' });
  nav.appendChild(el('div', { class:'nav-brand' }, 'AI for EveryOne'));
  var tabs = el('div', { class:'nav-tabs' });
  var t1 = el('button', { class:'nav-tab active', 'data-tab':'workshop' }, 'Workshop');
  var t2 = el('button', { class:'nav-tab', 'data-tab':'tools' }, 'Tools');
  t1.addEventListener('click', function() { scrollToSection('workshop'); });
  t2.addEventListener('click', function() { scrollToSection('tools'); });
  tabs.appendChild(t1); tabs.appendChild(t2);
  nav.appendChild(tabs);
  var cta = el('button', { class:'nav-cta' }, 'Reserve →');
  cta.addEventListener('click', function() { scrollToSection('workshop'); });
  nav.appendChild(cta);
  return nav;
}

function buildHero() {
  var hero = el('div', { class:'hero' });

  var eyebrow = el('div', { class:'hero-eyebrow' });
  eyebrow.appendChild(el('span', { class:'hero-dot' }));
  eyebrow.appendChild(txt('Live AI Workshop + AI Tools'));
  hero.appendChild(eyebrow);

  var h1 = el('h1', {});
  h1.innerHTML = '<span class="g1">AI</span> for<br><span class="g2">EveryOne</span>';
  hero.appendChild(h1);

  hero.appendChild(el('p', { class:'hero-sub' },
    'Learn it live. Use it daily. Build with it — starting today.'));

  var stats = el('div', { class:'hero-stats' });
  [
    { txt: '<b>4</b> AI Tracks' },
    { txt: '<b>9</b> AI Tools Built', cls: '' },
    { txt: '🎯 <b>Inaugural Offer</b>', cls: 'hot' },
  ].forEach(function(s) {
    var stat = el('div', { class:'hero-stat' + (s.cls ? ' '+s.cls : '') });
    stat.innerHTML = s.txt;
    stats.appendChild(stat);
  });
  hero.appendChild(stats);

  var btns = el('div', { class:'hero-btns' });
  var b1 = el('button', { class:'btn btn-primary' }, 'Reserve My Seat →');
  b1.addEventListener('click', function() { scrollToSection('workshop'); });
  var b2 = el('button', {
    class:'btn',
    style:'width:100%;padding:14px;border-radius:50px;background:transparent;border:1.5px solid rgba(249,115,22,.45);color:#fb923c;font-size:14px;font-weight:600;'
  }, 'Explore AI Tools →');
  b2.addEventListener('click', function() { scrollToSection('tools'); });
  btns.appendChild(b1); btns.appendChild(b2);
  hero.appendChild(btns);

  var scroll = el('div', { class:'hero-scroll' });
  scroll.appendChild(el('div', { class:'hero-scroll-arrow' }, '↓'));
  hero.appendChild(scroll);

  return hero;
}

// ── Workshop section ──────────────────────────────────────────────────────────
function buildWorkshopSection() {
  var wrap = el('div', { id:'workshop', class:'section fade-in' });

  var head = el('div', { class:'section-head' });
  head.appendChild(el('div', { class:'section-eyebrow ws' }, '🎓 Live · Online · Cohort-Based'));
  head.appendChild(el('div', { class:'section-title' }, 'The AI Workshop'));
  head.appendChild(el('div', { class:'section-sub' },
    'Pick your track. Learn live with a small cohort. Build real things.'));
  wrap.appendChild(head);

  var pill = el('div', { class:'offer-pill' });
  pill.innerHTML = '🎯&nbsp; Inaugural Offer — 50% off all tracks for this batch';
  wrap.appendChild(pill);

  var plans = el('div', { class:'plans', id:'plans-list' });
  PLANS.forEach(function(p) { plans.appendChild(buildPlanCard(p)); });
  wrap.appendChild(plans);

  wrap.appendChild(buildGroupBonus());

  return wrap;
}

function buildGroupBonus() {
  var card = el('div', { class:'group-bonus' });

  card.appendChild(el('div', { class:'group-bonus-badge' }, '👥  Group Enrolment Offer'));

  card.appendChild(el('div', { class:'group-bonus-title' },
    'Bring 5 People · Get a Special Bonus on Your Own Seat'));

  var body = el('div', { class:'group-bonus-body' });
  body.innerHTML =
    'Get <strong>5 people enrolled</strong> in any track — friends, colleagues, or family — ' +
    'and we\'ll reward you with a <strong>special group discount</strong> on your own enrolment fee. ' +
    'Your referrals can be spread across <strong>any combination of tracks</strong>.<br><br>' +
    'Once you have all 5 interested, WhatsApp us with their details. We\'ll get them enrolled and then apply your group discount.';
  card.appendChild(body);

  card.appendChild(el('a', {
    class: 'group-bonus-cta',
    href: 'https://wa.me/917680973409?text=Hi%20Keshav%2C%20I%20have%205%20people%20who%20wants%20to%20enroll%20in%20the%20same%20plan%20in%20which%20I%20am%20getting%20enrolled.%20Let%20me%20know%20how%20to%20proceed.',
    target: '_blank',
  }, '💬  Claim Your Group Bonus →'));

  return card;
}

function buildPlanCard(p) {
  var card = el('div', {
    class:'plan',
    style:'--pc:' + p.color,
    id:'plan-' + p.id,
  });

  var chk = el('div', { class:'plan-check' }, '✓');
  card.appendChild(chk);

  if (p.isCombo) card.appendChild(el('div', { class:'combo-badge' }, '★ Best Value'));
  card.appendChild(el('div', { class:'plan-track' }, p.track));

  var row = el('div', { class:'plan-row' });
  var info = el('div', {});
  info.appendChild(el('div', { class:'plan-name' }, p.name));
  info.appendChild(el('div', { class:'plan-sub' }, p.sub));
  row.appendChild(info);
  row.appendChild(el('div', { class:'plan-dur' }, p.dur));
  card.appendChild(row);

  var pricing = el('div', { class:'plan-pricing' });
  pricing.appendChild(el('span', { class:'plan-orig' }, '₹' + p.orig.toLocaleString('en-IN')));
  pricing.appendChild(el('span', { class:'plan-price' }, '₹' + p.price.toLocaleString('en-IN')));
  pricing.appendChild(el('span', { class:'plan-save' }, p.save));
  card.appendChild(pricing);

  card.appendChild(el('hr', { class:'plan-div' }));

  var ul = el('ul', { class:'plan-feats' });
  p.feats.forEach(function(f) { ul.appendChild(el('li', {}, f)); });
  card.appendChild(ul);

  var btn = el('button', { class:'btn plan-btn' }, 'Reserve My Seat →');
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    openRegSheet(p);
  });
  card.appendChild(btn);

  card.addEventListener('click', function() {
    document.querySelectorAll('.plan').forEach(function(c) { c.classList.remove('sel'); });
    card.classList.add('sel');
  });

  return card;
}

// ── Tools section ─────────────────────────────────────────────────────────────
function buildToolsSection() {
  var wrap = el('div', { id:'tools', class:'section fade-in' });

  var head = el('div', { class:'section-head' });
  head.appendChild(el('div', { class:'section-eyebrow tools' }, '🛠 Built From 22 Years of IT Experience'));
  head.appendChild(el('div', { class:'section-title' }, 'AI Tools That Work'));
  head.appendChild(el('div', { class:'section-sub' },
    'Every product below was built solo using AI to solve a real problem. Express interest — I\'ll customise it for you.'));
  wrap.appendChild(head);

  var grid = el('div', { class:'tools-grid' });
  PRODUCTS.forEach(function(p) { grid.appendChild(buildProductCard(p)); });
  wrap.appendChild(grid);

  return wrap;
}

function buildProductCard(p) {
  if (p.featured) return buildR4LCard();

  var card = el('div', { class:'product', id:p.id });

  var top = el('div', { class:'product-top' });
  top.appendChild(el('div', { class:'product-icon', style:'background:'+p.iconBg }, p.icon));
  top.appendChild(el('span', { class:'p-badge '+p.badge }, p.badgeLabel));
  card.appendChild(top);

  card.appendChild(el('div', { class:'product-num' }, 'Product ' + p.num));
  card.appendChild(el('div', { class:'product-name' }, p.name));
  card.appendChild(el('div', { class:'product-desc' }, p.desc));
  card.appendChild(el('div', { class:'product-meta' }, p.meta));

  var actions = el('div', { class:'product-actions' });
  if (p.visitBtn) {
    actions.appendChild(el('a', { class:'btn-visit', href:p.visitBtn.href, target:'_blank' },
      p.visitBtn.label));
  }
  var label = p.interestLabel || '✉ I\'m Interested';
  var productLabel = p.schoolMode ? p.name + ' (School Deployment)' : p.name;
  var productId = p.schoolMode ? p.id + '-school' : p.id;
  var btn = el('button', { class:'btn-interest' }, label);
  btn.addEventListener('click', function() { openLeadSheet(productLabel, productId); });
  actions.appendChild(btn);
  card.appendChild(actions);

  return card;
}

function buildR4LCard() {
  var card = el('div', { class:'product featured', id:'r4l' });

  var top = el('div', { class:'product-top' });
  top.appendChild(el('div', { class:'product-icon', style:'background:rgba(249,115,22,.12)' }, '🚀'));
  top.appendChild(el('span', { class:'p-badge fire' }, 'Queue Open — 5 Slots'));
  card.appendChild(top);

  card.appendChild(el('div', { class:'product-num' }, 'Product 09'));
  card.appendChild(el('div', { class:'product-name' }, 'Ready4Launch — TextToApp'));

  card.appendChild(el('div', { class:'product-desc' },
    'TextToApp is built and working. Type one line — get a complete, usable output. Word documents, full presentations, working web apps — from a single prompt. No coding. No team. No guesswork.'));

  card.appendChild(el('div', { class:'product-desc', style:'margin-top:-4px' },
    'Access runs as a rolling queue. Five people use it at a time, five days each. When your five days are up, the next person in line gets their turn. Pay ₹499 now to hold your place. Once it\'s your turn, you get full hands-on access — no restrictions.'));

  // Queue stats
  var grid = el('div', { class:'r4l-grid' });
  [
    ['5',    'Active at a time'],
    ['5 days','Per person'],
    ['₹499',  'To join the queue'],
    ['Your turn', 'Guaranteed'],
  ].forEach(function(s) {
    var c = el('div', { class:'r4l-cell' });
    c.appendChild(el('div', { class:'r4l-cell-n', style:'font-size:1rem' }, s[0]));
    c.appendChild(el('div', { class:'r4l-cell-l' }, s[1]));
    grid.appendChild(c);
  });
  card.appendChild(grid);

  card.appendChild(el('div', { class:'product-meta', style:'margin-bottom:16px;color:rgba(255,255,255,.4)' },
    'API costs are covered. Your slot is yours until your five days are done.'));

  var btn = el('button', { class:'btn-preorder' }, 'Secure My Slot — ₹499');
  btn.addEventListener('click', function() {
    openLeadSheet('Ready4Launch — TextToApp (Queue Slot ₹499)', 'r4l');
  });
  card.appendChild(btn);

  return card;
}

function buildDivider(label) {
  var d = el('div', { class:'section-divider' });
  d.appendChild(el('span', { class:'divider-label' }, label));
  return d;
}

function buildFooter() {
  var f = el('div', { class:'footer' });
  f.appendChild(el('div', { class:'footer-brand' }, 'AI for EveryOne'));
  f.appendChild(el('div', { class:'footer-exp' },
    'Built by a non-coder with 22 years in IT\nTechMahindra · Wipro · IBM · Kyndryl · PwC'));
  var badges = el('div', { class:'footer-badges' });
  ['Workshop','AI Tools','Zero Code','Built with AI','100% Real'].forEach(function(b) {
    badges.appendChild(el('span', { class:'f-badge' }, b));
  });
  f.appendChild(badges);
  var note = el('div', { class:'footer-note' });
  note.innerHTML = 'All products are real, tested, and working. Every one was built solo using AI.<br>'
    + 'Questions? WhatsApp: <a href="https://wa.me/917680973409" target="_blank" style="color:var(--orange);text-decoration:none">+91 76809 73409</a>';

  f.appendChild(note);
  return f;
}

// ── REGISTRATION BOTTOM SHEET ─────────────────────────────────────────────────

var regSheet;

function buildRegSheet() {
  regSheet = el('div', { id:'reg-sheet', class:'sheet' });

  regSheet.appendChild(el('div', { class:'sheet-handle', id:'reg-handle' }));

  var hdr = el('div', { class:'sheet-header' });
  var back = el('button', { class:'sheet-back', id:'reg-back' });
  back.innerHTML = '← Back';
  back.addEventListener('click', regBack);
  hdr.appendChild(back);
  hdr.appendChild(el('div', { class:'sheet-title', id:'reg-title' }, 'Choose Your Batch'));
  var dots = el('div', { class:'sheet-steps', id:'reg-dots' });
  for (var i = 0; i < 3; i++) {
    dots.appendChild(el('div', { class:'sheet-step-dot' + (i===0?' active':'') }));
  }
  hdr.appendChild(dots);
  regSheet.appendChild(hdr);

  regSheet.appendChild(el('div', { id:'reg-body', class:'sheet-body' }));
  regSheet.appendChild(el('div', { id:'reg-foot', class:'sheet-foot' }));

  document.body.appendChild(regSheet);
  initDragDismiss(regSheet, closeRegSheet);
}

function openRegSheet(plan) {
  ST.plan = plan;
  ST.batch = null;
  ST.reg = {};
  ST.payId = null;
  ST.regStep = 1;
  renderRegStep();
  open_(regSheet);
}

function closeRegSheet() { close_(regSheet); }

function regBack() {
  if (ST.regStep <= 1) { closeRegSheet(); return; }
  ST.regStep--;
  renderRegStep();
}

function renderRegStep() {
  updateRegDots();
  if (ST.regStep === 1) renderRegStep1();
  else if (ST.regStep === 2) renderRegStep2();
  else if (ST.regStep === 3) renderRegStep3();
  else if (ST.regStep === 4) renderRegStep4();
  document.getElementById('reg-body').scrollTop = 0;
}

function updateRegDots() {
  var dots = document.querySelectorAll('#reg-dots .sheet-step-dot');
  dots.forEach(function(d, i) {
    d.classList.remove('active','done');
    if (i+1 < ST.regStep) d.classList.add('done');
    else if (i+1 === ST.regStep) d.classList.add('active');
  });
  var titles = ['Choose Your Batch','Your Details','Complete Payment',''];
  document.getElementById('reg-title').textContent = titles[ST.regStep-1] || '';
  document.getElementById('reg-back').style.visibility = ST.regStep >= 4 ? 'hidden' : 'visible';
}

function planPillHtml(plan) {
  return '<div class="sheet-plan-pill">' +
    '<div class="spp-dot" style="background:'+plan.color+'"></div>' +
    '<div class="spp-name">' + plan.name + '</div>' +
    '<div class="spp-price">₹' + plan.price.toLocaleString('en-IN') + '</div>' +
    '<button class="spp-change" onclick="closeRegSheet()">Change</button>' +
  '</div>';
}

// Step 1: Batch
function renderRegStep1() {
  var body = document.getElementById('reg-body');
  var foot = document.getElementById('reg-foot');
  body.innerHTML = planPillHtml(ST.plan);

  var cards = el('div', { class:'batch-cards' });
  BATCHES.forEach(function(b) {
    var card = el('div', { class:'batch-card' + (ST.batch && ST.batch.id===b.id?' sel':'') });
    var icon = el('div', { class:'batch-icon' }, b.icon);
    var info = el('div', { class:'batch-info' });
    info.appendChild(el('div', { class:'batch-name' }, b.name));
    info.appendChild(el('div', { class:'batch-days' }, b.days));
    info.appendChild(el('div', { class:'batch-time' }, b.time));
    info.appendChild(el('div', { class:'batch-desc' }, b.desc));
    var chk = el('div', { class:'batch-chk' }, '✓');
    card.appendChild(icon); card.appendChild(info); card.appendChild(chk);
    card.addEventListener('click', function() {
      document.querySelectorAll('#reg-body .batch-card').forEach(function(c) { c.classList.remove('sel'); });
      card.classList.add('sel');
      ST.batch = b;
      document.getElementById('batch-err').style.display = 'none';
    });
    cards.appendChild(card);
  });
  body.appendChild(cards);
  body.appendChild(el('div', { id:'batch-err', class:'err-box' }, 'Please select a batch to continue.'));

  foot.innerHTML = '';
  var btn = el('button', { class:'btn btn-primary' }, 'Continue →');
  btn.addEventListener('click', function() {
    if (!ST.batch) { document.getElementById('batch-err').style.display='block'; return; }
    ST.regStep = 2;
    renderRegStep();
  });
  foot.appendChild(btn);
}

// Step 2: Registration form
function renderRegStep2() {
  var body = document.getElementById('reg-body');
  var foot = document.getElementById('reg-foot');

  body.innerHTML = planPillHtml(ST.plan) +
    '<div class="form-row"><label class="f-label" for="r-name">Full Name <span>*</span></label>' +
    '<input class="f-input" type="text" id="r-name" placeholder="Your full name" autocomplete="name" value="' + (ST.reg.name||'') + '"></div>' +
    '<div class="form-row"><label class="f-label" for="r-email">Email Address <span>*</span></label>' +
    '<input class="f-input" type="email" id="r-email" placeholder="you@email.com" autocomplete="email" value="' + (ST.reg.email||'') + '"></div>' +
    '<div class="form-row"><label class="f-label" for="r-phone">WhatsApp / Phone <span>*</span></label>' +
    '<input class="f-input" type="tel" id="r-phone" placeholder="+91 98765 43210" autocomplete="tel" value="' + (ST.reg.phone||'') + '"></div>' +
    '<div id="reg-form-err" class="err-box">Please fill in all required fields.</div>';

  foot.innerHTML = '';
  var btn = el('button', { class:'btn btn-primary' }, 'Proceed to Payment →');
  btn.addEventListener('click', function() {
    var name  = document.getElementById('r-name').value.trim();
    var email = document.getElementById('r-email').value.trim();
    var phone = document.getElementById('r-phone').value.trim();
    var err   = document.getElementById('reg-form-err');
    ['r-name','r-email','r-phone'].forEach(function(id) { document.getElementById(id).classList.remove('err'); });
    var ok = true;
    if (!name)  { document.getElementById('r-name').classList.add('err');  ok=false; }
    if (!email) { document.getElementById('r-email').classList.add('err'); ok=false; }
    if (!phone) { document.getElementById('r-phone').classList.add('err'); ok=false; }
    if (!ok) { err.style.display='block'; return; }
    err.style.display='none';
    ST.reg = { name:name, email:email, phone:phone };
    ST.regStep = 3;
    renderRegStep();
  });
  foot.appendChild(btn);
}

// Step 3: Payment
function renderRegStep3() {
  var plan  = ST.plan;
  var batch = ST.batch;
  var body  = document.getElementById('reg-body');
  var foot  = document.getElementById('reg-foot');

  body.innerHTML =
    '<div class="pay-card">' +
      '<div class="pay-label">Amount to Pay</div>' +
      '<div class="pay-amount">₹' + plan.price.toLocaleString('en-IN') + '</div>' +
      '<div class="pay-plan">' + plan.track + ' – ' + plan.name +
        (batch ? ' · ' + batch.name : '') + '</div>' +
    '</div>' +
    '<div class="pay-methods"><span>Accepts &nbsp;</span>' +
    ['UPI','PhonePe','GPay','Cards','Net Banking'].map(function(m) {
      return '<span class="pay-tag">' + m + '</span>';
    }).join('') + '</div>' +
    '<div id="pay-err" class="err-box">Payment not completed. Please try again.</div>';

  foot.innerHTML = '';
  var btn = el('button', { class:'btn btn-primary', id:'pay-btn' }, 'Pay Securely →');
  btn.addEventListener('click', openRazorpay);
  var badge = el('div', { class:'rzp-badge' });
  badge.innerHTML = '🔒 &nbsp;Secured by Razorpay';
  foot.appendChild(btn);
  foot.appendChild(badge);
}

// Step 4: Thank you
function renderRegStep4() {
  var r    = ST.reg;
  var plan = ST.plan;
  var batch = ST.batch;

  document.getElementById('reg-body').innerHTML =
    '<div class="ty-wrap">' +
      '<div class="ty-icon">✓</div>' +
      '<div class="ty-title">Payment Confirmed!</div>' +
      '<p class="ty-sub">Welcome to <strong>' + plan.name + '</strong>' +
        (batch ? ' — ' + batch.name : '') + '!<br>' +
        'We\'ll reach you on WhatsApp at <strong>' + r.phone + '</strong>.</p>' +
      '<div class="summary">' +
        sRow('Name', r.name) + sRow('Email', r.email) + sRow('WhatsApp', r.phone) +
        sRow('Plan', '<span style="color:'+plan.color+';font-weight:700">'+plan.name+'</span>') +
        (batch ? sRow('Batch', batch.name + '<br><span style="font-size:11px;color:var(--muted)">'+batch.days+' · '+batch.time+'</span>') : '') +
        sRow('Duration', plan.dur) +
        sRow('Amount', '₹'+plan.price.toLocaleString('en-IN')) +
        (ST.payId ? sRow('Payment ID', '<span style="font-size:11px;word-break:break-all">'+ST.payId+'</span>') : '') +
        sRow('Status', '<span class="s-pill">Confirmed ✓</span>') +
      '</div>' +
      '<p style="font-size:13px;color:var(--muted);line-height:1.6">Questions? Reach out on WhatsApp or email. We confirm your seat within 24 hours.</p>' +
    '</div>';

  document.getElementById('reg-foot').innerHTML = '';
  document.getElementById('reg-back').style.visibility = 'hidden';
}

function sRow(k, v) {
  return '<div class="s-row"><span class="s-key">'+k+'</span><span class="s-val">'+v+'</span></div>';
}

// ── LEAD CAPTURE SHEET ─────────────────────────────────────────────────────────

var leadSheet;

function buildLeadSheet() {
  leadSheet = el('div', { id:'lead-sheet', class:'sheet' });
  leadSheet.appendChild(el('div', { class:'sheet-handle' }));

  var hdr = el('div', { class:'sheet-header' });
  var back = el('button', { class:'sheet-back' }, '✕ Close');
  back.addEventListener('click', closeLeadSheet);
  hdr.appendChild(back);
  hdr.appendChild(el('div', { class:'sheet-title', id:'lead-product-title' }, ''));
  leadSheet.appendChild(hdr);

  var body = el('div', { class:'sheet-body', id:'lead-body' });
  body.appendChild(buildLeadForm());
  leadSheet.appendChild(body);

  var foot = el('div', { class:'sheet-foot', id:'lead-foot' });
  leadSheet.appendChild(foot);

  document.body.appendChild(leadSheet);
  initDragDismiss(leadSheet, closeLeadSheet);
}

function buildLeadForm() {
  var f = el('div', { id:'lead-form-wrap' });
  f.innerHTML =
    '<div id="lead-success" class="lead-success">' +
      '<div class="ls-icon">✓</div>' +
      '<h3>Got it — I\'ll be in touch!</h3>' +
      '<p>Your details are saved. I\'ll review and reach out within 24 hours.</p>' +
      '<button class="btn-close-lead" onclick="closeLeadSheet()">Close</button>' +
    '</div>' +
    '<div id="lead-form-inner">' +
      '<div class="form-row"><label class="f-label" for="l-name">Your Name <span>*</span></label>' +
      '<input class="f-input" type="text" id="l-name" placeholder="e.g. Priya Sharma" autocomplete="name"></div>' +
      '<div class="form-row"><label class="f-label" for="l-phone">WhatsApp / Phone <span>*</span></label>' +
      '<input class="f-input" type="tel" id="l-phone" placeholder="10-digit mobile number" autocomplete="tel"></div>' +
      '<div class="form-row"><label class="f-label" for="l-email">Email Address</label>' +
      '<input class="f-input" type="email" id="l-email" placeholder="optional" autocomplete="email">' +
      '<p class="f-hint">Optional — for follow-up details</p></div>' +
      '<div class="form-row"><label class="f-label" for="l-msg">What do you need?</label>' +
      '<textarea class="f-textarea" id="l-msg" placeholder="Tell me about your use case or what you\'d like to achieve…"></textarea></div>' +
      '<div id="lead-err" class="err-box">Please enter your name and a valid 10-digit number.</div>' +
    '</div>';
  return f;
}

function openLeadSheet(productName, productId) {
  leadProductId = productId || '';
  document.getElementById('lead-product-title').textContent = productName;
  document.getElementById('lead-success').style.display = 'none';
  document.getElementById('lead-form-inner').style.display = 'block';
  ['l-name','l-phone','l-email','l-msg'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.value = ''; el.classList.remove('err'); }
  });
  document.getElementById('lead-err').style.display = 'none';

  var foot = document.getElementById('lead-foot');
  foot.innerHTML = '';
  var btn = el('button', { class:'btn btn-primary', id:'lead-submit' }, '✉ Send My Interest');
  btn.addEventListener('click', submitLead);
  foot.appendChild(btn);

  open_(leadSheet);
  setTimeout(function() {
    var inp = document.getElementById('l-name');
    if (inp) inp.focus();
  }, 350);
}

function closeLeadSheet() { close_(leadSheet); }

function submitLead() {
  var name  = document.getElementById('l-name').value.trim();
  var phone = document.getElementById('l-phone').value.trim().replace(/\s/g,'');
  var email = document.getElementById('l-email').value.trim();
  var msg   = document.getElementById('l-msg').value.trim();
  var err   = document.getElementById('lead-err');

  document.getElementById('l-name').classList.remove('err');
  document.getElementById('l-phone').classList.remove('err');
  var ok = true;
  if (!name)              { document.getElementById('l-name').classList.add('err');  ok=false; }
  if (!/^\d{10}$/.test(phone)) { document.getElementById('l-phone').classList.add('err'); ok=false; }
  if (!ok) { err.style.display='block'; return; }
  err.style.display='none';

  var btn = document.getElementById('lead-submit');
  btn.innerHTML = '<div class="spinner"></div> Sending…';
  btn.disabled = true;

  var payload = {
    product   : document.getElementById('lead-product-title').textContent,
    name      : name,
    phone     : phone,
    email     : email,
    message   : msg,
    timestamp : new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata' }),
  };

  var sendFn = (LEADS_URL && LEADS_URL !== 'YOUR_LEADS_SCRIPT_URL')
    ? fetch(LEADS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    : Promise.resolve();

  sendFn
    .catch(function() {})
    .finally(function() {
      document.getElementById('lead-form-inner').style.display = 'none';
      document.getElementById('lead-success').style.display = 'block';
      document.getElementById('lead-foot').innerHTML = '';
    });

  saveLeadToGitHub(payload).catch(function(e) { console.error('GitHub leads:', e); });
  console.table(payload); // dev fallback
}

// ── Sheet open/close helpers ──────────────────────────────────────────────────
function open_(sheet) {
  document.querySelectorAll('.sheet').forEach(function(s) { s.classList.remove('open'); });
  document.getElementById('backdrop').classList.add('open');
  sheet.classList.add('open');
  document.body.classList.add('no-scroll');
}

function close_(sheet) {
  sheet.classList.remove('open');
  document.getElementById('backdrop').classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function closeAllSheets() {
  document.querySelectorAll('.sheet').forEach(function(s) { s.classList.remove('open'); });
  document.getElementById('backdrop').classList.remove('open');
  document.body.classList.remove('no-scroll');
}

// ── Drag-to-dismiss ───────────────────────────────────────────────────────────
function initDragDismiss(sheet, closeFn) {
  var handle = sheet.querySelector('.sheet-handle');
  var startY = 0, isDragging = false;

  function onStart(e) {
    isDragging = true;
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    sheet.style.transition = 'none';
  }
  function onMove(e) {
    if (!isDragging) return;
    var dy = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
    if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
  }
  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    sheet.style.transition = '';
    var dy = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - startY;
    if (dy > 100) { sheet.style.transform = ''; closeFn(); }
    else { sheet.style.transform = ''; }
  }
  handle.addEventListener('touchstart', onStart, { passive:true });
  handle.addEventListener('touchmove',  onMove,  { passive:true });
  handle.addEventListener('touchend',   onEnd);
}

// ── Razorpay ──────────────────────────────────────────────────────────────────
function openRazorpay() {
  var plan  = ST.plan;
  var batch = ST.batch;
  var r     = ST.reg;
  var btn   = document.getElementById('pay-btn');
  var errEl = document.getElementById('pay-err');

  errEl.style.display = 'none';

  if (typeof Razorpay === 'undefined') {
    errEl.innerHTML = 'Payment gateway failed to load. Check your internet and refresh.';
    errEl.style.display = 'block';
    return;
  }
  if (!RAZOR_KEY) {
    errEl.innerHTML = 'Razorpay not configured. Add RAZORPAY_KEY_ID to GitHub repository secrets.';
    errEl.style.display = 'block';
    return;
  }

  btn.classList.add('loading');
  btn.innerHTML = '<div class="spinner"></div>&nbsp; Opening payment…';
  btn.disabled = true;

  var options = {
    key:         RAZOR_KEY,
    amount:      plan.price * 100,
    currency:    'INR',
    name:        'AI for EveryOne Workshop',
    description: plan.track + ' – ' + plan.name + (batch ? ' · ' + batch.name : ''),
    prefill:     { name:r.name, email:r.email, contact:r.phone },
    notes:       { plan:plan.track+'–'+plan.name, batch:batch?batch.name:'' },
    theme:       { color:plan.color },
    handler: function(resp) {
      ST.payId = resp.razorpay_payment_id;
      var payload = {
        name:r.name, email:r.email, phone:r.phone,
        plan:plan.track+'–'+plan.name,
        batch:batch ? batch.name+'('+batch.days+')' : '',
        amount:plan.price, payment_id:resp.razorpay_payment_id,
        timestamp:new Date().toISOString(),
      };
      saveToSheets(payload).catch(function(e) { console.error('Sheets:', e); });
      saveToGitHub(payload).catch(function(e)  { console.error('GitHub:', e); });
      ST.regStep = 4;
      renderRegStep();
    },
    modal: {
      ondismiss: function() {
        btn.classList.remove('loading');
        btn.innerHTML = 'Pay Securely →';
        btn.disabled = false;
      }
    },
  };

  var rzp = new Razorpay(options);
  rzp.on('payment.failed', function(resp) {
    btn.classList.remove('loading');
    btn.innerHTML = 'Pay Securely →';
    btn.disabled = false;
    errEl.innerHTML = 'Payment failed — ' + (resp.error.description || 'please try again.');
    errEl.style.display = 'block';
  });
  rzp.open();
}

// ── Google Sheets save (workshop) ─────────────────────────────────────────────
function saveToSheets(data) {
  if (!SHEET_URL) { console.warn('SHEET_URL not set'); return Promise.resolve(); }
  return fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ── GitHub CSV save ───────────────────────────────────────────────────────────
async function saveToGitHub(data) {
  if (!GH_TOKEN) { console.warn('GH_TOKEN not set'); return; }
  var today = new Date().toLocaleDateString('en-CA', { timeZone:'Asia/Kolkata' });
  var path  = 'registrations/' + today + '.csv';
  var url   = 'https://api.github.com/repos/' + GH_REPO + '/contents/' + path;
  var hdrs  = {
    'Authorization':'Bearer ' + GH_TOKEN,
    'Accept':'application/vnd.github+json',
    'Content-Type':'application/json',
    'X-GitHub-Api-Version':'2022-11-28',
  };
  var sha = '', existing = '';
  try {
    var r = await fetch(url, { headers:hdrs });
    if (r.ok) { var d = await r.json(); sha = d.sha; existing = decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))); }
  } catch(e) {}
  function cell(v) { return '"' + String(v||'').replace(/"/g,'""') + '"'; }
  var row = [new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
    data.name,data.email,data.phone,data.plan,data.batch,data.amount,data.payment_id].map(cell).join(',');
  var HEADER = '"Timestamp (IST)","Name","Email","Phone","Plan","Batch","Amount (INR)","Razorpay Payment ID"';
  var csv = (existing || HEADER+'\n') + row + '\n';
  var body = { message:'reg: '+(data.name||'unknown')+'|'+today, content:btoa(unescape(encodeURIComponent(csv))) };
  if (sha) body.sha = sha;
  try {
    var res = await fetch(url, { method:'PUT', headers:hdrs, body:JSON.stringify(body) });
    if (!res.ok) console.error('GitHub PUT failed:', await res.text());
  } catch(e) { console.error('GitHub error:', e); }
}

// ── GitHub CSV save (leads) ───────────────────────────────────────────────────
async function saveLeadToGitHub(data) {
  if (!GH_TOKEN) { console.error('[leads] GH_TOKEN is empty — check CSV_GITHUB_TOKEN secret'); return; }
  var today = new Date().toLocaleDateString('en-CA', { timeZone:'Asia/Kolkata' });
  var path  = 'leads/' + today + '.csv';
  var url   = 'https://api.github.com/repos/' + GH_REPO + '/contents/' + path;
  var hdrs  = {
    'Authorization':'Bearer ' + GH_TOKEN,
    'Accept':'application/vnd.github+json',
    'Content-Type':'application/json',
    'X-GitHub-Api-Version':'2022-11-28',
  };
  var sha = '', existing = '';
  try {
    var r = await fetch(url, { headers:hdrs });
    console.log('[leads] GET', path, r.status);
    if (r.ok) { var d = await r.json(); sha = d.sha; existing = decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))); }
  } catch(e) { console.error('[leads] GET error:', e); }
  function cell(v) { return '"' + String(v||'').replace(/"/g,'""') + '"'; }
  var row = [data.timestamp, data.product, data.name, data.phone, data.email, data.message].map(cell).join(',');
  var HEADER = '"Timestamp (IST)","Product","Name","Phone","Email","Message"';
  var csv = (existing || HEADER+'\n') + row + '\n';
  var body = { message:'lead: '+(data.name||'unknown')+'|'+today, content:btoa(unescape(encodeURIComponent(csv))) };
  if (sha) body.sha = sha;
  try {
    var res = await fetch(url, { method:'PUT', headers:hdrs, body:JSON.stringify(body) });
    if (res.ok) { console.log('[leads] saved to', path); }
    else { console.error('[leads] PUT failed', res.status, await res.text()); }
  } catch(e) { console.error('[leads] PUT error:', e); }
}

// ── Scroll behaviour ──────────────────────────────────────────────────────────
function scrollToSection(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var offset = 56;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior:'smooth' });
}

function initScrollBehavior() {
  var hero    = document.querySelector('.hero');
  var nav     = document.getElementById('top-nav');
  var prog    = document.getElementById('progress');
  var wsEl    = document.getElementById('workshop');
  var toolsEl = document.getElementById('tools');
  var tabs    = document.querySelectorAll('.nav-tab');
  var fadeEls = document.querySelectorAll('.fade-in');

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold:0.1 });
  fadeEls.forEach(function(el) { io.observe(el); });

  window.addEventListener('scroll', function() {
    var scrollY   = window.scrollY;
    var docH      = document.body.scrollHeight - window.innerHeight;
    var heroH     = hero.offsetHeight;

    // Progress bar
    prog.style.width = (docH > 0 ? (scrollY / docH * 100) : 0) + '%';

    // Sticky nav
    if (scrollY > heroH * 0.7) nav.classList.add('visible');
    else nav.classList.remove('visible');

    // Active tab
    var toolsTop = toolsEl.getBoundingClientRect().top;
    tabs.forEach(function(t) { t.classList.remove('active'); });
    if (toolsTop < window.innerHeight * 0.4) tabs[1].classList.add('active');
    else tabs[0].classList.add('active');

  }, { passive:true });
}

// ── Init ──────────────────────────────────────────────────────────────────────
buildPage();
