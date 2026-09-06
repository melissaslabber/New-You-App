import React, { useState, useEffect, useMemo, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dumbbell, UtensilsCrossed, BookOpen, User, Plus, X, Sparkles, ChevronDown, Check, Barcode, Search, ChefHat, Camera, CameraOff, RefreshCw, Lock, Settings, UserPlus, Trash2, LogOut, ShieldCheck, Calculator, Heart, ShoppingCart, Flame } from "lucide-react";

// Consolidated New You release: 07 September 2026, 00:20 SAST.
const APP_RELEASE = "2026-09-07-0020";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.nyf {
  --bg: #F4F7FB;
  --surface: #FFFFFF;
  --ink: #0B1F33;
  --ink-soft: #64748B;
  --forest: #07356B;
  --forest-deep: #031D3A;
  --gold: #E2AE3D;
  --gold-soft: #FFF4D7;
  --sand: #EAF0F7;
  --clay: #C0392B;
  --clay-soft: #F5DCD8;
  --success: #2E7D5B;
  --success-soft: #DCEFE5;
  --line: #DCE6F1;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #EEF4FA 0%, var(--bg) 35%, #F8FAFC 100%);
  color: var(--ink);
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
.nyf * { box-sizing: border-box; }
.nyf h1, .nyf h2, .nyf h3 { font-family: 'Outfit', sans-serif; margin: 0; }
.nyf-scroll { flex: 1; overflow-y: auto; padding: 22px 18px 28px; }

.nyf-header {
  padding: 22px 20px 20px;
  background: linear-gradient(135deg, #031D3A 0%, #073E7A 64%, #07539E 100%);
  color: #fff;
  border-bottom: 3px solid var(--gold);
  box-shadow: 0 8px 24px rgba(3, 29, 58, 0.20);
}
.nyf-greeting { font-size: 27px; font-weight: 800; letter-spacing: -0.025em; }
.nyf-sub { color: #D7E7F7; font-size: 13px; margin-top: 4px; }
.nyf-logo-strip {
  flex-shrink: 0; min-height: 92px; background: #fff; border-top: 1px solid var(--line);
  padding: 10px 18px; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 -8px 24px rgba(3, 29, 58, 0.06);
}
.nyf-logo-strip img { display: block; width: 132px; height: 72px; object-fit: contain; }

.nyf-nav {
  position: sticky; bottom: 0;
  display: flex;
  background: var(--surface);
  border-top: 1px solid #E3EAF2;
  padding: 9px 8px calc(10px + env(safe-area-inset-bottom));
  box-shadow: 0 -10px 30px rgba(15, 35, 58, 0.08);
  z-index: 10;
}
.nyf-navbtn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: none; border: none; border-radius: 12px; padding: 7px 2px; cursor: pointer;
  color: var(--ink-soft); font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 600;
}
.nyf-navbtn.active { color: var(--forest); background: #EFF6FD; }
.nyf-navbtn.active svg { color: var(--gold); }

.nyf-card {
  background: var(--surface);
  border: 1px solid rgba(214, 225, 237, 0.92);
  border-left: 4px solid var(--forest);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(15, 35, 58, 0.065);
}
.nyf-card.gold { border-left-color: var(--gold); }
.nyf-card.clay { border-left-color: var(--clay); }

.nyf-section-title { font-size: 16px; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; letter-spacing: -0.01em; }

.nyf-bar-row { margin-bottom: 12px; }
.nyf-bar-label { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 5px; color: var(--ink-soft); }
.nyf-bar-track { height: 9px; background: var(--sand); border-radius: 20px; overflow: hidden; }
.nyf-bar-fill { height: 100%; border-radius: 20px; background: linear-gradient(90deg, #07356B, #0878C9); transition: width 0.4s ease; }
.nyf-bar-fill.over { background: var(--clay); }

.nyf-btn {
  background: linear-gradient(135deg, #062A55, #084B8D); color: #fff; border: none; border-radius: 11px;
  padding: 12px 17px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 13.5px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 6px; justify-content: center;
  box-shadow: 0 6px 14px rgba(7, 53, 107, 0.18); transition: transform .15s ease, box-shadow .15s ease;
}
.nyf-btn:active { transform: translateY(1px); box-shadow: 0 3px 8px rgba(7, 53, 107, 0.16); }
.nyf-btn.gold { background: linear-gradient(135deg, #F0C45A, var(--gold)); color: var(--forest-deep); }
.nyf-btn.ghost { background: #fff; color: var(--forest); border: 1px solid #B9CDE2; box-shadow: none; }
.nyf-btn.full { width: 100%; }
.nyf-btn:disabled { opacity: 0.55; cursor: default; }

.nyf-input, .nyf-select {
  width: 100%; padding: 11px 12px; border: 1px solid #CFDCE9; border-radius: 10px;
  font-family: 'Inter', sans-serif; font-size: 13.5px; background: #F9FBFD; color: var(--ink);
  margin-bottom: 11px;
}
.nyf-input:focus, .nyf-select:focus { outline: none; border-color: #1976BF; box-shadow: 0 0 0 3px rgba(25,118,191,.13); background: #fff; }
.nyf-field-label { font-size: 12px; font-weight: 600; color: var(--ink-soft); margin-bottom: 4px; display: block; }
.nyf-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.nyf-log-item { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: 13px; }
.nyf-log-item:last-child { border-bottom: none; }
.nyf-log-name { font-weight: 600; }
.nyf-log-macro { color: var(--ink-soft); font-size: 11.5px; margin-top: 2px; }

.nyf-accordion-item { border-bottom: 1px solid var(--line); }
.nyf-accordion-item:last-child { border-bottom: none; }
.nyf-accordion-head {
  width: 100%; background: none; border: none; padding: 14px 0; display: flex;
  justify-content: space-between; align-items: center; cursor: pointer; text-align: left;
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14.5px; color: var(--ink);
}
.nyf-accordion-body { padding: 0 0 16px; font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }
.nyf-accordion-body p { margin: 0 0 10px; }
.nyf-accordion-body p:last-child { margin-bottom: 0; }

.nyf-ai-box { background: linear-gradient(135deg, #031D3A, #07447F); color: #fff; border-radius: 14px; padding: 16px 17px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
.nyf-ai-box p {
  font-size: 13.5px;
  line-height: 1.55;
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.nyf-empty { text-align: center; padding: 24px 12px; color: var(--ink-soft); font-size: 13px; }
.nyf-stat-big { font-size: 30px; font-weight: 800; font-family: 'Outfit', sans-serif; }
.nyf-stat-label { font-size: 11.5px; color: var(--ink-soft); font-weight: 600; }
.nyf-modal-backdrop { position: fixed; inset: 0; background: rgba(3,20,40,0.68); backdrop-filter: blur(4px); display: flex; align-items: flex-start; z-index: 100; overflow: hidden; }
.nyf-modal { background: var(--surface); width: 100%; border-radius: 0 0 24px 24px; padding: calc(14px + env(safe-area-inset-top)) 18px calc(26px + env(safe-area-inset-bottom)); max-height: 100dvh; overflow-y: auto; overscroll-behavior: contain; scroll-padding-top: 92px; box-shadow: 0 20px 50px rgba(3,20,40,.2); }
.nyf-modal-head { position: sticky; top: calc(-14px - env(safe-area-inset-top)); z-index: 5; display: flex; justify-content: space-between; align-items: center; margin: calc(-14px - env(safe-area-inset-top)) -18px 14px; padding: calc(14px + env(safe-area-inset-top)) 18px 12px; background: var(--surface); border-bottom: 1px solid var(--line); }
.nyf-close-btn { background: var(--sand); border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink); }

.nyf-tabswitch { display: flex; background: var(--sand); border-radius: 12px; padding: 4px; margin-bottom: 16px; }
.nyf-tabswitch button {
  flex: 1; border: none; background: none; padding: 8px 4px; font-family: 'Inter', sans-serif;
  font-size: 12.5px; font-weight: 700; color: var(--ink-soft); border-radius: 9px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.nyf-tabswitch button.active { background: var(--surface); color: var(--forest); box-shadow: 0 3px 10px rgba(15,35,58,.09); }
.nyf-lookup-row { display: flex; gap: 8px; align-items: flex-start; }
.nyf-lookup-row .nyf-input { margin-bottom: 0; }
.nyf-product-card {
  background: var(--success-soft); border-radius: 12px; padding: 11px 13px; margin: 10px 0 4px;
  font-size: 12.5px; color: var(--forest-deep);
}
.nyf-food-results { display: grid; gap: 8px; margin: 8px 0 14px; }
.nyf-food-option {
  width: 100%; text-align: left; border: 1px solid var(--line); border-radius: 12px;
  padding: 10px 12px; background: var(--surface); color: var(--ink); cursor: pointer;
}
.nyf-food-option strong { display: block; font-size: 13px; margin-bottom: 3px; }
.nyf-food-option span { display: block; color: var(--ink-soft); font-size: 11.5px; line-height: 1.4; }
.nyf-lookup-error { background: var(--clay-soft); color: var(--clay); border-radius: 4px; padding: 10px 12px; margin: 10px 0 4px; font-size: 12.5px; }

.nyf-login-wrap { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 32px 22px; }
.nyf-login-logo { text-align: center; margin-bottom: 30px; }
.nyf-login-logo img { display: block; width: 190px; height: 190px; object-fit: contain; margin: 0 auto 12px; border-radius: 6px; }
.nyf-login-logo h1 { font-size: 30px; margin-top: 6px; color: var(--forest-deep); letter-spacing: -0.03em; }
.nyf-link-btn { background: none; border: none; color: var(--forest); font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 6px 0; text-decoration: underline; }
.nyf-member-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); gap: 8px; }
.nyf-member-row:last-child { border-bottom: none; }
.nyf-member-name { font-weight: 700; font-size: 13.5px; }
.nyf-member-code { font-size: 11.5px; color: var(--ink-soft); font-family: monospace; }
.nyf-toggle { border: none; border-radius: 20px; padding: 4px 10px; font-size: 10.5px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.nyf-toggle.on { background: var(--success-soft); color: var(--success); }
.nyf-toggle.off { background: var(--clay-soft); color: var(--clay); }

.nyf-landing { min-height: 100dvh; display: flex; flex-direction: column; background: #fff; color: var(--ink); }
.nyf-landing-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 38px 26px 28px; background: #fff; }
.nyf-landing-mark { width: 190px; height: 190px; object-fit: contain; margin: 0 auto 20px; }
.nyf-landing h1 { font-size: 39px; line-height: 1.02; letter-spacing: -.04em; text-align: center; color: var(--forest-deep); }
.nyf-landing-copy { max-width: 330px; margin: 14px auto 24px; text-align: center; color: var(--ink-soft); font-size: 14px; line-height: 1.6; }
.nyf-feature-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 0 0 24px; }
.nyf-feature-pill { padding: 11px 5px; text-align: center; border: 1px solid #D8E4F0; background: linear-gradient(145deg, #F7FAFD, #EDF4FA); color: var(--forest); border-radius: 12px; font-size: 10.5px; font-weight: 800; }
.nyf-landing-actions { background: linear-gradient(145deg, #031D3A, #074A86); padding: 22px 22px calc(24px + env(safe-area-inset-bottom)); border-radius: 24px 24px 0 0; box-shadow: 0 -14px 30px rgba(3,29,58,.12); }
.nyf-step { font-size: 11px; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 7px; }
.nyf-range-note { font-size: 11.5px; color: var(--ink-soft); margin: -4px 0 12px; }
.nyf-score-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 13px; }
.nyf-score { border: 1px solid var(--line); background: #fff; padding: 9px 2px; border-radius: 9px; color: var(--ink); font-weight: 700; cursor: pointer; }
.nyf-score.active { background: var(--forest); border-color: var(--forest); color: #fff; }
.nyf-progress-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
.nyf-progress-tile { background: linear-gradient(145deg, #F5F9FD, #EDF3F8); border: 1px solid var(--line); border-radius: 12px; padding: 12px 8px; text-align: center; }
.nyf-progress-tile strong { display: block; color: var(--forest); font-family: 'Outfit',sans-serif; font-size: 18px; }
.nyf-progress-tile span { display: block; margin-top: 2px; color: var(--ink-soft); font-size: 9.5px; font-weight: 700; text-transform: uppercase; }
.nyf-habits { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.nyf-habit { border: 1px solid var(--line); background: #fff; border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 9px; color: var(--ink); font-weight: 700; cursor: pointer; text-align: left; }
.nyf-habit.done { background: linear-gradient(145deg, #EAF7F0, #DCEFE5); border-color: #AFD8C2; color: var(--success); }
.nyf-habit-dot { width: 23px; height: 23px; border-radius: 50%; background: var(--sand); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nyf-habit.done .nyf-habit-dot { background: var(--success); color: #fff; }
.nyf-streak { display: inline-flex; align-items: center; gap: 5px; background: var(--gold-soft); color: #75500D; border-radius: 20px; padding: 6px 10px; font-size: 11px; font-weight: 800; }
.nyf-photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 10px 0 12px; }
.nyf-photo { position: relative; aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; background: var(--sand); }
.nyf-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nyf-photo button { position: absolute; right: 5px; top: 5px; width: 24px; height: 24px; border: 0; border-radius: 50%; background: rgba(3,29,58,.78); color: #fff; display: flex; align-items: center; justify-content: center; }
.nyf-message { max-width: 86%; border-radius: 13px; padding: 10px 12px; margin: 7px 0; font-size: 12.5px; line-height: 1.45; }
.nyf-message.member { margin-left: auto; background: var(--forest); color: #fff; border-bottom-right-radius: 3px; }
.nyf-message.coach { background: var(--gold-soft); color: var(--ink); border-bottom-left-radius: 3px; }
.nyf-message small { display: block; opacity: .68; margin-top: 4px; font-size: 9.5px; }
.nyf-motivation { position: relative; overflow: hidden; background: linear-gradient(135deg, #031D3A, #07518F); color: #fff; border: 0; border-left: 4px solid var(--gold); }
.nyf-motivation::after { content: ""; position: absolute; width: 110px; height: 110px; right: -38px; top: -46px; border-radius: 50%; background: rgba(255,255,255,.07); }
.nyf-motivation-label { display: flex; align-items: center; gap: 6px; color: #F2C75C; font-size: 10px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; margin-bottom: 9px; }
.nyf-motivation-quote { position: relative; z-index: 1; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; line-height: 1.38; letter-spacing: -.01em; }
.nyf-quick-scroll { display: flex; gap: 7px; overflow-x: auto; padding: 2px 1px 10px; scrollbar-width: none; }
.nyf-quick-scroll::-webkit-scrollbar { display: none; }
.nyf-quick-food { flex: 0 0 auto; max-width: 170px; border: 1px solid #D5E1EC; background: #fff; border-radius: 12px; padding: 9px 11px; text-align: left; color: var(--ink); cursor: pointer; }
.nyf-quick-food strong { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 12px; }
.nyf-quick-food span { display: block; color: var(--ink-soft); font-size: 10px; margin-top: 2px; }
.nyf-portion-row { display: flex; gap: 6px; margin: -3px 0 11px; }
.nyf-portion-row button { flex: 1; border: 1px solid var(--line); background: #fff; color: var(--forest); border-radius: 9px; padding: 7px 3px; font-weight: 700; font-size: 11px; cursor: pointer; }
.nyf-calorie-equation { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin: 12px 0; }
.nyf-calorie-equation div { background: #F3F7FB; border: 1px solid var(--line); border-radius: 11px; padding: 10px 5px; text-align: center; }
.nyf-calorie-equation strong { display: block; font-size: 17px; color: var(--forest); font-family: 'Outfit', sans-serif; }
.nyf-calorie-equation span { display: block; color: var(--ink-soft); font-size: 9.5px; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
.nyf-consent { display: flex; align-items: flex-start; gap: 9px; font-size: 11.5px; line-height: 1.5; color: var(--ink-soft); margin: 12px 0; }
.nyf-consent input { margin-top: 3px; accent-color: var(--forest); }
.nyf-save-state { margin-top: 6px; font-size: 10.5px; font-weight: 700; color: #C9D9E8; }
.nyf-save-state.error { color: #FFD0C9; }
.nyf-learn-path { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.nyf-learn-path div { border-radius: 12px; padding: 12px; background: #F3F7FB; border: 1px solid var(--line); }
.nyf-learn-path strong { display: block; color: var(--forest); font-size: 12px; margin-bottom: 4px; }
.nyf-learn-path span { display: block; color: var(--ink-soft); font-size: 10.5px; line-height: 1.4; }
.nyf-install-guide { position: fixed; inset: 0; z-index: 50; background: rgba(3,20,40,.68); backdrop-filter: blur(5px); display: flex; align-items: flex-end; justify-content: center; }
.nyf-install-sheet { width: min(100%, 480px); background: #fff; border-radius: 24px 24px 0 0; padding: 22px 22px calc(24px + env(safe-area-inset-bottom)); box-shadow: 0 -20px 50px rgba(3,20,40,.25); }
.nyf-install-icon { width: 66px; height: 66px; object-fit: contain; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 5px; box-shadow: 0 8px 20px rgba(3,29,58,.1); }
.nyf-install-step { display: flex; gap: 10px; align-items: flex-start; margin: 11px 0; font-size: 12.5px; color: var(--ink-soft); line-height: 1.45; }
.nyf-install-step strong { width: 24px; height: 24px; border-radius: 50%; background: var(--gold-soft); color: #76510D; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nyf-workout-hero { background: linear-gradient(135deg, #031D3A, #0868AA); color: #fff; border: 0; border-left: 4px solid var(--gold); }
.nyf-workout-time { display: inline-flex; padding: 6px 10px; border-radius: 20px; background: rgba(255,255,255,.12); color: #fff; font-size: 11px; font-weight: 800; margin-top: 10px; }
.nyf-levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 10px 0 14px; }
.nyf-levels button { border: 1px solid var(--line); background: #fff; color: var(--ink-soft); border-radius: 10px; padding: 9px 3px; font-size: 10.5px; font-weight: 800; cursor: pointer; }
.nyf-levels button.active { background: var(--forest); border-color: var(--forest); color: #fff; }
.nyf-exercise-card { border: 1px solid var(--line); border-radius: 12px; padding: 12px; margin-bottom: 9px; background: #fff; }
.nyf-exercise-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.nyf-exercise-level { color: var(--gold); font-size: 11px; font-weight: 800; margin-top: 4px; }
.nyf-exercise-how { color: var(--ink-soft); font-size: 12px; line-height: 1.55; margin-top: 9px; padding-top: 9px; border-top: 1px solid var(--line); }

.nyf-chip-group { margin-bottom: 14px; }
.nyf-chip-heading { font-size: 11px; font-weight: 700; letter-spacing: 0.04em; color: var(--gold); text-transform: uppercase; margin: 0 0 6px; }
.nyf-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.nyf-chip {
  border: 1px solid var(--line); background: var(--surface); color: var(--ink);
  border-radius: 20px; padding: 6px 12px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
  cursor: pointer;
}
.nyf-chip.selected { background: var(--forest); border-color: var(--forest); color: #fff; }
`;

const ARTICLES = [
  {
    title: "1. What fat loss really means",
    body: [
      "Body weight and body fat are not the same thing. Your weight on the scale includes muscle, bone, organs, water, glycogen, food moving through your gut, and fat — all added together into one number. Weight loss means that total number went down. Fat loss means body fat specifically went down. They often move together, but not always.",
      "Early scale drops are frequently water and glycogen, not fat. A single weigh-in is weak evidence of anything; a consistent trend over weeks is what actually tells you something. Waist measurements, photos, how clothes fit, strength and fitness all add context the scale alone can't give you.",
      "The aim isn't to make the number as small as possible — it's to lose excess fat while protecting muscle, health, and habits you can actually sustain.",
      "Daily changes of one or two kilograms are usually water, glycogen and food volume rather than fat. Salt, carbohydrates, hormones, constipation and hard training can all temporarily move the scale.",
      "Use several measures: weekly average weight, waist measurements every 2–4 weeks, consistent photos, clothing fit, strength and energy. Practical step: compare trends under similar conditions, not isolated weigh-ins.",
    ],
  },
  {
    title: "2. Calories in, calories out",
    body: [
      "Calories measure energy, not virtue. Over time, fat loss requires your body to use more energy than it takes in — that's energy balance, and it's real. But it isn't a moral scorecard, and it isn't effortless just because the principle is simple.",
      "Most of your daily energy use isn't from exercise — it's from just being alive (breathing, circulation, temperature regulation, digestion). Wearable exercise-calorie estimates are often inflated or double-counted against a target that already includes an activity factor.",
      "Look at weekly patterns, not single meals. A higher Saturday doesn't undo a week of consistency — your body responds to the overall pattern, not a disciplinary hearing after one biscuit.",
      "Calories out includes resting metabolism, digestion, exercise and everyday movement. Dieting can increase hunger and reduce unconscious movement, so the same intake may produce slower progress later without breaking the rules of energy balance.",
      "Wearables can help with steps and activity patterns, but exercise-calorie estimates are often inaccurate. Practical step: track everything honestly for two weeks—including oils, drinks, sauces and weekends—before deciding the target is not working.",
    ],
  },
  {
    title: "3. Set expectations that protect your progress",
    body: [
      "A realistic plan protects consistency, muscle, health, and your relationship with food. Pick one outcome goal, then three behaviours that support it — process goals you can actually perform daily, like a calorie-consistency target, a protein target, and training or step goals that fit your real week.",
      "Progress is uneven by nature. Water can hide fat loss for a while and then reveal it all at once. Expect that, and don't panic at a flat week — judge the trend, not any single day.",
      "A commonly sustainable rate for many adults is about 0.25–0.75% of body weight per week. Faster loss can increase hunger, fatigue and muscle loss, while already-lean people often need a slower approach.",
      "Separate outcomes from behaviours. 'Lose 8 kg' is an outcome; hitting your calorie range, protein, training and step goals are actions you control. Practical step: choose three weekly behaviours that fit your real schedule.",
    ],
  },
  {
    title: "4. Calories: your starting budget",
    body: [
      "A calorie is a unit of energy. South African labels usually show kilojoules — divide kJ by about 4.184 to get kcal. Your body spends energy on resting functions (most of it), digestion, planned exercise, and everyday movement like walking and chores.",
      "One reliable way to estimate your resting energy needs is the Mifflin-St Jeor equation: for women, (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161. For men, the same but +5 instead of −161. Multiply that by an activity factor (roughly 1.20 for low activity, 1.35 light, 1.50 moderate, 1.70 high) to estimate maintenance calories.",
      "From there, a starting deficit of around 10–20% below maintenance is a practical coaching range for many adults — not a medical prescription. We're not racing to the lowest number; we're finding the highest intake that still produces steady progress. Test your estimate against 2–4 weeks of real trend data before changing anything.",
      "Choose activity levels conservatively—a few gym sessions do not make an otherwise seated week highly active. For example, maintenance of 2,000 kcal gives a 10–20% deficit range of roughly 1,600–1,800 kcal.",
      "Calculators are only starting estimates. Keep the target consistent, review weight averages, hunger and training after 2–4 weeks, then make a small change if needed. Pregnancy, breastfeeding, eating-disorder history, diabetes medication or significant medical conditions require individual healthcare guidance.",
    ],
  },
  {
    title: "5. Protein, carbohydrate and fat",
    body: [
      "The three macronutrients have different jobs, and your overall intake and food quality matter more than picking a villain to fear. Protein maintains and repairs tissue. Carbohydrate is a useful fuel, especially for training and higher-intensity activity — fibre-rich sources are worth prioritising. Fat supports cell function, nutrient absorption, and making food enjoyable.",
      "A simple way to build a plate: a meaningful protein source, vegetables or fruit, a carbohydrate portion sized to your activity and hunger, and a measured fat or sauce. Two meals with identical calories can feel completely different depending on their protein, fibre and volume — energy balance drives fat loss, but food quality drives health, hunger and how easy the whole thing is to sustain.",
      "Protein and carbohydrate provide about 4 kcal per gram; fat provides about 9 kcal per gram. Carbohydrate supports harder training, while dietary fat supports cells, hormones and absorption of vitamins A, D, E and K. None needs to be treated as the enemy.",
      "Practical step: build most meals from four parts—protein, vegetables or fruit, an activity-sized carbohydrate portion and a measured fat or sauce. Treat foods can fit, but they usually use the calorie budget faster.",
    ],
  },
  {
    title: "6. Protein: the fat-loss anchor",
    body: [
      "Adequate protein supports fullness and helps protect lean muscle during fat loss, especially alongside resistance training. A practical range for many active adults dieting is around 1.6–2.2g of protein per kilogram of body weight — a range to work within, not a pass-fail exam.",
      "Calculate a provisional target, then spread it across your normal meals rather than saving it all for one sitting.",
      "If current body weight is much higher than goal weight, calculating from goal weight can prevent an unnecessarily large protein target. People with kidney disease or related medical conditions should obtain individual clinical advice.",
      "Aim for a useful protein serving at each meal—often around 25–40 g—using foods such as chicken, fish, lean meat, eggs, yoghurt, cottage cheese, tofu, legumes or whey. Supplements are convenient, not compulsory.",
      "Practical step: choose the protein source first for every main meal, then build the rest of the plate around it.",
    ],
  },
  {
    title: "7. Build meals that keep you full",
    body: [
      "The best fat-loss meal controls calories while still feeling like actual food — a tiny decorative salad might be low-calorie, but it won't keep you satisfied. Start with your protein choice so it's never an afterthought; a palm-sized portion is a reasonable visual starting point when you're not tracking precisely.",
      "Aim to build three repeatable meals you can fall back on: a rushed weekday meal, a family meal, and a go-to choice for eating out.",
      "Fullness improves when meals contain protein, fibre, volume and texture. Fruit, vegetables, potatoes, oats, soups and yoghurt can create a larger, more satisfying meal for the same calories than pastries, sweets or liquid calories.",
      "Meal timing is personal. You do not need six meals a day; choose the pattern that controls hunger and supports your routine. Practical step: prepare one quick option, one family dinner and one restaurant choice before you need them.",
    ],
  },
  {
    title: "8. Portions, labels and hidden calories",
    body: [
      "A nutrition label is only useful when you compare its stated serving size to the amount you actually eat — the packet says one serving; your bowl often says otherwise. Read a label in order: serving size first, then calories/kilojoules, protein, carbohydrate, fat, fibre and sodium.",
      "Multiply every value when you eat more than one serving, and compare products per 100g as well as per serving so you're comparing like with like.",
      "Weigh calorie-dense items while learning portions. Oil, peanut butter, nuts, cheese, mayonnaise and dressings are easy to underestimate. A small unmeasured pour can change a meal substantially.",
      "Raw and cooked weights are different: meat loses water; rice and pasta gain it. Choose a database entry that matches how you weighed the food. Practical step: weigh your most common foods for two weeks to train your eye.",
    ],
  },
  {
    title: "9. Calculate your personal targets",
    body: [
      "Targets are starting estimates that must be tested against real-life trends — no calculator, watch or app knows exactly how many calories your body uses. Start with calories using the Chapter 4 method and a moderate deficit, then set a protein range and build fibre gradually through plants and whole foods.",
      "Calories set the energy budget; protein protects lean tissue and manages hunger; fibre supports fullness. None of these should be so aggressive that the others collapse. After a few consistent weeks, let the trend — not the calculator — guide your next decision.",
      "Set targets in order: calories first, protein second, a sensible minimum fat intake third, then use the remaining calories for carbohydrate and additional fat according to preference and training needs.",
      "Protein and carbohydrate provide roughly 4 kcal per gram and fat roughly 9. Treat macro targets as ranges—being a few grams away is not failure. Practical step: prioritise calories and protein, then review the 2–4 week trend before adjusting.",
    ],
  },
  {
    title: "10. Create your own meal plan",
    body: [
      "A meal plan is a flexible structure, not a prison sentence. Decide how many meals and snacks actually suit your hunger and schedule, allocate protein first, and reserve more calories for whichever time of day you're hungriest.",
      "Plan around the week you actually have — work, family meals, and realistic effort — rather than an idealised version of your schedule.",
      "Allocate protein across your chosen meals, then reserve more calories for the time of day you are usually hungriest. Use flexible swaps: chicken for fish or lean mince, rice for potato, and yoghurt for cottage cheese, checking actual nutrition values.",
      "Keep emergency options available for busy days and plan predictable restaurant meals or treats in advance. Practical step: log tomorrow's food tonight and adjust portions before the day becomes hectic.",
    ],
  },
  {
    title: "11. Example meal plans — used as teaching tools",
    body: [
      "An example plan shows structure; it doesn't know your medical history, appetite or energy needs. Use examples to understand the decision-making process, then rewrite them with foods you actually buy, cook and enjoy — real life includes leftovers, birthdays, and children who change their minds about dinner.",
      "Two people can reach similar targets with completely different menus. Eggs, yoghurt, chicken and rice can be swapped for oats, biltong, mince and potatoes when portions and totals are adjusted.",
      "Always check whether weights are raw or cooked and enter your exact brands, because breads, yoghurts, sauces and protein powders vary. Practical step: replace every food you would not realistically eat with a nutritionally similar option you enjoy.",
    ],
  },
  {
    title: "12. Strength training: build the body you keep",
    body: [
      "During fat loss, strength training signals to your body that muscle is worth keeping rather than losing alongside fat. You don't need to fear 'bulking up overnight' — muscle doesn't arrive nearly that easily.",
      "Two realistic full-body sessions a week, covering the major movement patterns, is a solid starting point most people can actually sustain.",
      "A balanced programme includes a knee bend, hinge, push, pull, carry and core work. Exercises should match your experience, mobility and injuries, then progress gradually through repetitions, load or range of motion.",
      "Maintaining strength during a deficit is meaningful progress. Soreness is not proof of a good session and sharp or persistent pain should be assessed. Practical step: record weights and repetitions so you can see what your body is retaining.",
    ],
  },
  {
    title: "13. Cardio and heart health",
    body: [
      "Cardiorespiratory fitness supports health, work capacity and quality of life — and running isn't the only form that counts. Choose modes you can perform consistently; the heart accepts far more variety than most people assume.",
      "A useful starting structure: one easy, comfortable cardio session and one optional interval session per week.",
      "Use the talk test: easy cardio should still allow sentences. Walking, cycling, rowing, swimming and low-impact circuits all count, so choose a mode your joints tolerate and you can repeat.",
      "Intervals are effective in small doses but require recovery. Cardio supports fitness and energy expenditure; it should not be punishment for eating. Practical step: build duration gradually before adding more intensity.",
    ],
  },
  {
    title: "14. Steps and everyday movement",
    body: [
      "A formal workout can feel heroic, but the other 23 hours of the day matter too. Everyday movement — steps, chores, standing, carrying things — contributes real energy expenditure and health benefit without needing to feel like exercise.",
      "Track your baseline for a week, then choose one small, sustainable increase rather than an overnight overhaul.",
      "There is no magical universal step target. If your baseline is 4,000, moving toward 5,000–6,000 is already progress. Short walks after meals, parking farther away and walking during calls all count.",
      "Diet fatigue can reduce unconscious movement, partly offsetting planned exercise. Practical step: add 500–1,500 daily steps for two weeks, then reassess rather than making one huge jump.",
    ],
  },
  {
    title: "15. Recovery and the way you age",
    body: [
      "Training creates a signal; recovery is what allows your body to adapt to it. Rest isn't something you earn after doing enough — it's part of doing enough. Sleep and recovery deserve a place in your programme, not an afterthought once everything else is done.",
      "Pick one sleep habit and one recovery boundary to focus on for the next couple of weeks.",
      "Most adults benefit from roughly 7–9 hours of sleep. Regular timing, a dark room, less late caffeine and a short wind-down routine can help even when life prevents perfection.",
      "Persistent fatigue, falling performance, irritability, poor sleep and ongoing soreness may indicate that training load or the deficit is too aggressive. Practical step: schedule at least one easier or rest day and tell your coach when recovery worsens.",
    ],
  },
  {
    title: "16. Plateaus and troubleshooting",
    body: [
      "A true plateau is a sustained lack of change despite genuinely consistent adherence — not three noisy weigh-ins in a row. Before changing your target, audit your actual consistency: is tracking accurate, are portions creeping up, has activity quietly dropped?",
      "If adherence is genuinely solid and the trend has been flat for 3–4 consistent weeks, a small adjustment — often just 100–200 calories — is more appropriate than a drastic overhaul.",
      "Audit oils, sauces, drinks, bites while cooking, database entries, restaurants and weekends. Also check whether steps or training have fallen. Menstrual-cycle water retention can hide progress, so compare similar cycle phases where possible.",
      "Change one variable at a time. A small calorie adjustment, modest activity increase or improved consistency is easier to evaluate than changing everything. Sometimes a controlled maintenance break is more useful than a deeper deficit.",
    ],
  },
  {
    title: "17. Weekends, cravings and real life",
    body: [
      "A plan that only works under perfect conditions isn't ready for real life. Build in flexibility for restaurants, celebrations and difficult days rather than treating any deviation as failure.",
      "A practical approach: write a Friday-to-Sunday plan that includes one flexible meal and one recovery routine, so the weekend has structure without being rigid.",
      "Cravings can come from hunger, restriction, habit, emotion or enjoyment. First check protein, fibre and meal volume; then consider a planned portion instead of resisting until you overeat.",
      "After an unplanned high-calorie meal, return to normal at the next meal—do not starve or add punishment exercise. Most immediate scale gain is water and food volume. Practical step: decide in advance which restaurant extras matter most to you.",
    ],
  },
  {
    title: "18. Maintenance: keep your new normal",
    body: [
      "Maintenance isn't a finish line where biology stops applying — it's a set of repeatable skills, much like learning to drive without an instructor gripping the dashboard. The goal shifts from active fat loss to a sustainable long-term range you can live inside.",
      "Write out your maintenance range, your anchors (habits you'll keep no matter what), and an early-warning plan for noticing drift before it becomes a real problem.",
      "Maintenance calories are a range, not one perfect number. A small initial increase on the scale can be glycogen, water and greater food volume rather than immediate fat regain.",
      "Keep regular weighing, protein-centred meals, strength training, movement and some planning. Choose a comfortable weight range and respond calmly if the weekly trend exceeds it for several weeks.",
      "Difficult seasons may require a simpler version of the plan. Maintaining through holidays, injury or work stress is still success. Practical step: define three habits you will keep and the warning signs that trigger a routine review.",
    ],
  },
  {
    title: "19. Macros made simple",
    body: [
      "Macros is short for macronutrients: protein, carbohydrate and fat. They are nutrients your body needs in relatively large amounts, and together they make up nearly all the calories in food.",
      "Protein and carbohydrate each provide about 4 calories per gram, while fat provides about 9. Alcohol provides about 7 calories per gram but is not an essential nutrient. This is why a small amount of oil or peanut butter can contain many calories.",
      "Calories determine the size of your energy budget; macros describe what that budget contains. For fat loss, total calories and adequate protein usually deserve the most attention. Carbs and fats can then be divided according to preference, health and training needs.",
      "You do not need to hit every macro exactly. Treat targets as useful ranges. A day that is five grams away from a target is still a successful day.",
    ],
  },
  {
    title: "20. Carbohydrates are fuel, not the enemy",
    body: [
      "Carbohydrates break down mainly into glucose, a useful fuel for your brain, muscles and higher-intensity exercise. Rice, potatoes, oats, bread, fruit, vegetables, beans and milk all contain carbohydrate.",
      "Carbohydrates also store with water as glycogen. Eating more carbs can temporarily increase scale weight without adding body fat. Eating fewer can cause a quick water-weight drop that is not the same as fat loss.",
      "Choose mostly fibre-rich sources and use portions that fit your calorie target. Place some carbohydrate around training if it helps energy and performance.",
      "Sugar is a carbohydrate. It can fit in moderation, but sugary drinks and sweets are easy to consume without feeling full. The goal is sensible quantity, not fear.",
    ],
  },
  {
    title: "21. Dietary fat and why your body needs it",
    body: [
      "Dietary fat helps form cell membranes, supports hormone production, carries flavour and helps absorb vitamins A, D, E and K. Examples include olive oil, avocado, nuts, seeds, eggs, dairy and oily fish.",
      "Fat is calorie dense at about 9 calories per gram. Healthy fats are still calories, so measure oils, nuts, cheese, mayonnaise and peanut butter when fat loss is the goal.",
      "Unsaturated fats from plants and fish are generally useful everyday choices. Saturated fat does not need to be eliminated, but it is sensible to keep it moderate within an overall balanced diet.",
      "Very low-fat eating is not automatically better. Aim for a sensible amount that fits your targets and makes meals enjoyable enough to sustain.",
    ],
  },
  {
    title: "22. Fibre, digestion and feeling full",
    body: [
      "Fibre is the part of plant food your body does not fully digest. It supports bowel regularity, feeds helpful gut bacteria, slows digestion and can make meals more filling.",
      "Fruit, vegetables, beans, lentils, oats, whole grains, nuts and seeds are useful sources. Increase fibre gradually and drink enough fluid; adding a large amount overnight can cause bloating or discomfort.",
      "Many adults benefit from roughly 25–30 grams daily, although individual needs differ. You do not need to track it perfectly—include plants at most meals and vary your choices.",
      "A practical plate starts with protein and vegetables, then adds a suitable carbohydrate and measured fat. That combination usually controls hunger better than calories from drinks or highly processed snacks.",
    ],
  },
  {
    title: "23. How to read a food label",
    body: [
      "Start with the serving size. Nutrition values may be listed per serving and per 100 grams. If the serving is 30 grams but you eat 60 grams, double every listed number.",
      "South African labels often use kilojoules. Divide kilojoules by 4.184 for calories. For a quick estimate, divide by four; 840 kJ is approximately 200 calories.",
      "Compare similar products per 100 grams. Then check protein, carbohydrate, sugar, fat, saturated fat, fibre and sodium according to what matters for your goals.",
      "Marketing words such as natural, high-protein, low-carb or fitness do not automatically make a product low-calorie. The nutrition table and actual portion tell the useful story.",
    ],
  },
  {
    title: "24. Strength-training words beginners hear",
    body: [
      "A repetition, or rep, is one complete movement. A set is a group of repetitions. Three sets of ten squats means performing ten squats, resting, and repeating that sequence three times.",
      "Resistance is the load your muscles work against: body weight, bands, dumbbells, barbells or machines. Good form means controlling the movement in a way that suits your body and keeps the intended muscles working.",
      "Progressive overload means gradually asking your body to do slightly more—an extra rep, a little more weight, better control or a greater comfortable range of motion. It does not mean lifting maximally every session.",
      "RPE describes effort from 1 to 10. An RPE of 7–8 usually means you could perform about two or three more good reps. Beginners can make excellent progress without training to complete failure.",
    ],
  },
  {
    title: "25. What happens during a New You class",
    body: [
      "A class normally starts with a warm-up to raise body temperature, practise movements and prepare joints and muscles. The coach then explains the workout and demonstrates exercise options.",
      "Strength work challenges muscles with controlled resistance. Conditioning raises heart rate and improves work capacity. Both can be adjusted to your fitness, confidence and injury history.",
      "Choose the level that lets you move well—not the one that looks most impressive. Reducing weight, range, speed or impact is intelligent coaching, not failure.",
      "Tell the coach about pain, pregnancy, surgery or medical limitations before training. Normal effort and muscle fatigue feel different from sharp, sudden or worsening pain.",
    ],
  },
  {
    title: "26. Soreness, pain and recovery",
    body: [
      "Delayed-onset muscle soreness can appear 12–48 hours after unfamiliar training and usually settles within several days. You can have a productive workout without becoming very sore.",
      "Sharp pain, joint pain, numbness, swelling, chest pain, faintness or pain that worsens is not something to push through. Stop and tell your coach; seek appropriate medical help when symptoms are concerning.",
      "Recovery includes sleep, adequate protein and calories, hydration, easier movement and sensible spacing between hard sessions. More training is not always more progress.",
      "Build gradually. Your muscles, tendons, joints and confidence all need time to adapt, especially when returning after a long break.",
    ],
  },
  {
    title: "27. Water, supplements and protein powder",
    body: [
      "Hydration needs change with body size, heat, sweat and activity. Pale-yellow urine and normal thirst are useful everyday guides. Drink more around hot or sweaty training without forcing extreme amounts.",
      "Supplements cannot replace an appropriate calorie intake, adequate protein, fruit and vegetables, sleep and training. Most products add small benefits only after the basics are consistent.",
      "Whey protein is simply a convenient protein-rich food. Look at protein per serving, calories, ingredients, taste, price and whether it agrees with your digestion. It is not required if food already meets your needs.",
      "Creatine monohydrate is well researched for strength and muscle performance, but it can increase water stored inside muscle. Discuss supplements with a healthcare professional if you are pregnant, breastfeeding, under 18, take medication or have a medical condition.",
    ],
  },
  {
    title: "28. Your first four weeks",
    body: [
      "Week one is for learning: log honestly, learn common portions, choose manageable classes and notice hunger. Do not react dramatically to every scale movement.",
      "Week two is for repetition: keep calories in a reasonable range, include protein at meals, improve steps and repeat the exercises with better control.",
      "Weeks three and four provide enough information to begin seeing patterns. Review average weight, waist, food consistency, energy, hunger, sleep and training—not only the best or worst day.",
      "If the plan is working and feels manageable, continue. If progress, recovery or adherence is poor, discuss one small change with your coach. The goal is to build skills you can keep using after motivation fades.",
    ],
  },
];

const FOOD_PICKS = [
  {
    name: "Plain / Greek-style yoghurt (high-protein, low-fat)",
    note: "Best pick: a high-protein plain/fat-free Greek-style tub (e.g. Woolworths High Protein Plain Yoghurt). A full-cream 'Protein+' style tub (e.g. Parmalat Protein+) has more protein per tub but also more fat — check the label.",
    cal: 60, protein: 10, carb: 4, fat: 0.2, per: "100g",
  },
  { name: "Blueberries", note: "Great low-calorie source of fibre and antioxidants — naturally low in fat and protein, moderate in natural sugar.", cal: 57, protein: 0.7, carb: 14, fat: 0.3, per: "100g" },
  { name: "Whey protein powder", note: "Typical plain/lightly flavoured whey — check your specific tub's label as brands vary.", cal: 120, protein: 24, carb: 3, fat: 1.5, per: "1 scoop (~30g)" },
  { name: "Chicken fillets (skinless, grilled)", note: "One of the leanest common protein sources — very high protein, virtually no carbs.", cal: 165, protein: 31, carb: 0, fat: 3.6, per: "100g" },
  { name: "Scrambled eggs", note: "Made with a splash of milk, no added cheese — great protein-to-effort ratio for breakfast.", cal: 148, protein: 10, carb: 1.5, fat: 11, per: "100g (~2 eggs)" },
  { name: "Sasko Low GI Oats & Honey bread", note: "A reasonable everyday bread choice — moderate carbs, low fat, some fibre from the oats.", cal: 114, protein: 4.5, carb: 19, fat: 1.7, per: "1 slice (~45g)" },
];

const FOOD_PREFERENCE_LIST = [
  {
    category: "Protein",
    items: ["Chicken breast", "Chicken thighs", "Lean beef mince", "Steak", "Eggs", "Tuna", "Salmon", "Hake / white fish", "Greek yoghurt", "Cottage cheese", "Whey protein", "Tofu", "Lentils", "Chickpeas", "Beans"],
  },
  {
    category: "Carbs & starches",
    items: ["Rice", "Potatoes", "Sweet potato", "Oats", "Wholewheat bread", "Pasta", "Couscous", "Butternut", "Quinoa", "Mealie meal / pap"],
  },
  {
    category: "Vegetables & fruit",
    items: ["Broccoli", "Spinach", "Carrots", "Green beans", "Peppers", "Tomatoes", "Cucumber", "Bananas", "Apples", "Blueberries", "Oranges", "Avocado"],
  },
  {
    category: "Dairy",
    items: ["Milk", "Cheese", "Plain yoghurt", "Amasi"],
  },
  {
    category: "Fats & extras",
    items: ["Olive oil", "Peanut butter", "Nuts", "Hummus", "Salsa", "Biltong"],
  },
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const DAILY_MOTIVATION = [
  "Consistency beats intensity when intensity cannot be sustained.",
  "One balanced meal is a vote for the person you are becoming.",
  "You do not need a perfect day—just one good next decision.",
  "Small choices, repeated often, create remarkable change.",
  "Keep the promise you made to yourself today.",
  "Progress grows quietly before it becomes visible.",
  "Fuel your goals, move your body and trust the process.",
  "A difficult day does not erase your consistent weeks.",
  "Your future self is built by what you practise today.",
  "Show up imperfectly. That still counts as showing up.",
  "Eat to support your goal, not to punish your body.",
  "The scale is one data point; your habits tell the fuller story.",
  "Keep going—ordinary days are where transformation happens.",
  "Choose progress over all-or-nothing thinking.",
  "Today is another chance to become stronger and healthier.",
  "A steady plan you follow is better than a perfect plan you abandon.",
  "Your results come from returning to the plan, again and again.",
  "Protein, plants, water and patience—keep the basics strong.",
  "You are not starting over; you are continuing with experience.",
  "Every healthy choice makes the next one a little easier.",
  "Discipline is remembering what you want most.",
];
const WORKOUTS = [
  { day: "Sunday", title: "Recovery reset", focus: "Mobility, core and easy conditioning", format: "15 min mobility flow · 15 min easy circuit · 5 min core", exercises: [
    ["World's greatest stretch", "Step into a long lunge, place both hands inside the front foot, rotate the inside arm toward the ceiling, then change sides.", "Hands elevated, short lunge", "Floor version, controlled", "Add deeper rotation and reach"],
    ["Glute bridge", "Lie on your back with knees bent. Brace, squeeze your glutes and lift your hips without arching your lower back.", "Bodyweight, 10 reps", "Bodyweight, 15 reps", "Single-leg, 8 each"],
    ["Bird dog", "From hands and knees, brace your middle and slowly extend the opposite arm and leg without rotating your hips.", "Move one limb at a time", "Opposite arm and leg", "Pause 3 seconds each rep"],
    ["March or walk", "Stay tall, swing your arms and maintain a comfortable pace at which you can speak in sentences.", "Easy march", "Brisk walk", "Light jog"],
  ]},
  { day: "Monday", title: "Full-body strength", focus: "Strong movement patterns with controlled conditioning", format: "15 min strength AMRAP · 2 min transition · 15 min circuit · 3 min finisher", exercises: [
    ["Squat", "Stand about shoulder-width, brace, sit your hips between your feet and drive the floor away to stand.", "Chair squat × 10", "Goblet squat × 10", "Double-dumbbell front squat × 8"],
    ["Push-up", "Keep head, ribs and hips in one line. Lower your chest under control, then press the floor away.", "Wall or bench × 10", "Knees or low bench × 8", "Floor × 10–15"],
    ["Dumbbell row", "Support one hand, keep your back long and pull the dumbbell toward your hip without twisting.", "Light × 10 each", "Moderate × 12 each", "Heavy × 10 each"],
    ["Romanian deadlift", "Soften the knees, push hips back while keeping weights close, then squeeze glutes to stand tall.", "Bodyweight hinge × 12", "Dumbbells × 10", "Heavy dumbbells × 8"],
    ["Fast feet", "Take short quick steps, stay light on your feet and keep your chest tall.", "March 30 sec", "Fast feet 30 sec", "High knees 30 sec"],
  ]},
  { day: "Tuesday", title: "Conditioning + engine", focus: "Functional fitness and sustainable speed", format: "15 min intervals · 2 min transition · 15 min AMRAP · 3 min finisher", exercises: [
    ["Step-up", "Place the whole foot on a stable step, drive through it to stand and control the descent.", "Low step × 8 each", "Medium step × 10 each", "Weighted × 10 each"],
    ["Dumbbell deadlift", "Brace, push hips back, keep weights close and stand by driving through the floor.", "Light × 12", "Moderate × 12", "Heavy × 10"],
    ["Mountain climber", "Hold a strong plank and bring one knee forward at a time without letting your hips bounce.", "Hands elevated, slow × 20", "Floor, controlled × 24", "Fast cross-body × 30"],
    ["Dumbbell push press", "Dip slightly through knees and hips, then drive the weights overhead while keeping ribs controlled.", "One light weight × 10", "Two weights × 10", "Heavier × 8"],
    ["Shuttle", "Move between two safe markers, decelerate under control and turn with short steps.", "Fast walk 30 sec", "Jog 30 sec", "Run 30 sec"],
  ]},
  { day: "Wednesday", title: "Recovery conditioning + core", focus: "Move well, strengthen your middle and recover", format: "15 min easy circuit · 2 min transition · 15 min core flow · 3 min breathing", exercises: [
    ["Reverse lunge", "Step back, lower both knees comfortably, keep the front foot planted and drive forward to stand.", "Supported shallow × 8 each", "Bodyweight × 10 each", "Weighted × 10 each"],
    ["Dead bug", "Lie on your back, gently press your lower back down and slowly extend opposite arm and leg.", "Heel taps × 10", "Opposite limbs × 10", "Hold a light weight × 12"],
    ["Side plank", "Keep shoulder stacked over elbow and create a straight line through your body without dropping the hips.", "Bent knees, 20 sec", "Straight legs, 25 sec", "Top-leg lift, 25 sec"],
    ["Good morning", "Place hands across your chest, soften knees and hinge hips backward while keeping your spine long.", "Bodyweight × 12", "Light weight × 12", "Slow tempo × 10"],
    ["Low-impact cardio", "Move continuously at a pace that raises your heart rate while still allowing comfortable breathing.", "March 60 sec", "Step jacks 60 sec", "Easy skipping 60 sec"],
  ]},
  { day: "Thursday", title: "Full-body strength patterns", focus: "New movements, full-body strength and control", format: "15 min quality rounds · 2 min transition · 15 min density block · 3 min carry", exercises: [
    ["Split squat", "Use a staggered stance, lower straight down and drive through the front foot while keeping the torso tall.", "Supported × 8 each", "Bodyweight × 10 each", "Weighted × 8 each"],
    ["Floor press", "Lie on your back, keep wrists stacked and lower elbows gently to the floor before pressing up.", "One dumbbell × 10", "Two dumbbells × 10", "Heavy × 8–10"],
    ["Bent-over row", "Hinge at the hips, brace your trunk and pull both weights toward your lower ribs.", "Light × 10", "Moderate × 12", "Heavy × 8–10"],
    ["Dumbbell clean", "Drive through legs and hips, guide the weight close to your body and receive it softly at the shoulder.", "One light weight × 6 each", "Alternating × 8 each", "Two dumbbells × 8"],
    ["Farmer carry", "Stand tall with weights at your sides, brace and walk with controlled steps without leaning.", "Light 30 sec", "Moderate 40 sec", "Heavy 45 sec"],
  ]},
  { day: "Friday", title: "Hybrid conditioning", focus: "Cardio intervals, strength endurance and HIIT", format: "15 min 40:20 intervals · 2 min transition · 15 min rounds · 3 min finisher", exercises: [
    ["Burpee", "Place hands down, step or jump to plank, return your feet and stand tall. Keep the movement controlled.", "Hands elevated, step × 6", "Floor step-back × 8", "Chest-to-floor jump × 10"],
    ["Dumbbell thruster", "Squat with weights at shoulders, then drive up and use the leg momentum to press overhead.", "One light weight × 8", "Two light weights × 10", "Heavier × 10"],
    ["Alternating lunge", "Step forward or backward, lower with control and keep the front knee following the toes.", "Supported × 8 each", "Bodyweight × 10 each", "Weighted × 10 each"],
    ["Plank shoulder tap", "From a strong plank, tap the opposite shoulder while resisting hip rotation.", "Hands elevated × 12", "Knees down × 16", "Full plank × 20"],
    ["Cardio burst", "Choose a safe option and work hard while maintaining control; slow down before technique breaks.", "March 40 sec", "Step jacks 40 sec", "High knees or skipping 40 sec"],
  ]},
  { day: "Saturday", title: "Challenge workout", focus: "Solo challenge with community-style energy", format: "15 min AMRAP · 2 min transition · 15 min ladder · 3 min best effort", exercises: [
    ["Ground-to-overhead", "Lift a weight from between the feet using legs and hips, then guide it overhead with control.", "Light plate/dumbbell × 8", "Single dumbbell × 10", "Two dumbbells × 10"],
    ["Bodyweight squat", "Keep your whole foot grounded, sit down between your hips and stand tall with knees tracking toes.", "Chair × 12", "Free squat × 15", "Jump squat × 12"],
    ["Renegade row", "From a plank or elevated position, pull one weight toward your hip while keeping your body square.", "Hands elevated × 6 each", "Knees down × 8 each", "Full plank × 8 each"],
    ["Sit-up", "Brace before moving, curl the trunk with control and avoid pulling on your neck.", "Crunch × 12", "Sit-up × 12", "Weighted sit-up × 10"],
    ["Shuttle or skipping", "Use quick controlled footwork and a pace you can maintain for the prescribed interval.", "Fast walk 45 sec", "Jog 45 sec", "Run/skip 45 sec"],
  ]},
];
const GYM_WORKOUTS = [
  { day: "Sunday", title: "Gym recovery reset", focus: "Easy cardio, mobility and controlled core work", exercises: [
    ["Stationary bike", "Adjust the seat so the knee stays slightly bent at the bottom. Pedal smoothly at a conversational pace.", "Easy resistance", "Moderate resistance", "Moderate resistance with short pickups"],
    ["Cable face pull", "Set the cable near eye height, pull the rope toward your face and squeeze the shoulder blades without shrugging.", "Very light cable", "Light cable", "Moderate cable with a pause"],
    ["Cable Pallof press", "Stand side-on to the cable, brace and press the handle forward without allowing your torso to rotate.", "Light, wide stance", "Moderate, narrow stance", "Half-kneeling with controlled load"],
    ["Back extension", "Hinge from the hips with a neutral spine, then squeeze the glutes to return to a straight-body position.", "Short bodyweight range", "Full bodyweight range", "Hold a light plate"],
    ["Incline treadmill walk", "Walk tall without leaning on the rails. Choose a pace that allows calm, controlled breathing.", "Flat/easy walk", "Moderate incline", "Brisk incline walk"],
  ]},
  { day: "Monday", title: "Gym full-body strength", focus: "Heavy foundational lifts with functional conditioning", exercises: [
    ["Barbell back squat", "Brace before unracking, keep the whole foot planted, sit between the hips and drive the floor away.", "Goblet squat with light dumbbell", "Barbell squat at a comfortable load", "Heavier barbell with perfect form"],
    ["Dumbbell bench press", "Set the shoulder blades against the bench, lower the dumbbells with control and press above the chest.", "Light dumbbells", "Moderate dumbbells", "Heavy controlled dumbbells"],
    ["Lat pulldown", "Keep the ribs controlled and pull the bar toward the upper chest by driving the elbows down.", "Light neutral grip", "Moderate standard grip", "Heavy controlled reps"],
    ["Barbell Romanian deadlift", "Soften the knees, push the hips back, keep the bar close and stand by squeezing the glutes.", "Light dumbbells", "Moderate barbell", "Heavy barbell with straps if needed"],
    ["Rower", "Drive with the legs, lean slightly, then pull to the lower ribs. Return arms, body and legs in that order.", "Easy steady pace", "Strong sustainable pace", "Hard powerful pace"],
  ]},
  { day: "Tuesday", title: "Gym conditioning + engine", focus: "Machines, loaded movement and sustainable speed", exercises: [
    ["Dumbbell box step-up", "Place the whole foot on the box, drive through it to stand and lower under control.", "Low box, bodyweight", "Medium box, light dumbbells", "Higher box, challenging dumbbells"],
    ["Kettlebell swing", "Hinge and snap the hips forward; let the kettlebell float without lifting it with the arms.", "Light kettlebell deadlift", "Russian swing to chest height", "Heavier powerful Russian swing"],
    ["Cable row", "Sit tall, brace and pull the handle toward the lower ribs without rocking backward.", "Light load", "Moderate load", "Heavy load with a pause"],
    ["Dumbbell push press", "Dip through the knees and hips, then drive the dumbbells overhead while keeping the ribs down.", "One light dumbbell", "Two moderate dumbbells", "Two challenging dumbbells"],
    ["Assault bike or spin bike", "Push and pull smoothly while driving the pedals. Keep a pace you can repeat for every interval.", "Easy spin", "Strong steady effort", "Hard interval effort"],
  ]},
  { day: "Wednesday", title: "Gym recovery + core", focus: "Low-impact conditioning, trunk strength and mobility", exercises: [
    ["Treadmill incline walk", "Walk tall without holding the rails and use an incline that keeps the effort controlled.", "Flat to 2% incline", "4–7% incline", "8–12% brisk incline"],
    ["Cable wood chop", "Brace and rotate through the upper back and hips while guiding the cable diagonally across the body.", "Light, small range", "Moderate controlled range", "Half-kneeling with greater control"],
    ["Captain's chair knee raise", "Press the back into the pad, brace and raise the knees without swinging.", "Alternating knee lifts", "Both knees together", "Straighter-leg raise"],
    ["Hip thrust on bench", "Plant the feet, tuck the ribs and drive the hips up by squeezing the glutes, not the lower back.", "Bodyweight", "Dumbbell across hips", "Padded barbell across hips"],
    ["Cross-trainer", "Keep the heels supported and move smoothly at a recovery pace you can maintain.", "Easy resistance", "Moderate resistance", "Moderate resistance with short pickups"],
  ]},
  { day: "Thursday", title: "Gym strength patterns", focus: "Different movement patterns using free weights and cables", exercises: [
    ["Barbell deadlift", "Brace before lifting, push the floor away and keep the bar close. Finish tall without leaning back.", "Kettlebell deadlift", "Barbell from raised blocks", "Barbell from floor at a challenging load"],
    ["Incline dumbbell press", "Set the bench to a low incline, keep shoulders stable and press the dumbbells above the upper chest.", "Light dumbbells", "Moderate dumbbells", "Heavy controlled dumbbells"],
    ["Single-arm cable row", "Stand or kneel square to the cable and pull the handle toward the hip without rotating.", "Light supported stance", "Moderate split stance", "Heavy half-kneeling row"],
    ["Barbell reverse lunge", "Step backward and lower under control while keeping the front foot firmly planted.", "Supported bodyweight", "Dumbbell reverse lunge", "Barbell reverse lunge"],
    ["Farmer carry", "Hold heavy weights at the sides, brace, stand tall and walk with short controlled steps.", "Light dumbbells", "Moderate kettlebells", "Heavy dumbbells or trap bar"],
  ]},
  { day: "Friday", title: "Gym hybrid conditioning", focus: "Strength endurance mixed with cardio-machine intervals", exercises: [
    ["Barbell thruster", "Squat with the bar at the shoulders, stand powerfully and use that drive to press overhead.", "Light dumbbell goblet thruster", "Light barbell thruster", "Challenging barbell thruster"],
    ["Sled push", "Keep the arms firm, brace and drive through the floor with short powerful steps.", "Light sled or treadmill push", "Moderate sled", "Heavy sled"],
    ["Dumbbell walking lunge", "Step long enough to control both knees, stay tall and drive through the front foot.", "Bodyweight reverse lunge", "Light dumbbell walking lunge", "Heavy dumbbell walking lunge"],
    ["TRX or bar row", "Keep the body braced in one line and pull the chest toward the handles or bar.", "High-angle TRX row", "Lower-angle TRX row", "Feet-elevated row"],
    ["SkiErg or rower", "Create power with the whole body and return smoothly so the pace remains repeatable.", "Easy controlled pace", "Strong interval pace", "Hard race-style pace"],
  ]},
  { day: "Saturday", title: "Gym challenge workout", focus: "A measurable solo challenge using full-body gym movements", exercises: [
    ["Barbell ground-to-overhead", "Lift the bar close to the body with legs and hips, then receive it securely overhead.", "Light plate ground-to-overhead", "Light barbell clean and press", "Barbell power clean and push press"],
    ["Dumbbell front squat", "Hold the dumbbells at the shoulders, brace and squat with knees following the toes.", "Goblet squat", "Two dumbbells", "Heavy two-dumbbell squat"],
    ["Renegade row", "Brace in a plank and row one dumbbell toward the hip while resisting torso rotation.", "Hands on bench", "Knees on floor", "Full plank with heavier dumbbells"],
    ["Bench burpee", "Place the hands securely, step or jump back, return the feet and stand with control.", "High-bench step-back", "Low-bench jump-back", "Floor chest-to-ground burpee"],
    ["Treadmill, bike or rower", "Choose one machine and work at a pace that is challenging but safe for the full interval.", "Fast walk/easy cycle", "Run or strong cycle/row", "Hard repeatable effort"],
  ]},
];
const WORKOUT_PLANS = [
  [["Set 1 · Mobility", "10 min", "2 rounds: stretch 45 sec, glute bridge 45 sec, bird dog 45 sec and easy march 45 sec. Take 15 sec to change after each movement, then rest 60 sec after each round."], ["Set 2 · Easy circuit", "15 min", "3 rounds: work for 45 sec on each exercise, take 15 sec to change, then walk and breathe for 60 sec."], ["Set 3 · Core & breathing", "10 min", "5 rounds: glute bridge 40 sec, bird dog 40 sec, then rest and breathe for 40 sec."]],
  [["Set 1 · Strength", "15 min", "3 rounds: squat 45 sec, push-up 45 sec, row left 45 sec, row right 45 sec and Romanian deadlift 45 sec. Rest/change for 15 sec after every exercise."], ["Reset", "2 min", "Walk slowly, breathe, drink water and prepare for the conditioning set."], ["Set 2 · Functional circuit", "15 min", "5 rounds: squat 30 sec, push-up 30 sec, alternating rows 30 sec, deadlift 30 sec, fast feet 30 sec, then rest 30 sec."], ["Finisher", "3 min", "6 rounds: fast feet or high knees for 20 sec, then rest for 10 sec."]],
  [["Set 1 · Engine intervals", "15 min", "3 rounds: step-ups, deadlifts, mountain climbers, push press and shuttle. Work 45 sec and rest/change for 15 sec at every station."], ["Reset", "2 min", "Walk slowly, breathe, drink water and prepare for the next set."], ["Set 2 · AMRAP", "15 min", "Keep repeating your selected Level 1, 2 or 3 reps for all five exercises. Work steadily and take up to 30 sec rest when form starts to slip."], ["Finisher", "3 min", "6 rounds: shuttle, skipping or high knees for 20 sec, then rest for 10 sec."]],
  [["Set 1 · Recovery circuit", "15 min", "3 rounds: reverse lunge, dead bug, side plank left, side plank right and good morning. Work for 45 sec and use 15 sec to change after every movement."], ["Reset", "2 min", "Easy walk, relaxed breathing and a small drink of water."], ["Set 2 · Core flow", "15 min", "3 rounds: dead bug 60 sec, side plank left 30 sec, side plank right 30 sec, glute bridge 60 sec, low-impact cardio 60 sec, then rest 60 sec."], ["Cool-down breathing", "3 min", "Walk slowly for 60 sec, then breathe in for 4 counts and out for 6 counts for 2 min."]],
  [["Set 1 · Strength", "15 min", "3 rounds: split squat left 45 sec, split squat right 45 sec, floor press 45 sec, bent-over row 45 sec and dumbbell clean 45 sec. Rest/change for 15 sec after every exercise."], ["Reset", "2 min", "Walk slowly, breathe, drink water and prepare your weights."], ["Set 2 · Density", "15 min", "5 rounds: floor press 40 sec, bent-over row 40 sec, dumbbell clean 40 sec, farmer carry 40 sec, then rest 20 sec."], ["Carry finisher", "3 min", "3 rounds: farmer carry for 45 sec, then put the weights down safely and rest for 15 sec."]],
  [["Set 1 · HIIT", "15 min", "3 rounds: burpee, thruster, alternating lunge, shoulder tap and cardio burst. Work 40 sec and rest/change 20 sec at every station."], ["Reset", "2 min", "Walk slowly, breathe and drink water. The next set should be strong but controlled."], ["Set 2 · Strength endurance", "15 min", "3 rounds: complete your selected reps for all five exercises. Use up to 5 min per round and rest only with the time left after finishing."], ["Finisher", "3 min", "6 rounds: your cardio-burst option for 20 sec, then rest for 10 sec."]],
  [["Set 1 · Challenge AMRAP", "15 min", "Repeat all five exercises using your selected level. Keep a steady pace and record how many full rounds you complete."], ["Reset", "2 min", "Walk, breathe, drink water and prepare for the ladder."], ["Set 2 · Ladder", "15 min", "Start with 2 reps of each strength exercise, then 4, 6, 8 and continue adding 2. Do shuttle/skipping for 30 sec after every completed round."], ["Best-effort finisher", "3 min", "3 rounds: shuttle or skipping for 45 sec, then rest for 15 sec. Stay controlled to the finish."]],
];
function MainApp({ onLogout, memberName }) {
  const [tab, setTab] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({ name: memberName || "", calorieGoal: 1800, proteinGoal: 130, carbGoal: 180, fatGoal: 55, exerciseCredit: 50, onboardingComplete: false });
  const [weightLogs, setWeightLogs] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [openArticle, setOpenArticle] = useState(null);
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [mealsError, setMealsError] = useState("");
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [checkedGroceryItems, setCheckedGroceryItems] = useState([]);
  const [likedFoods, setLikedFoods] = useState([]);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState([]);
  const [measurementLogs, setMeasurementLogs] = useState([]);
  const [dailyHabits, setDailyHabits] = useState({});
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [stepLogs, setStepLogs] = useState([]);
  const [savedMeals, setSavedMeals] = useState([]);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [saveRetry, setSaveRetry] = useState(0);
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/data", { credentials: "same-origin" });
        if (!r.ok) throw new Error("Could not load member data");
        const d = await r.json();
        if (d && Object.keys(d).length) {
          if (d.profile) setProfile({ ...d.profile, onboardingComplete: d.profile.onboardingComplete ?? true });
          if (d.weightLogs) setWeightLogs(d.weightLogs);
          if (d.foodLogs) setFoodLogs(d.foodLogs);
          if (d.favoriteMeals) setFavoriteMeals(d.favoriteMeals);
          if (d.checkedGroceryItems) setCheckedGroceryItems(d.checkedGroceryItems);
          if (d.likedFoods) setLikedFoods(d.likedFoods);
          if (d.weeklyCheckIns) setWeeklyCheckIns(d.weeklyCheckIns);
          if (d.measurementLogs) setMeasurementLogs(d.measurementLogs);
          if (d.dailyHabits) setDailyHabits(d.dailyHabits);
          if (d.progressPhotos) setProgressPhotos(d.progressPhotos);
          if (d.exerciseLogs) setExerciseLogs(d.exerciseLogs);
          if (d.stepLogs) setStepLogs(d.stepLogs);
          if (d.savedMeals) setSavedMeals(d.savedMeals);
        } else if (memberName) {
          setProfile((current) => ({ ...current, name: memberName }));
        }
      } catch (e) {
        // no saved data yet
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch("/api/data", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: { profile, weightLogs, foodLogs, favoriteMeals, checkedGroceryItems, likedFoods, weeklyCheckIns, measurementLogs, dailyHabits, progressPhotos, exerciseLogs, stepLogs, savedMeals } }) });
          if (!response.ok) throw new Error("Save failed");
          setSaveStatus("saved"); return;
        } catch (e) {
          if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
        }
      }
      setSaveStatus("error");
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [profile, weightLogs, foodLogs, favoriteMeals, checkedGroceryItems, likedFoods, weeklyCheckIns, measurementLogs, dailyHabits, progressPhotos, exerciseLogs, stepLogs, savedMeals, loaded, saveRetry]);

  const todayLogs = useMemo(() => foodLogs.filter((f) => f.date === todayStr()), [foodLogs]);
  const totals = useMemo(
    () =>
      todayLogs.reduce(
        (acc, f) => ({
          cal: acc.cal + f.cal,
          protein: acc.protein + f.protein,
          carb: acc.carb + f.carb,
          fat: acc.fat + f.fat,
        }),
        { cal: 0, protein: 0, carb: 0, fat: 0 }
      ),
    [todayLogs]
  );
  const todayExercise = useMemo(() => exerciseLogs.filter((item) => item.date === todayStr()), [exerciseLogs]);
  const todaySteps = stepLogs.find((item) => item.date === todayStr()) || null;
  const exerciseCalories = useMemo(() => todayExercise.reduce((sum, item) => sum + (Number(item.calories) || 0), 0), [todayExercise]);
  const creditedExerciseCalories = Math.round(exerciseCalories * ((profile.exerciseCredit ?? 50) / 100));

  const sortedWeights = useMemo(() => [...weightLogs].sort((a, b) => a.date.localeCompare(b.date)), [weightLogs]);
  const latestWeight = sortedWeights[sortedWeights.length - 1];
  const chartData = sortedWeights.map((w) => ({ date: w.date.slice(5), weight: w.weight, bodyFat: w.bodyFat || null }));

  function addFood(entry) {
    setFoodLogs((prev) => [...prev, { id: uid(), date: todayStr(), ...entry }]);
    setShowFoodModal(false);
  }
  function removeFood(id) {
    setFoodLogs((prev) => prev.filter((f) => f.id !== id));
  }
  function addExercise(entry) {
    setExerciseLogs((prev) => [...prev, { id: uid(), date: todayStr(), ...entry }]);
  }
  function removeExercise(id) {
    setExerciseLogs((prev) => prev.filter((item) => item.id !== id));
  }
  function saveSteps(steps, goal) {
    const entry = { id: uid(), date: todayStr(), steps: Math.max(0, Number(steps) || 0), goal: Math.max(1000, Number(goal) || 8000) };
    setStepLogs((prev) => [...prev.filter((item) => item.date !== entry.date), entry]);
    setDailyHabits((prev) => ({ ...prev, [entry.date]: { ...(prev[entry.date] || {}), steps: entry.steps >= entry.goal } }));
  }
  function saveMeal(entry) {
    setSavedMeals((prev) => [{ id: uid(), ...entry }, ...prev.filter((item) => item.name.toLowerCase() !== entry.name.toLowerCase())].slice(0, 20));
  }
  function addWeight(entry) {
    setWeightLogs((prev) => [...prev, { id: uid(), date: todayStr(), ...entry }]);
    setShowWeightModal(false);
  }
  async function callAI(prompt, maxTokens, jsonMode) {
    // Try the app's own backend first (works once deployed with /api/ai.js + an
    // ANTHROPIC_API_KEY set in Vercel).
    let backendReachable = true;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, maxTokens, jsonMode }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        // non-JSON response (e.g. a 404 HTML page) — endpoint likely doesn't exist at this path
      }
      if (res.ok && data && data.text) return data.text;
      // The route exists and responded, but something's misconfigured server-side
      // (e.g. missing ANTHROPIC_API_KEY) — surface that exact reason instead of
      // silently falling through to a call that will fail anyway on a real domain.
      throw new Error(data?.error || `/api/ai responded with status ${res.status}`);
    } catch (e) {
      if (e instanceof TypeError) {
        // A genuine network-level failure to reach /api/ai at all — this is the
        // situation inside Claude's own preview, where there's no /api backend.
        backendReachable = false;
      } else {
        throw e;
      }
    }
    if (!backendReachable) {
      const res2 = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: maxTokens || 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data2 = await res2.json();
      return (data2.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    }
  }

  async function getAiInsight() {
    setAiLoading(true);
    setAiText("");
    const overCal = totals.cal - creditedExerciseCalories - profile.calorieGoal;
    const overCarb = totals.carb - profile.carbGoal;
    const trend =
      sortedWeights.length >= 2
        ? `Weight trend: started at ${sortedWeights[0].weight}kg, now ${latestWeight.weight}kg over ${sortedWeights.length} entries.`
        : "Not enough weight entries yet for a trend.";
    const prompt = `You are a supportive, knowledgeable fitness coach at New You Fitness, a gym whose tone is warm and non-intimidating (brand line: "YOU vs YOU"). Give the member a complete, short, specific and encouraging insight in exactly 3 concise sentences, with no headers or bullet points, based on today's nutrition data below. Finish every sentence fully. If they are over their calorie or carb goal, gently flag it and give one practical, non-judgmental suggestion for tomorrow. If they are on track, affirm it briefly and offer one useful tip. Never mention that you are an AI model.

Calorie goal: ${profile.calorieGoal} kcal. Consumed today: ${totals.cal} kcal (${overCal > 0 ? `${overCal} over` : `${Math.abs(overCal)} under`}).
Exercise logged today: ${exerciseCalories} kcal. Coach-approved calorie credit: ${creditedExerciseCalories} kcal (${profile.exerciseCredit ?? 50}%). Net calories after the approved credit: ${Math.max(0, totals.cal - creditedExerciseCalories)} kcal. Treat exercise-calorie estimates as approximate.
Protein goal: ${profile.proteinGoal}g. Consumed: ${totals.protein}g.
Carb goal: ${profile.carbGoal}g. Consumed: ${totals.carb}g (${overCarb > 0 ? `${overCarb}g over` : `${Math.abs(overCarb)}g under`}).
Fat goal: ${profile.fatGoal}g. Consumed: ${totals.fat}g.
${trend}`;

    try {
      // Gemini thinking models can use part of the output allowance internally,
      // so leave enough room to ensure the visible answer finishes cleanly.
      const text = await callAI(prompt, 4096);
      setAiText(text || "Couldn't generate an insight right now — try again in a moment.");
    } catch (e) {
      setAiText(`Couldn't reach the coach right now. (Details: ${e.message})`);
    }
    setAiLoading(false);
  }

  async function getMealSuggestions() {
    setMealsLoading(true);
    setMealsError("");
    const instantMeals = [
      { mealType: "Breakfast", name: "Protein yoghurt bowl", description: "Creamy yoghurt, whey and berries for an easy high-protein start.", cal: 300, protein: 31, carb: 30, fat: 5, ingredients: ["250g fat-free plain yoghurt", "25g whey protein", "100g blueberries", "10g peanut butter"] },
      { mealType: "Snack", name: "Biltong and fruit", description: "A quick protein-rich snack with fresh fruit.", cal: 190, protein: 22, carb: 19, fat: 3, ingredients: ["50g lean biltong", "1 small apple"] },
      { mealType: "Lunch", name: "Chicken salad bowl", description: "Lean chicken with a large colourful salad and avocado.", cal: 370, protein: 39, carb: 25, fat: 13, ingredients: ["130g cooked chicken breast", "2 cups mixed salad", "100g tomato and cucumber", "50g avocado"] },
      { mealType: "Snack", name: "Cottage cheese crunch", description: "Cottage cheese with cucumber for a filling afternoon snack.", cal: 130, protein: 16, carb: 8, fat: 3, ingredients: ["150g low-fat cottage cheese", "100g cucumber", "Black pepper"] },
      { mealType: "Dinner", name: "Lean mince veggie plate", description: "Lean mince, vegetables and potato make a balanced comforting dinner.", cal: 400, protein: 34, carb: 40, fat: 12, ingredients: ["130g cooked lean mince", "200g mixed vegetables", "150g baby potatoes", "1 tsp olive oil"] },
      { mealType: "Extra", name: "Sugar-free jelly", description: "A light sweet option when you want something after dinner.", cal: 40, protein: 2, carb: 4, fat: 0, ingredients: ["1 cup prepared sugar-free jelly"] },
    ];
    // Give the member useful choices instantly while a personalised set is prepared.
    setMealSuggestions(instantMeals);
    const likedLine = likedFoods.length
      ? `\n\nThis member specifically enjoys these foods: ${likedFoods.join(", ")}. Build the meals around these foods wherever realistically possible — the whole point is that meals they actually like are easier to stick to. Only bring in other foods where needed for balance or to hit the targets sensibly.`
      : "";
    const prompt = `You are a nutrition-savvy meal planner for New You Fitness, a gym whose tone is warm and non-intimidating (brand line: "YOU vs YOU"). A member has these daily targets: ${profile.calorieGoal} kcal, ${profile.proteinGoal}g protein, ${profile.carbGoal}g carbs, ${profile.fatGoal}g fat.

Suggest 6 simple, realistic meals/snacks (mix of breakfast, lunch, dinner, snack) that fit sensibly within these daily targets when combined (a full day should roughly add up to the goals, not each meal individually). Use everyday ingredients available in South African supermarkets. Keep descriptions practical, no fancy techniques. Keep the "description" field to one short sentence (under 15 words) and each ingredient string brief — this needs to stay compact.${likedLine}

Respond ONLY with a JSON array, no markdown fences, no preamble, in this exact shape:
[{"mealType":"Breakfast","name":"Berry Protein Oats","description":"Warm oats with yoghurt and berries.","cal":340,"protein":26,"carb":46,"fat":6,"ingredients":["40g oats","150g plain yoghurt","100g blueberries"]}]

Use ordinary whole numbers without leading zeroes for every nutrition value. The "ingredients" array should list each ingredient with a practical shopping quantity (grams, ml, cups, or count) — 3 to 6 items per meal, no method or instructions, just what to buy.`;

    try {
      const parseMeals = (value) => {
        let clean = value.replace(/```json|```/g, "").trim();
        const start = clean.indexOf("[");
        const end = clean.lastIndexOf("]");
        if (start !== -1 && end !== -1 && end > start) clean = clean.slice(start, end + 1);
        return JSON.parse(clean);
      };

      const text = await callAI(prompt, 1800, true);
      let parsed;
      try {
        parsed = parseMeals(text);
      } catch {
        // Repair a rare malformed response automatically instead of exposing a
        // technical JSON error to the member.
        const repairPrompt = `Repair the JSON below. Return only one valid JSON array. Keep the same meal information, use whole numbers without leading zeroes, and do not add markdown or commentary.\n\n${text}`;
        parsed = parseMeals(await callAI(repairPrompt, 1200, true));
      }
      if (Array.isArray(parsed)) {
        setMealSuggestions(parsed);
      } else {
        setMealsError("Couldn't read the suggestions — try again.");
      }
    } catch {
      // Keep the instant, coach-approved meal set on screen if AI is slow or unavailable.
      setMealsError("Instant suggestions shown. Personalised suggestions are temporarily taking longer than expected.");
    }
    setMealsLoading(false);
  }

  function toggleFavoriteMeal(meal) {
    setFavoriteMeals((prev) => {
      const exists = prev.some((m) => m.name === meal.name);
      if (exists) return prev.filter((m) => m.name !== meal.name);
      return [...prev, meal];
    });
  }
  function removeFavoriteMeal(name) {
    setFavoriteMeals((prev) => prev.filter((m) => m.name !== name));
  }
  function toggleGroceryItem(item) {
    setCheckedGroceryItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  }
  function clearGroceryChecks() {
    setCheckedGroceryItems([]);
  }
  function toggleLikedFood(item) {
    setLikedFoods((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  }

  function addWeeklyCheckIn(entry) {
    setWeeklyCheckIns((prev) => [{ id: uid(), date: todayStr(), ...entry }, ...prev]);
  }
  function addMeasurements(entry) {
    setMeasurementLogs((prev) => [{ id: uid(), date: todayStr(), ...entry }, ...prev]);
  }
  function toggleHabit(key) {
    const date = todayStr();
    setDailyHabits((prev) => ({ ...prev, [date]: { ...(prev[date] || {}), [key]: !prev[date]?.[key] } }));
  }
  function addProgressPhoto(photo) {
    setProgressPhotos((prev) => [{ id: uid(), date: todayStr(), ...photo }, ...prev].slice(0, 6));
  }
  function removeProgressPhoto(id) {
    setProgressPhotos((prev) => prev.filter((item) => item.id !== id));
  }
  function exportProgress() {
    const rows = [["Type","Date","Name / field","Value","Protein","Carbs","Fat"]];
    weightLogs.forEach((item) => rows.push(["Weight", item.date, "Weight kg", item.weight, "", "", item.bodyFat ? `Body fat ${item.bodyFat}%` : ""]));
    foodLogs.forEach((item) => rows.push(["Food", item.date, item.name, item.cal, item.protein, item.carb, item.fat]));
    exerciseLogs.forEach((item) => rows.push(["Exercise", item.date, item.activity, item.calories, "", "", ""]));
    stepLogs.forEach((item) => rows.push(["Steps", item.date, "Daily steps", item.steps, "", "", `Goal ${item.goal}`]));
    measurementLogs.forEach((item) => Object.entries(item).filter(([key]) => !["id","date"].includes(key)).forEach(([key,value]) => value && rows.push(["Measurement", item.date, `${key} cm`, value, "", "", ""])));
    weeklyCheckIns.forEach((item) => rows.push(["Weekly check-in", item.date, "Energy/Hunger/Sleep/Training", `${item.energy}/${item.hunger}/${item.sleep}/${item.training}`, "", "", item.win || item.struggle || ""]));
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = `new-you-progress-${todayStr()}.csv`; link.click(); URL.revokeObjectURL(url);
  }
  async function deleteProgressData() {
    const response = await fetch("/api/delete-data", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: "DELETE" }) });
    if (!response.ok) { const result = await response.json(); throw new Error(result.error || "Could not delete data"); }
    await onLogout();
  }

  if (!loaded) {
    return (
      <div className="nyf">
        <style>{STYLE}</style>
        <div className="nyf-empty">Loading your dashboard…</div>
      </div>
    );
  }

  if (!profile.onboardingComplete) {
    return <Onboarding profile={profile} onComplete={setProfile} onLogout={onLogout} />;
  }

  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-header">
        <div className="nyf-greeting">{tab === "home" ? "Today" : tab === "workout" ? "Workout of the day" : tab === "track" ? "Track" : tab === "meals" ? "Meal suggestions" : tab === "learn" ? "Learn" : "Goals"}</div>
        {tab === "home" && <div className="nyf-sub">{new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}</div>}
        <div className={`nyf-save-state${saveStatus === "error" ? " error" : ""}`}>{saveStatus === "saving" ? "Saving changes…" : saveStatus === "error" ? <span>Could not save · <button onClick={() => setSaveRetry((value) => value + 1)} style={{ color: "inherit", background: "none", border: 0, padding: 0, textDecoration: "underline", font: "inherit" }}>Retry</button></span> : "✓ Changes saved"}</div>
      </div>

      <div className="nyf-scroll">
        {tab === "home" && (
          <HomeTab
            profile={profile}
            totals={totals}
            latestWeight={latestWeight}
            aiText={aiText}
            aiLoading={aiLoading}
            getAiInsight={getAiInsight}
            setTab={setTab}
            weeklyCheckIns={weeklyCheckIns}
            addWeeklyCheckIn={addWeeklyCheckIn}
            foodLogs={foodLogs}
            weightLogs={weightLogs}
            todayExercise={todayExercise}
            exerciseCalories={exerciseCalories}
            creditedExerciseCalories={creditedExerciseCalories}
            addExercise={addExercise}
            removeExercise={removeExercise}
            exerciseLogs={exerciseLogs}
            dailyHabits={dailyHabits}
            todaySteps={todaySteps}
            saveSteps={saveSteps}
          />
        )}
        {tab === "track" && (
          <TrackTab
            profile={profile}
            totals={totals}
            todayLogs={todayLogs}
            removeFood={removeFood}
            chartData={chartData}
            latestWeight={latestWeight}
            setShowFoodModal={setShowFoodModal}
            setShowWeightModal={setShowWeightModal}
            measurementLogs={measurementLogs}
            addMeasurements={addMeasurements}
            todayHabits={dailyHabits[todayStr()] || {}}
            dailyHabits={dailyHabits}
            toggleHabit={toggleHabit}
            repeatFood={addFood}
            progressPhotos={progressPhotos}
            addProgressPhoto={addProgressPhoto}
            removeProgressPhoto={removeProgressPhoto}
            todaySteps={todaySteps}
            saveSteps={saveSteps}
          />
        )}
        {tab === "workout" && <WorkoutTab setTab={setTab} />}
        {tab === "learn" && <LearnTab openArticle={openArticle} setOpenArticle={setOpenArticle} />}
        {tab === "meals" && (
          <MealsTab
            profile={profile}
            totals={totals}
            creditedExerciseCalories={creditedExerciseCalories}
            suggestions={mealSuggestions}
            loading={mealsLoading}
            error={mealsError}
            getMealSuggestions={getMealSuggestions}
            setTab={setTab}
            favoriteMeals={favoriteMeals}
            toggleFavoriteMeal={toggleFavoriteMeal}
            removeFavoriteMeal={removeFavoriteMeal}
            checkedGroceryItems={checkedGroceryItems}
            toggleGroceryItem={toggleGroceryItem}
            clearGroceryChecks={clearGroceryChecks}
            likedFoods={likedFoods}
            toggleLikedFood={toggleLikedFood}
          />
        )}
        {tab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} setTab={setTab} onLogout={onLogout} onExport={exportProgress} onDeleteData={deleteProgressData} />}
      </div>

      <FooterLogo />
      <div className="nyf-nav">
        <NavBtn icon={<Dumbbell size={19} />} label="Today" active={tab === "home"} onClick={() => setTab("home")} />
        <NavBtn icon={<Flame size={19} />} label="Workout" active={tab === "workout"} onClick={() => setTab("workout")} />
        <NavBtn icon={<UtensilsCrossed size={19} />} label="Track" active={tab === "track"} onClick={() => setTab("track")} />
        <NavBtn icon={<ChefHat size={19} />} label="Meals" active={tab === "meals"} onClick={() => setTab("meals")} />
        <NavBtn icon={<BookOpen size={19} />} label="Learn" active={tab === "learn"} onClick={() => setTab("learn")} />
        <NavBtn icon={<User size={19} />} label="Goals" active={tab === "profile"} onClick={() => setTab("profile")} />
      </div>

      {showFoodModal && <FoodModal onAdd={addFood} onClose={() => setShowFoodModal(false)} recentFoods={foodLogs} savedMeals={savedMeals} onSaveMeal={saveMeal} />}
      {showWeightModal && <WeightModal onAdd={addWeight} onClose={() => setShowWeightModal(false)} />}
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button className={`nyf-navbtn${active ? " active" : ""}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function WorkoutTab({ setTab }) {
  const [level, setLevel] = useState(1);
  const [venue, setVenue] = useState("home");
  const [open, setOpen] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const workout = (venue === "gym" ? GYM_WORKOUTS : WORKOUTS)[selectedDay];
  const gymPlan = [
    ["Set 1 · Strength & skill", "15 min", `3 rounds: ${workout.exercises.map((item) => item[0]).join(", ")}. Work for 45 sec and use 15 sec to change equipment after every exercise.`],
    ["Reset", "2 min", "Walk slowly, breathe, drink water and safely prepare the equipment for the next set."],
    ["Set 2 · Functional circuit", "15 min", `5 rounds: ${workout.exercises.map((item) => item[0]).join(", ")} for 30 sec each, then rest for 30 sec.`],
    ["Finisher", "3 min", `6 rounds: ${workout.exercises[workout.exercises.length - 1]?.[0] || "cardio exercise"} for 20 sec, then rest for 10 sec.`],
  ];
  const workoutPlan = venue === "gym" ? gymPlan : WORKOUT_PLANS[selectedDay];
  const homeWarmup = [
    ["Set 1 · Raise your temperature", "4 min", "2 rounds: march, walk or light skip for 60 sec; step jacks for 30 sec; arm circles and shoulder rolls for 30 sec."],
    ["Set 2 · Mobilise", "4 min", "2 rounds: reverse lunges for 30 sec; bodyweight squats for 30 sec; hip hinges for 30 sec; torso rotations and reaches for 30 sec."],
    ["Set 3 · Movement rehearsal", "2 min", "Practise today's main exercises slowly for 30 sec each. Use no weight or a very light weight and focus on technique."],
  ];
  const gymWarmup = [
    ["Set 1 · Cardio machine", "4 min", "Use the treadmill, bike, rower or cross-trainer: 2 min easy, then 4 rounds of 20 sec quicker and 10 sec easy."],
    ["Set 2 · Mobilise", "4 min", "2 rounds: reverse lunges for 30 sec; bodyweight squats for 30 sec; hip hinges for 30 sec; arm circles and torso rotations for 30 sec."],
    ["Set 3 · Equipment rehearsal", "2 min", "Practise today's first two lifts for 60 sec each with an empty bar, the lightest cable setting or very light dumbbells."],
  ];
  const warmup = venue === "gym" ? gymWarmup : homeWarmup;
  return <>
    <div className="nyf-card nyf-workout-hero"><div className="nyf-step">{workout.day} · {venue === "gym" ? "Gym workout" : "New You at home"}</div><h2 style={{ fontSize: 27 }}>{workout.title}</h2><p style={{ color: "#D5E5F2", fontSize: 12.5, lineHeight: 1.5, marginBottom: 0 }}>{workout.focus}</p><span className="nyf-workout-time">45 minutes · Warm-up 10 + Workout 35</span></div>
    <div className="nyf-card"><label className="nyf-field-label">Where are you training?</label><div className="nyf-tabswitch" style={{ marginBottom: 14 }}><button className={venue === "home" ? "active" : ""} onClick={() => { setVenue("home"); setOpen(null); }}>At home</button><button className={venue === "gym" ? "active" : ""} onClick={() => { setVenue("gym"); setOpen(null); }}>At the gym</button></div>{venue === "gym" && <div className="nyf-product-card" style={{ marginBottom: 12 }}><strong>Gym equipment:</strong> This version uses barbells, dumbbells, benches, cables and cardio machines. Where equipment is busy or unavailable, use the Level 1 alternative.</div>}<label className="nyf-field-label">Choose another training day</label><select className="nyf-select" value={selectedDay} onChange={(e) => { setSelectedDay(Number(e.target.value)); setOpen(null); }}>{(venue === "gym" ? GYM_WORKOUTS : WORKOUTS).map((item,index) => <option key={item.day} value={index}>{item.day} · {item.title}</option>)}</select><div className="nyf-section-title">Choose your level</div><div className="nyf-levels"><button className={level === 1 ? "active" : ""} onClick={() => setLevel(1)}>Level 1<br />Beginner</button><button className={level === 2 ? "active" : ""} onClick={() => setLevel(2)}>Level 2<br />Intermediate</button><button className={level === 3 ? "active" : ""} onClick={() => setLevel(3)}>Level 3<br />Experienced</button></div><p style={{ fontSize: 11.5, color: "var(--ink-soft)", marginBottom: 0 }}>Choose the level that lets you move safely with good form. You may use different levels for different exercises.</p></div>
    <div className="nyf-card gold"><div className="nyf-section-title">10-minute warm-up · follow these sets</div>{warmup.map((item,index) => <div className="nyf-log-item" key={item[0]}><strong style={{ color: "var(--gold)", marginRight: 10 }}>{index + 1}</strong><div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><strong>{item[0]}</strong><strong>{item[1]}</strong></div><div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 4 }}>{item[2]}</div></div></div>)}</div>
    <div className="nyf-card"><div className="nyf-section-title">35-minute workout · timed plan</div><div className="nyf-product-card" style={{ marginBottom: 12 }}><strong>Follow each set in order.</strong> The work, transition and rest periods below add up to exactly 35 minutes.</div>{workoutPlan.map((block,index) => <div className="nyf-log-item" key={block[0]}><strong style={{ color: "var(--blue)", marginRight: 10 }}>{index + 1}</strong><div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><strong>{block[0]}</strong><strong style={{ whiteSpace: "nowrap" }}>{block[1]}</strong></div><div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 4 }}>{block[2]}</div></div></div>)}<div className="nyf-section-title" style={{ marginTop: 16 }}>Exercise demonstrations</div><p style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Tap an exercise to learn the technique and view all three levels.</p>{workout.exercises.map((exercise,index) => <div className="nyf-exercise-card" key={exercise[0]}><button className="nyf-exercise-head" onClick={() => setOpen(open === index ? null : index)} style={{ width: "100%", border: 0, background: "none", padding: 0, textAlign: "left", color: "inherit", cursor: "pointer" }}><div><strong>{exercise[0]}</strong><div className="nyf-exercise-level">Level {level}: {exercise[level + 1]}</div></div><ChevronDown size={16} style={{ transform: open === index ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} /></button>{open === index && <div className="nyf-exercise-how"><strong>How to do it:</strong> {exercise[1]}<div style={{ marginTop: 7 }}><strong>All options:</strong><br />Level 1 — {exercise[2]}<br />Level 2 — {exercise[3]}<br />Level 3 — {exercise[4]}</div></div>}</div>)}</div>
    <div className="nyf-card clay"><div className="nyf-section-title">Train safely</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>{venue === "gym" ? "Use safety clips, check machine settings and ask gym staff for a spotter when needed. Never attempt a heavy barbell movement you have not been taught." : "Clear a safe space and use stable equipment."} Stop for sharp pain, chest pain, faintness or unusual shortness of breath. If you have an injury, recent surgery, pregnancy or a medical condition, use guidance from your coach or healthcare professional.</p><button className="nyf-btn gold full" onClick={() => setTab("home")}>Finished · log my exercise</button></div>
  </>;
}

function FooterLogo() {
  return (
    <div className="nyf-logo-strip">
      <img src="/new-you-logo.png" alt="New You Transformation Studio" />
    </div>
  );
}

function Bar({ label, value, goal, unit }) {
  const pct = Math.min(100, (value / goal) * 100 || 0);
  const over = value > goal;
  return (
    <div className="nyf-bar-row">
      <div className="nyf-bar-label">
        <span>{label}</span>
        <span>
          {value}
          {unit} / {goal}
          {unit}
        </span>
      </div>
      <div className="nyf-bar-track">
        <div className={`nyf-bar-fill${over ? " over" : ""}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Onboarding({ profile, onComplete, onLogout }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: profile.name || "", sex: "female", age: "", height: "", weight: "", goalWeight: "", activity: "1.375", consent: false });
  const ready = form.age && form.height && form.weight && form.goalWeight && form.consent;
  function finish() {
    const weight = Number(form.weight);
    const bmr = 10 * weight + 6.25 * Number(form.height) - 5 * Number(form.age) + (form.sex === "male" ? 5 : -161);
    const maintenance = Math.round(bmr * Number(form.activity));
    const calorieGoal = Math.max(1200, Math.round((maintenance - 400) / 10) * 10);
    const proteinGoal = Math.round(weight * 1.8);
    const fatGoal = Math.round(weight * 0.7);
    const carbGoal = Math.max(50, Math.round((calorieGoal - proteinGoal * 4 - fatGoal * 9) / 4));
    const { consent, ...details } = form;
    onComplete({ ...profile, ...details, age: Number(form.age), height: Number(form.height), weight, goalWeight: Number(form.goalWeight), maintenance, calorieGoal, proteinGoal, carbGoal, fatGoal, privacyConsentAt: new Date().toISOString(), onboardingComplete: true });
  }
  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-header"><div className="nyf-step">Step {step} of 2</div><div className="nyf-greeting">Let's personalise your plan</div><div className="nyf-sub">A few details help us calculate a sensible starting point.</div></div>
      <div className="nyf-scroll">
        {step === 1 ? (
          <div className="nyf-card gold">
            <div className="nyf-section-title"><User size={17} /> About you</div>
            <label className="nyf-field-label">Name</label><input className="nyf-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="nyf-field-label">Sex used for the calorie equation</label><select className="nyf-select" value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}><option value="female">Woman</option><option value="male">Man</option></select>
            <div className="nyf-grid2"><div><label className="nyf-field-label">Age</label><input className="nyf-input" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div><div><label className="nyf-field-label">Height (cm)</label><input className="nyf-input" type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></div></div>
            <button className="nyf-btn full" onClick={() => setStep(2)} disabled={!form.age || !form.height}>Continue</button>
          </div>
        ) : (
          <div className="nyf-card gold">
            <div className="nyf-section-title"><Calculator size={17} /> Your starting point</div>
            <div className="nyf-grid2"><div><label className="nyf-field-label">Current weight (kg)</label><input className="nyf-input" type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div><div><label className="nyf-field-label">Goal weight (kg)</label><input className="nyf-input" type="number" step="0.1" value={form.goalWeight} onChange={(e) => setForm({ ...form, goalWeight: e.target.value })} /></div></div>
            <label className="nyf-field-label">Daily activity</label><select className="nyf-select" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })}><option value="1.2">Mostly seated</option><option value="1.375">Lightly active</option><option value="1.55">Active / trains 3–5 days</option><option value="1.725">Very active</option></select>
            <p className="nyf-range-note">We’ll calculate maintenance calories, a moderate fat-loss target and your daily macros. You can edit them later under Goals.</p>
            <label className="nyf-consent"><input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} /><span>I consent to New You storing my nutrition, exercise, body measurements and optional progress photos so my coach can support me. I understand that this app provides general guidance and not medical treatment.</span></label>
            <button className="nyf-btn gold full" onClick={finish} disabled={!ready}><Sparkles size={15} /> Create my plan</button>
            <button className="nyf-link-btn" onClick={() => setStep(1)}>Back</button>
          </div>
        )}
        <button className="nyf-link-btn" onClick={onLogout}>Sign out</button>
      </div>
      <FooterLogo />
    </div>
  );
}

function WeeklyCheckIn({ entries, onAdd, profile, foodLogs, weightLogs }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ energy: 3, hunger: 3, sleep: 3, training: 3, win: "", struggle: "" });
  const latest = entries[0];
  function save(shareToWhatsApp = false) {
    onAdd(form);
    setOpen(false);
    if (!shareToWhatsApp) return;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 6); cutoff.setHours(0, 0, 0, 0);
    const recent = foodLogs.filter((item) => new Date(`${item.date}T00:00:00`) >= cutoff);
    const byDay = recent.reduce((days, item) => { const day = days[item.date] || { cal: 0, protein: 0, carb: 0, fat: 0, meals: [] }; day.cal += Number(item.cal) || 0; day.protein += Number(item.protein) || 0; day.carb += Number(item.carb) || 0; day.fat += Number(item.fat) || 0; if (day.meals.length < 5) day.meals.push(item.name); days[item.date] = day; return days; }, {});
    const sortedWeights = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
    const first = sortedWeights[0]?.weight; const latest = sortedWeights[sortedWeights.length - 1]?.weight;
    const change = first && latest ? `${latest - first > 0 ? "+" : ""}${(latest - first).toFixed(1)} kg` : "Not enough entries";
    const diary = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, day]) => `${date}: ${Math.round(day.cal)} kcal | P${Math.round(day.protein)} C${Math.round(day.carb)} F${Math.round(day.fat)} | ${day.meals.join(", ")}`).join("\n") || "No food logged in the past 7 days.";
    const message = `NEW YOU WEEKLY CHECK-IN\nMember: ${profile.name || "Member"}\nDate: ${todayStr()}\n\nEnergy: ${form.energy}/5\nHunger: ${form.hunger}/5\nSleep: ${form.sleep}/5\nTraining: ${form.training}/5\nWin: ${form.win || "—"}\nSupport needed: ${form.struggle || "—"}\n\nWEIGHT PROGRESS\nLatest: ${latest ? `${latest} kg` : "Not logged"}\nOverall change: ${change}\n\nLAST 7 DAYS FOOD DIARY\n${diary}`;
    window.open(`https://wa.me/27731800485?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }
  return (
    <div className="nyf-card gold">
      <div className="nyf-section-title"><Check size={17} /> Weekly check-in</div>
      {!open ? <><p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 11 }}>{latest ? `Last completed ${latest.date}. Keep your coach up to date.` : "Tell your coach how the week has really felt."}</p><button className="nyf-btn gold full" onClick={() => setOpen(true)}>{latest ? "Complete a new check-in" : "Start check-in"}</button></> : <>
        {[['energy','Energy'],['hunger','Hunger'],['sleep','Sleep'],['training','Training']].map(([key,label]) => <div key={key}><label className="nyf-field-label">{label}: {form[key]}/5</label><div className="nyf-score-row">{[1,2,3,4,5].map((n) => <button key={n} className={`nyf-score${form[key] === n ? " active" : ""}`} onClick={() => setForm({ ...form, [key]: n })}>{n}</button>)}</div></div>)}
        <label className="nyf-field-label">Your win this week</label><input className="nyf-input" value={form.win} onChange={(e) => setForm({ ...form, win: e.target.value })} placeholder="What went well?" />
        <label className="nyf-field-label">Where you need support</label><textarea className="nyf-input" rows="3" value={form.struggle} onChange={(e) => setForm({ ...form, struggle: e.target.value })} placeholder="Anything your coach should know?" />
        <button className="nyf-btn gold full" onClick={() => save(true)}>Save &amp; WhatsApp Coach Martin</button>
        <button className="nyf-btn ghost full" style={{ marginTop: 8 }} onClick={() => save(false)}>Save in app only</button>
      </>}
    </div>
  );
}

function CoachMessagesCard({ memberName }) {
  const [text, setText] = useState("");
  function send() {
    const clean = text.trim();
    const message = clean ? `NEW YOU MEMBER MESSAGE\nFrom: ${memberName || "Member"}\nDate: ${todayStr()}\n\n${clean}` : `Hi Coach Martin, this is ${memberName || "a New You member"}.`;
    window.location.href = `https://wa.me/27731800485?text=${encodeURIComponent(message)}`;
  }
  return <div className="nyf-card"><div className="nyf-section-title"><User size={17} /> Contact your coach</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Open WhatsApp to contact Coach Martin. Adding a message below is optional.</p><textarea className="nyf-input" rows="2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Optional message…" /><button className="nyf-btn gold full" onClick={send}>Open WhatsApp with Coach Martin</button></div>;
}

function ProgressPhotosCard({ photos, onAdd, onRemove }) {
  const [busy, setBusy] = useState(false);
  async function choose(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true);
    const image = new Image(); const source = URL.createObjectURL(file);
    image.onload = () => { const max = 520; const scale = Math.min(1, max / Math.max(image.width, image.height)); const canvas = document.createElement("canvas"); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height); onAdd({ image: canvas.toDataURL("image/jpeg", .68) }); URL.revokeObjectURL(source); setBusy(false); event.target.value = ""; };
    image.onerror = () => { URL.revokeObjectURL(source); setBusy(false); };
    image.src = source;
  }
  return <div className="nyf-card gold"><div className="nyf-section-title"><Camera size={17} /> Private progress photos</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 8 }}>Add consistent front, side or back photos. Only you and signed-in New You staff can see them.</p>{photos.length > 0 && <div className="nyf-photo-grid">{photos.map((photo) => <div className="nyf-photo" key={photo.id}><img src={photo.image} alt={`Progress ${photo.date}`} /><button onClick={() => onRemove(photo.id)} aria-label="Delete photo"><X size={13} /></button></div>)}</div>}<label className="nyf-btn ghost full" style={{ cursor: "pointer" }}><Camera size={15} /> {busy ? "Preparing photo…" : photos.length >= 6 ? "Replace a photo to add another" : "Add progress photo"}<input type="file" accept="image/*" capture="environment" onChange={choose} disabled={busy || photos.length >= 6} style={{ display: "none" }} /></label><p style={{ fontSize: 10.5, color: "var(--ink-soft)", marginTop: 8 }}>Up to 6 compressed photos are kept to protect app speed and storage.</p></div>;
}

function ExerciseCard({ entries, calories, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ activity: "New You class", calories: "" });
  function save() { if (!form.calories) return; onAdd({ activity: form.activity || "Exercise", calories: Number(form.calories) }); setForm({ activity: "New You class", calories: "" }); setOpen(false); }
  return <div className="nyf-card gold"><div className="nyf-section-title"><Dumbbell size={17} /> Today's exercise</div>{entries.length ? entries.map((item) => <div className="nyf-log-item" key={item.id}><div><div className="nyf-log-name">{item.activity}</div><div className="nyf-log-macro">Exercise calories</div></div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><strong>{item.calories} kcal</strong><button className="nyf-close-btn" onClick={() => onRemove(item.id)}><X size={13} /></button></div></div>) : <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Did you train or complete another activity today?</p>}{!open ? <button className="nyf-btn gold full" style={{ marginTop: 10 }} onClick={() => setOpen(true)}><Plus size={15} /> Log exercise</button> : <><label className="nyf-field-label" style={{ marginTop: 10 }}>Exercise</label><select className="nyf-select" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })}><option>New You class</option><option>Strength training</option><option>Walking</option><option>Running</option><option>Cycling</option><option>Other exercise</option></select><label className="nyf-field-label">Calories burned</label><input className="nyf-input" type="number" inputMode="numeric" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="From your watch or machine" /><button className="nyf-btn full" onClick={save} disabled={!form.calories}>Add exercise</button></>}<p style={{ fontSize: 10.5, color: "var(--ink-soft)", marginTop: 9 }}>Watch and machine estimates vary, so treat this as an approximate adjustment.</p></div>;
}

function WeeklyReport({ profile, foodLogs, weightLogs, exerciseLogs, dailyHabits }) {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 6); cutoff.setHours(0,0,0,0);
  const recentFoods = foodLogs.filter((item) => new Date(`${item.date}T00:00:00`) >= cutoff);
  const foodDays = new Set(recentFoods.map((item) => item.date)).size;
  const calories = recentFoods.reduce((sum,item) => sum + (+item.cal || 0), 0);
  const protein = recentFoods.reduce((sum,item) => sum + (+item.protein || 0), 0);
  const exercise = exerciseLogs.filter((item) => new Date(`${item.date}T00:00:00`) >= cutoff).reduce((sum,item) => sum + (+item.calories || 0), 0);
  const habitDone = Object.entries(dailyHabits).filter(([date]) => new Date(`${date}T00:00:00`) >= cutoff).reduce((sum,[,day]) => sum + HABITS.filter(([key]) => day?.[key]).length, 0);
  const recentWeights = [...weightLogs].filter((item) => new Date(`${item.date}T00:00:00`) >= cutoff).sort((a,b) => a.date.localeCompare(b.date));
  const change = recentWeights.length > 1 ? (recentWeights.at(-1).weight - recentWeights[0].weight).toFixed(1) : null;
  return <div className="nyf-card"><div className="nyf-section-title"><Flame size={17} /> Your last 7 days</div><div className="nyf-progress-summary"><div className="nyf-progress-tile"><strong>{foodDays ? Math.round(calories / foodDays) : "—"}</strong><span>Avg kcal</span></div><div className="nyf-progress-tile"><strong>{foodDays ? `${Math.round(protein / foodDays)}g` : "—"}</strong><span>Avg protein</span></div><div className="nyf-progress-tile"><strong>{change !== null ? `${change > 0 ? "+" : ""}${change}kg` : "—"}</strong><span>Weight change</span></div></div><div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Exercise recorded: <strong>{Math.round(exercise)} kcal</strong> · Habits completed: <strong>{habitDone}/28</strong> · Food logged: <strong>{foodDays}/7 days</strong></div>{foodDays > 0 && <div style={{ marginTop: 9, fontSize: 11.5, color: "var(--ink-soft)" }}>Calorie target: {profile.calorieGoal} kcal · Protein target: {profile.proteinGoal}g</div>}</div>;
}

function BeginnerDailyGuide({ profile, totals, foodLogs, todayExercise, dailyHabits, setTab }) {
  const today = todayStr();
  const habits = dailyHabits[today] || {};
  const tasks = [
    { label: "Log what you eat", done: foodLogs.some((item) => item.date === today), action: () => setTab("track") },
    { label: `Reach ${profile.proteinGoal}g protein`, done: totals.protein >= profile.proteinGoal, action: () => setTab("meals") },
    { label: "Drink your water", done: Boolean(habits.water), action: () => setTab("track") },
    { label: "Complete steps or a workout", done: Boolean(habits.steps || habits.training || todayExercise.length), action: () => setTab("workout") },
  ];
  const completed = tasks.filter((task) => task.done).length;
  const badge = completed === 4 ? "Consistency champion" : completed >= 2 ? "Building momentum" : "Start with one small win";
  return <div className="nyf-card gold"><div className="nyf-section-title"><Check size={17} /> Your simple plan for today</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Do these four things. You do not need a perfect day—just keep moving forward.</p><div className="nyf-product-card"><strong>{completed}/4 complete · {badge}</strong></div>{tasks.map((task) => <button className={`nyf-habit${task.done ? " done" : ""}`} style={{ width: "100%", marginTop: 8 }} key={task.label} onClick={task.action}><span className="nyf-habit-dot">{task.done ? <Check size={14} /> : null}</span><span>{task.label}</span></button>)}</div>;
}

function StepsCard({ entry, onSave, compact = false }) {
  const [steps, setSteps] = useState(String(entry?.steps || ""));
  const [goal, setGoal] = useState(String(entry?.goal || 8000));
  useEffect(() => { setSteps(String(entry?.steps || "")); setGoal(String(entry?.goal || 8000)); }, [entry?.steps, entry?.goal]);
  const current = Number(steps) || 0;
  const target = Math.max(1000, Number(goal) || 8000);
  const percentage = Math.min(100, Math.round((current / target) * 100));
  return <div className="nyf-card"><div className="nyf-section-title"><Flame size={17} /> Steps today</div><div className="nyf-progress-summary"><div className="nyf-progress-tile"><strong>{current.toLocaleString()}</strong><span>Steps</span></div><div className="nyf-progress-tile"><strong>{target.toLocaleString()}</strong><span>Daily goal</span></div><div className="nyf-progress-tile"><strong>{percentage}%</strong><span>Complete</span></div></div><div className="nyf-grid2"><div><label className="nyf-field-label">Your steps</label><input className="nyf-input" type="number" inputMode="numeric" min="0" step="100" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="e.g. 6500" /></div><div><label className="nyf-field-label">Step goal</label><input className="nyf-input" type="number" inputMode="numeric" min="1000" step="500" value={goal} onChange={(e) => setGoal(e.target.value)} /></div></div><button className={`nyf-btn${compact ? " ghost" : ""} full`} onClick={() => onSave(current, target)} disabled={!current}>Save today's steps</button>{entry && <p style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "9px 0 0" }}>{entry.steps >= entry.goal ? "Step goal reached — well done!" : `${Math.max(0, entry.goal - entry.steps).toLocaleString()} steps remaining.`}</p>}</div>;
}

function HomeTab({ profile, totals, latestWeight, aiText, aiLoading, getAiInsight, setTab, weeklyCheckIns, addWeeklyCheckIn, foodLogs, weightLogs, todayExercise, exerciseCalories, creditedExerciseCalories, addExercise, removeExercise, exerciseLogs, dailyHabits, todaySteps, saveSteps }) {
  const netCalories = Math.max(0, totals.cal - creditedExerciseCalories);
  const remaining = profile.calorieGoal - netCalories;
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const dayNumber = Math.floor((new Date() - startOfYear) / 86400000);
  const motivation = DAILY_MOTIVATION[dayNumber % DAILY_MOTIVATION.length];
  return (
    <>
      <div className="nyf-card nyf-motivation">
        <div className="nyf-motivation-label"><Sparkles size={13} /> Today's motivation</div>
        <div className="nyf-motivation-quote">“{motivation}”</div>
      </div>
      <BeginnerDailyGuide profile={profile} totals={totals} foodLogs={foodLogs} todayExercise={todayExercise} dailyHabits={dailyHabits} setTab={setTab} />
      <div className="nyf-card">
        <div className="nyf-stat-big">{Math.max(0, remaining)} kcal</div>
        <div className="nyf-stat-label">{remaining >= 0 ? "remaining today after exercise" : `${Math.abs(remaining)} over today's adjusted goal`}</div>
        <div className="nyf-calorie-equation"><div><strong>{totals.cal}</strong><span>Food kcal</span></div><div><strong>− {creditedExerciseCalories}</strong><span>{profile.exerciseCredit ?? 50}% exercise</span></div><div><strong>{netCalories}</strong><span>Net kcal</span></div></div>
        <div style={{ height: 14 }} />
        <Bar label="Protein" value={totals.protein} goal={profile.proteinGoal} unit="g" />
        <Bar label="Carbs" value={totals.carb} goal={profile.carbGoal} unit="g" />
        <Bar label="Fat" value={totals.fat} goal={profile.fatGoal} unit="g" />
        <button className="nyf-btn full" onClick={() => setTab("track")} style={{ marginTop: 4 }}>
          <Plus size={15} /> Log food
        </button>
      </div>

      <StepsCard entry={todaySteps} onSave={saveSteps} compact />
      <ExerciseCard entries={todayExercise} calories={exerciseCalories} onAdd={addExercise} onRemove={removeExercise} />
      <WeeklyReport profile={profile} foodLogs={foodLogs} weightLogs={weightLogs} exerciseLogs={exerciseLogs} dailyHabits={dailyHabits} />

      <div className="nyf-card gold">
        <div className="nyf-section-title">
          <Sparkles size={16} color="var(--gold)" /> Coach insight
        </div>
        {aiText ? (
          <div className="nyf-ai-box">
            <p>{aiText}</p>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>
            Get a personalised read on today's nutrition, based on your goals.
          </p>
        )}
        <button className="nyf-btn gold" style={{ marginTop: 10 }} onClick={getAiInsight} disabled={aiLoading}>
          {aiLoading ? "Thinking…" : aiText ? "Refresh insight" : "Get my insight"}
        </button>
      </div>

      {latestWeight && (
        <div className="nyf-card">
          <div className="nyf-section-title">Latest check-in</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div>
              <div className="nyf-stat-big" style={{ fontSize: 22 }}>{latestWeight.weight}kg</div>
              <div className="nyf-stat-label">weight</div>
            </div>
            {latestWeight.bodyFat ? (
              <div>
                <div className="nyf-stat-big" style={{ fontSize: 22 }}>{latestWeight.bodyFat}%</div>
                <div className="nyf-stat-label">body fat</div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <WeeklyCheckIn entries={weeklyCheckIns} onAdd={addWeeklyCheckIn} profile={profile} foodLogs={foodLogs} weightLogs={weightLogs} />
      <CoachMessagesCard memberName={profile.name} />
    </>
  );
}


const HABITS = [["water", "Water target"], ["steps", "Steps target"], ["protein", "Protein target"], ["training", "Training / movement"]];

function HabitTracker({ todayHabits, dailyHabits, toggleHabit }) {
  const completeToday = HABITS.filter(([key]) => todayHabits[key]).length;
  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(); date.setDate(date.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    if (HABITS.every(([habit]) => dailyHabits[key]?.[habit])) streak += 1; else if (offset > 0 || completeToday > 0) break;
  }
  return <div className="nyf-card gold"><div className="nyf-section-title"><Check size={17} /> Daily habits</div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{completeToday}/4 completed today</span><span className="nyf-streak"><Flame size={13} /> {streak} day streak</span></div><div className="nyf-habits">{HABITS.map(([key,label]) => <button key={key} className={`nyf-habit${todayHabits[key] ? " done" : ""}`} onClick={() => toggleHabit(key)}><span className="nyf-habit-dot">{todayHabits[key] ? <Check size={14} /> : null}</span><span>{label}</span></button>)}</div></div>;
}

function MeasurementsCard({ entries, onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ waist: "", hips: "", chest: "", arm: "", thigh: "" });
  const latest = entries[0];
  function save() { onAdd(Object.fromEntries(Object.entries(form).map(([key,value]) => [key, value ? Number(value) : null]))); setOpen(false); }
  return <div className="nyf-card"><div className="nyf-section-title"><Calculator size={17} /> Body measurements</div>{latest && <div className="nyf-progress-summary"><div className="nyf-progress-tile"><strong>{latest.waist ? `${latest.waist}cm` : "—"}</strong><span>Waist</span></div><div className="nyf-progress-tile"><strong>{latest.hips ? `${latest.hips}cm` : "—"}</strong><span>Hips</span></div><div className="nyf-progress-tile"><strong>{latest.chest ? `${latest.chest}cm` : "—"}</strong><span>Chest</span></div></div>}{!open ? <button className="nyf-btn ghost full" onClick={() => setOpen(true)}><Plus size={15} /> Add measurements</button> : <><div className="nyf-grid2">{[["waist","Waist"],["hips","Hips"],["chest","Chest"],["arm","Arm"],["thigh","Thigh"]].map(([key,label]) => <div key={key}><label className="nyf-field-label">{label} (cm)</label><input className="nyf-input" type="number" step="0.1" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>)}</div><button className="nyf-btn full" onClick={save} disabled={!Object.values(form).some(Boolean)}>Save measurements</button></>}</div>;
}

function TrackTab({ profile, totals, todayLogs, removeFood, chartData, latestWeight, setShowFoodModal, setShowWeightModal, measurementLogs, addMeasurements, todayHabits, dailyHabits, toggleHabit, repeatFood, progressPhotos, addProgressPhoto, removeProgressPhoto, todaySteps, saveSteps }) {
  return (
    <>
      <HabitTracker todayHabits={todayHabits} dailyHabits={dailyHabits} toggleHabit={toggleHabit} />
      <StepsCard entry={todaySteps} onSave={saveSteps} />
      <div className="nyf-card">
        <div className="nyf-section-title">Today's totals</div>
        <Bar label="Calories" value={totals.cal} goal={profile.calorieGoal} unit=" kcal" />
        <Bar label="Protein" value={totals.protein} goal={profile.proteinGoal} unit="g" />
        <Bar label="Carbs" value={totals.carb} goal={profile.carbGoal} unit="g" />
        <Bar label="Fat" value={totals.fat} goal={profile.fatGoal} unit="g" />
        <button className="nyf-btn full" onClick={() => setShowFoodModal(true)} style={{ marginTop: 4 }}>
          <Plus size={15} /> Log a meal
        </button>
      </div>

      <div className="nyf-card">
        <div className="nyf-section-title">Meals logged today</div>
        {todayLogs.length === 0 ? (
          <div className="nyf-empty">Nothing logged yet — add your first meal above.</div>
        ) : (
          ["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType) => {
            const meals = todayLogs.filter((item) => (item.mealType || "Snack") === mealType);
            if (!meals.length) return null;
            return <div key={mealType}><div className="nyf-chip-heading" style={{ marginTop: 10 }}>{mealType}</div>{meals.map((f) => (
            <div className="nyf-log-item" key={f.id}>
              <div>
                <div className="nyf-log-name">{f.name}{f.qty ? ` — ${f.qty}${f.unit}` : ""}</div>
                <div className="nyf-log-macro">P{f.protein} · C{f.carb} · F{f.fat}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span>{f.cal} kcal</span>
                <button className="nyf-close-btn" onClick={() => repeatFood({ mealType: f.mealType || mealType, name: f.name, qty: f.qty, unit: f.unit, cal: f.cal, protein: f.protein, carb: f.carb, fat: f.fat })} aria-label="Log again" title="Log again">
                  <Plus size={13} />
                </button>
                <button className="nyf-close-btn" onClick={() => removeFood(f.id)} aria-label="Remove">
                  <X size={13} />
                </button>
              </div>
            </div>))}</div>;
          })
        )}
      </div>

      <div className="nyf-card">
        <div className="nyf-section-title">Weight &amp; body fat</div>
        {chartData.length >= 2 ? (
          <div style={{ width: "100%", height: 170 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#E3DCC9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#55604F" />
                <YAxis yAxisId="weight" tick={{ fontSize: 10 }} stroke="#2F4B3C" width={32} domain={["auto", "auto"]} />
                <YAxis yAxisId="fat" orientation="right" tick={{ fontSize: 10 }} stroke="#B98A2E" width={32} domain={["auto", "auto"]} />
                <Tooltip />
                <Line yAxisId="weight" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#2F4B3C" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="fat" type="monotone" dataKey="bodyFat" name="Body fat (%)" stroke="#B98A2E" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="nyf-empty">Log at least two check-ins to see your trend.</div>
        )}
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: "#2F4B3C", marginRight: 5 }} />Weight</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: "#B98A2E", marginRight: 5 }} />Body fat</span>
        </div>
        {latestWeight && (
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>
            Latest: {latestWeight.weight}kg{latestWeight.bodyFat ? ` · ${latestWeight.bodyFat}% body fat` : ""} on {latestWeight.date}
          </div>
        )}
        <button className="nyf-btn ghost full" onClick={() => setShowWeightModal(true)} style={{ marginTop: 12 }}>
          <Plus size={15} /> Log check-in
        </button>
      </div>
      <MeasurementsCard entries={measurementLogs} onAdd={addMeasurements} />
      <ProgressPhotosCard photos={progressPhotos} onAdd={addProgressPhoto} onRemove={removeProgressPhoto} />
    </>
  );
}

const FOOD_ICONS = ["🥣", "🫐", "🥤", "🍗", "🍳", "🍞"];

function FoodPicksCard() {
  return (
    <div className="nyf-card gold">
      <div className="nyf-section-title">Smart picks at Checkers &amp; Pick n Pay</div>
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
        Everyday options that give you good protein without much fat or carbs. Values are typical for the product category — always check the actual label, since brands and formulations vary.
      </p>
      {FOOD_PICKS.map((f, i) => (
        <div className="nyf-log-item" key={i} style={{ alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ fontSize: 22, lineHeight: "26px" }}>{FOOD_ICONS[i]}</span>
            <div>
              <div className="nyf-log-name">{f.name}</div>
              <div className="nyf-log-macro">{f.note}</div>
              <div className="nyf-log-macro" style={{ marginTop: 3 }}>
                P{f.protein}g · C{f.carb}g · F{f.fat}g <span style={{ opacity: 0.7 }}>· per {f.per}</span>
              </div>
            </div>
          </div>
          <span style={{ whiteSpace: "nowrap", marginLeft: 10 }}>{f.cal} kcal</span>
        </div>
      ))}
      <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 10 }}>
        Photos aren't included yet — hotlinking product photos from retailer sites is unreliable and can raise usage-rights issues. If you'd like real photos here, the cleanest option is snapping your own in-store and sending them through to add.
      </p>
    </div>
  );
}

function LearnTab({ openArticle, setOpenArticle }) {
  return (
    <>
      <div className="nyf-card gold">
        <div className="nyf-section-title"><BookOpen size={17} /> Start here: your beginner learning path</div>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>You do not need to understand everything at once. Read one short lesson at a time and practise one idea during the week.</p>
        <div className="nyf-learn-path"><div><strong>1 · Understand</strong><span>Calories, macros and fat loss</span></div><div><strong>2 · Build</strong><span>Protein-rich, filling meals</span></div><div><strong>3 · Train</strong><span>Strength, cardio and steps</span></div><div><strong>4 · Continue</strong><span>Recovery, plateaus and maintenance</span></div></div>
      </div>
      <div className="nyf-card">
        <div className="nyf-section-title">Five words to know first</div>
        <div className="nyf-log-item"><div><div className="nyf-log-name">Calories</div><div className="nyf-log-macro">The energy supplied by food and used by your body.</div></div></div>
        <div className="nyf-log-item"><div><div className="nyf-log-name">Macros</div><div className="nyf-log-macro">Protein, carbohydrates and fats—the main nutrients that contain calories.</div></div></div>
        <div className="nyf-log-item"><div><div className="nyf-log-name">Maintenance</div><div className="nyf-log-macro">The approximate calories that keep average body weight stable.</div></div></div>
        <div className="nyf-log-item"><div><div className="nyf-log-name">Calorie deficit</div><div className="nyf-log-macro">Eating less energy than your body uses over time.</div></div></div>
        <div className="nyf-log-item"><div><div className="nyf-log-name">Progressive overload</div><div className="nyf-log-macro">Gradually increasing training difficulty as you become stronger.</div></div></div>
      </div>
      <FoodPicksCard />
      <div className="nyf-card">
      <div className="nyf-section-title">Beginner lessons ({ARTICLES.length})</div>
      {ARTICLES.map((a, i) => (
        <div className="nyf-accordion-item" key={i}>
          <button className="nyf-accordion-head" onClick={() => setOpenArticle(openArticle === i ? null : i)}>
            {a.title}
            <ChevronDown size={16} style={{ transform: openArticle === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 8 }} />
          </button>
          {openArticle === i && (
            <div className="nyf-accordion-body">
              {a.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          )}
        </div>
      ))}
      </div>
    </>
  );
}

function RestaurantHelper({ profile, totals = {}, creditedExerciseCalories = 0 }) {
  const [restaurant, setRestaurant] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const remaining = {
    cal: Math.max(0, profile.calorieGoal - Math.max(0, (totals.cal || 0) - creditedExerciseCalories)),
    protein: Math.max(0, profile.proteinGoal - (totals.protein || 0)),
    carb: Math.max(0, profile.carbGoal - (totals.carb || 0)),
    fat: Math.max(0, profile.fatGoal - (totals.fat || 0)),
  };
  function addPhotos(event) {
    const files = Array.from(event.target.files || []).slice(0, 2);
    files.forEach((file) => {
      const source = URL.createObjectURL(file); const image = new Image();
      image.onload = () => {
        const max = 1200; const scale = Math.min(1, max / Math.max(image.width, image.height)); const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", .76);
        setPhotos((current) => [...current, { preview: dataUrl, data: dataUrl.split(",")[1], mimeType: "image/jpeg" }].slice(0, 2));
        URL.revokeObjectURL(source);
      };
      image.src = source;
    });
    event.target.value = "";
  }
  async function analyse() {
    if (!restaurant.trim() && !notes.trim() && !photos.length) { setError("Enter the restaurant name, add menu details or take a menu photo."); return; }
    setLoading(true); setError(""); setAnswer("");
    const prompt = `You are the practical restaurant meal assistant for New You Fitness in South Africa. The member has approximately ${remaining.cal} kcal, ${remaining.protein}g protein, ${remaining.carb}g carbs and ${remaining.fat}g fat remaining today after their logged food and approved exercise credit.

Restaurant: ${restaurant.trim() || "Not provided"}
Member's menu notes: ${notes.trim() || "None"}
${photos.length ? "Read the attached menu photo(s) carefully." : "No menu photo was supplied, so clearly label suggestions as typical options that the member must confirm are available."}

Recommend the best 3 realistic menu choices that fit the remaining allowance. For each give: dish name, estimated calories and protein/carbs/fat, why it fits, and one exact ordering modification such as sauce on the side or swapping chips for salad. Put the strongest choice first. Do not invent certainty: menu nutrition is an estimate unless the menu supplies values. If the allowance is very small, recommend a smaller portion or taking half home. End with one short reminder that restaurant portions and cooking oil vary. Keep the response concise, clear and easy to scan.`;
    try {
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 18000);
      const response = await fetch("/api/ai", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ prompt, maxTokens: 1200, images: photos.map(({ data, mimeType }) => ({ data, mimeType })) }) });
      clearTimeout(timeout); const data = await response.json();
      if (!response.ok || !data.text) throw new Error(data.error || "Could not analyse the menu");
      setAnswer(data.text);
    } catch (e) { setError(e?.name === "AbortError" ? "The menu analysis took too long. Try one clear photo or type the menu items." : "Couldn't analyse this menu right now. Please try again."); }
    setLoading(false);
  }
  return <div className="nyf-card gold"><div className="nyf-section-title"><Search size={17} /> What should I order?</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>At a restaurant? Enter its name or photograph the menu and get choices based on what you have left today.</p><div className="nyf-product-card" style={{ marginBottom: 12 }}><strong>Remaining today:</strong> {remaining.cal} kcal · P{remaining.protein}g · C{remaining.carb}g · F{remaining.fat}g</div><label className="nyf-field-label">Restaurant name</label><input className="nyf-input" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} placeholder="e.g. Spur, Ocean Basket or restaurant name" /><label className="nyf-field-label">Menu items or preferences (optional)</label><textarea className="nyf-input" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste menu items, or say what you feel like eating…" />{photos.length > 0 && <div className="nyf-photo-grid" style={{ marginTop: 10 }}>{photos.map((photo, index) => <div className="nyf-photo" key={index}><img src={photo.preview} alt={`Menu ${index + 1}`} /><button onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))} aria-label="Remove menu photo"><X size={13} /></button></div>)}</div>}<label className="nyf-btn ghost full" style={{ cursor: "pointer", marginTop: 10 }}><Camera size={15} /> {photos.length ? "Add another menu photo" : "Take or upload menu photo"}<input type="file" accept="image/*" capture="environment" multiple onChange={addPhotos} disabled={photos.length >= 2} style={{ display: "none" }} /></label><button className="nyf-btn gold full" style={{ marginTop: 9 }} onClick={analyse} disabled={loading}>{loading ? "Reading the menu…" : "Find my best choices"}</button>{error && <div className="nyf-lookup-error" style={{ marginTop: 10 }}>{error}</div>}{answer && <div className="nyf-ai-box" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}><p>{answer}</p></div>}<p style={{ fontSize: 10.5, color: "var(--ink-soft)", lineHeight: 1.4, marginTop: 10 }}>Suggestions are estimates, not verified restaurant nutrition. Ingredients, portions and cooking oil can change the actual values.</p></div>;
}

const QUICK_CHOICE_GROUPS = {
  Meal: [
    { name: "Chicken, potato and salad", cal: 480, protein: 48, carb: 42, fat: 12, tip: "Keep sauce on the side." },
    { name: "Scrambled eggs on toast", cal: 390, protein: 27, carb: 32, fat: 17, tip: "Use cooking spray instead of extra butter." },
    { name: "Tuna salad wrap", cal: 410, protein: 36, carb: 39, fat: 11, tip: "Choose light mayonnaise." },
  ],
  Snack: [
    { name: "Lean biltong", cal: 125, protein: 25, carb: 1, fat: 3, tip: "A useful high-protein option." },
    { name: "Protein yoghurt bowl", cal: 240, protein: 31, carb: 20, fat: 4, tip: "Use fat-free plain yoghurt and berries." },
    { name: "Whey protein shake", cal: 125, protein: 24, carb: 3, fat: 2, tip: "Mix with water when calories are tight." },
  ],
  Craving: [
    { name: "Chocolate protein yoghurt", cal: 210, protein: 27, carb: 19, fat: 3, tip: "Mix cocoa and sweetener into protein yoghurt." },
    { name: "Air-popped popcorn", cal: 120, protein: 4, carb: 23, fat: 2, tip: "Measure the kernels before popping." },
    { name: "Zero-sugar jelly and yoghurt", cal: 105, protein: 10, carb: 12, fat: 1, tip: "Good when you want something sweet and filling." },
  ],
};

function FoodDecisionHelper({ profile, totals, creditedExerciseCalories }) {
  const [choice, setChoice] = useState("Meal");
  const remainingCalories = Math.max(0, profile.calorieGoal - Math.max(0, totals.cal - creditedExerciseCalories));
  const remainingProtein = Math.max(0, profile.proteinGoal - totals.protein);
  const options = QUICK_CHOICE_GROUPS[choice].map((item) => ({ ...item, fits: item.cal <= remainingCalories })).sort((a, b) => Number(b.fits) - Number(a.fits) || b.protein - a.protein);
  return <div className="nyf-card gold"><div className="nyf-section-title"><Sparkles size={17} /> What can I eat now?</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>You have about <strong>{remainingCalories} kcal</strong> and <strong>{remainingProtein}g protein</strong> left. Choose what you need:</p><div className="nyf-tabswitch">{Object.keys(QUICK_CHOICE_GROUPS).map((name) => <button className={choice === name ? "active" : ""} onClick={() => setChoice(name)} key={name}>{name}</button>)}</div>{options.map((item) => <div className="nyf-log-item" key={item.name} style={{ alignItems: "flex-start" }}><div><div className="nyf-log-name">{item.fits ? "🟢" : "🟡"} {item.name}</div><div className="nyf-log-macro">P{item.protein} · C{item.carb} · F{item.fat} · {item.tip}</div></div><strong style={{ whiteSpace: "nowrap", marginLeft: 8 }}>{item.cal} kcal</strong></div>)}<p style={{ fontSize: 10.5, color: "var(--ink-soft)", marginTop: 10 }}>🟢 fits your remaining calories · 🟡 reduce the portion or choose a lighter option. Values are estimates.</p></div>;
}

function EasyFoodSwaps() {
  const swaps = [["Full-fat flavoured yoghurt", "Fat-free plain yoghurt + berries", "Usually more protein and fewer calories"], ["Chips with dinner", "Baby potatoes or salad", "More filling for the calories"], ["Sugary cold drink", "Zero-sugar drink or water", "Save liquid calories"], ["Creamy sauce", "Sauce on the side", "You control the portion"]];
  return <div className="nyf-card"><div className="nyf-section-title"><RefreshCw size={16} /> Easy food swaps</div>{swaps.map(([from,to,why]) => <div className="nyf-log-item" key={from} style={{ display: "block" }}><div className="nyf-log-name">{from} → {to}</div><div className="nyf-log-macro">{why}</div></div>)}</div>;
}

function MealsTab({
  profile,
  totals,
  creditedExerciseCalories,
  suggestions,
  loading,
  error,
  getMealSuggestions,
  setTab,
  favoriteMeals,
  toggleFavoriteMeal,
  removeFavoriteMeal,
  checkedGroceryItems,
  toggleGroceryItem,
  clearGroceryChecks,
  likedFoods,
  toggleLikedFood,
}) {
  const hasGoals = profile.calorieGoal > 0;
  const favoriteNames = new Set(favoriteMeals.map((m) => m.name));
  const basicPlan = useMemo(() => {
    const eggs = 2, toast = 2, yoghurt = 300, peanutButter = 10, whey = 32, blueberries = 30, biltong = 60, chicken = 150, salad = 250, oliveOil = 10;
    const meals = [
      { name: "Breakfast · Scrambled eggs on toast", serving: `${eggs} eggs + ${toast} slices Sasko Oats & Honey toast`, cal: eggs * 72 + toast * 90, protein: eggs * 6.3 + toast * 4, carb: eggs * 0.4 + toast * 16, fat: eggs * 4.8 + toast * 1.2 },
      { name: "Lunch · Protein yoghurt bowl", serving: `${yoghurt}g plain Greek yoghurt (full-fat or low-fat) + ${whey}g whey + ${blueberries}g blueberries + ${peanutButter}g peanut butter + cinnamon`, cal: yoghurt * 0.85 + peanutButter * 5.88 + whey * 4 + blueberries * 0.57, protein: yoghurt * 0.085 + peanutButter * 0.25 + whey * 0.8 + blueberries * 0.007, carb: yoghurt * 0.04 + peanutButter * 0.2 + whey * 0.08 + blueberries * 0.145, fat: yoghurt * 0.035 + peanutButter * 0.5 + whey * 0.06 + blueberries * 0.003 },
      { name: "Snack · Lean biltong", serving: `${biltong}g lean biltong`, cal: biltong * 2.5, protein: biltong * 0.5, carb: biltong * 0.03, fat: biltong * 0.05 },
      { name: "Dinner · Chicken and salad", serving: `${chicken}g cooked chicken breast + ${salad}g mixed salad + ${oliveOil}g olive oil/lemon dressing`, cal: chicken * 1.65 + salad * 0.25 + oliveOil * 9, protein: chicken * 0.31 + salad * 0.012, carb: salad * 0.05, fat: chicken * 0.036 + salad * 0.002 + oliveOil },
    ];
    const totals = meals.reduce((sum, meal) => ({ cal: sum.cal + meal.cal, protein: sum.protein + meal.protein, carb: sum.carb + meal.carb, fat: sum.fat + meal.fat }), { cal: 0, protein: 0, carb: 0, fat: 0 });
    return { meals, totals };
  }, []);

  const groceryItems = useMemo(() => {
    const seen = new Map(); // lowercased item -> original casing
    favoriteMeals.forEach((m) => {
      (m.ingredients || []).forEach((item) => {
        const key = item.trim().toLowerCase();
        if (key && !seen.has(key)) seen.set(key, item.trim());
      });
    });
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }, [favoriteMeals]);

  return (
    <>
      <FoodDecisionHelper profile={profile} totals={totals} creditedExerciseCalories={creditedExerciseCalories} />
      <EasyFoodSwaps />
      <RestaurantHelper profile={profile} totals={totals} creditedExerciseCalories={creditedExerciseCalories} />
      <div className="nyf-card gold"><div className="nyf-section-title"><ChefHat size={16} /> Your basic New You meal plan</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>A simple high-protein starting plan for women, with protein included across every meal. Nutrition values are estimates and may vary by brand and cooking method.</p>{basicPlan.meals.map((meal) => <div className="nyf-log-item" key={meal.name} style={{ alignItems: "flex-start" }}><div style={{ flex: 1 }}><div className="nyf-log-name">{meal.name}</div><div className="nyf-log-macro">{meal.serving}</div></div><div style={{ textAlign: "right", whiteSpace: "nowrap", fontSize: 11.5 }}>{Math.round(meal.cal)} kcal<br /><span style={{ color: "var(--ink-soft)" }}>P{Math.round(meal.protein)} · C{Math.round(meal.carb)} · F{Math.round(meal.fat)}</span></div></div>)}<div className="nyf-product-card" style={{ marginTop: 12 }}><strong>Estimated day:</strong> {Math.round(basicPlan.totals.cal)} kcal · P{Math.round(basicPlan.totals.protein)}g · C{Math.round(basicPlan.totals.carb)}g · F{Math.round(basicPlan.totals.fat)}g<br /><span style={{ fontSize: 11.5 }}>Your targets: {profile.calorieGoal} kcal · P{profile.proteinGoal}g · C{profile.carbGoal}g · F{profile.fatGoal}g. Choose low-fat yoghurt when a lighter option is needed.</span></div></div>
      <div className="nyf-card">
        <div className="nyf-section-title">Foods you actually like</div>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
          Tap the foods you enjoy — suggestions will be built around these first, so the plan is easier to stick to.
        </p>
        {FOOD_PREFERENCE_LIST.map((group) => (
          <div className="nyf-chip-group" key={group.category}>
            <div className="nyf-chip-heading">{group.category}</div>
            <div className="nyf-chips">
              {group.items.map((item) => {
                const selected = likedFoods.includes(item);
                return (
                  <button
                    key={item}
                    className={`nyf-chip${selected ? " selected" : ""}`}
                    onClick={() => toggleLikedFood(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {likedFoods.length > 0 && (
          <p style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>
            {likedFoods.length} food{likedFoods.length === 1 ? "" : "s"} selected.
          </p>
        )}
      </div>

      <div className="nyf-card gold">
        <div className="nyf-section-title">
          <ChefHat size={16} color="var(--gold)" /> Meals for your goals
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>
          Built around {profile.calorieGoal} kcal · P{profile.proteinGoal}g · C{profile.carbGoal}g · F{profile.fatGoal}g per day.
        </p>
        {!hasGoals ? (
          <>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Set your calorie and macro goals first so suggestions actually fit your targets.</p>
            <button className="nyf-btn full" onClick={() => setTab("profile")} style={{ marginTop: 6 }}>Go to goals</button>
          </>
        ) : (
          <button className="nyf-btn gold full" onClick={getMealSuggestions} disabled={loading}>
            {loading ? "Personalising… instant meals below" : suggestions.length ? <><RefreshCw size={15} /> New suggestions</> : "Suggest meals for me"}
          </button>
        )}
        {error && <div className="nyf-lookup-error" style={{ marginTop: 10 }}>{error}</div>}
      </div>

      {suggestions.length > 0 && (
        <div className="nyf-card">
          <div className="nyf-section-title">Suggestions — tap the heart to save</div>
          {suggestions.map((m, i) => {
            const isFav = favoriteNames.has(m.name);
            return (
              <div className="nyf-log-item" key={i} style={{ alignItems: "flex-start" }}>
                <div>
                  <div className="nyf-stat-label" style={{ marginBottom: 2 }}>{m.mealType}</div>
                  <div className="nyf-log-name">{m.name}</div>
                  <div className="nyf-log-macro">{m.description}</div>
                  <div className="nyf-log-macro" style={{ marginTop: 3 }}>P{m.protein} · C{m.carb} · F{m.fat}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ whiteSpace: "nowrap" }}>{m.cal} kcal</span>
                  <button
                    className="nyf-close-btn"
                    style={isFav ? { background: "var(--clay-soft)" } : undefined}
                    onClick={() => toggleFavoriteMeal(m)}
                    aria-label={isFav ? "Remove favorite" : "Add favorite"}
                  >
                    <Heart size={13} color={isFav ? "var(--clay)" : "var(--ink-soft)"} fill={isFav ? "var(--clay)" : "none"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {favoriteMeals.length > 0 && (
        <div className="nyf-card">
          <div className="nyf-section-title">
            <Heart size={16} color="var(--clay)" fill="var(--clay)" /> Your favorite meals ({favoriteMeals.length})
          </div>
          {favoriteMeals.map((m, i) => (
            <div className="nyf-log-item" key={i}>
              <div>
                <div className="nyf-log-name">{m.name}</div>
                <div className="nyf-log-macro">{m.mealType} · {m.cal} kcal</div>
              </div>
              <button className="nyf-close-btn" onClick={() => removeFavoriteMeal(m.name)} aria-label="Remove">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {groceryItems.length > 0 && (
        <div className="nyf-card">
          <div className="nyf-section-title">
            <ShoppingCart size={16} /> Grocery list from your favorites
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 10 }}>
            Combined ingredients from every meal you've favorited. Tick items off as you shop.
          </p>
          {groceryItems.map((item, i) => {
            const checked = checkedGroceryItems.includes(item);
            return (
              <div className="nyf-member-row" key={i} onClick={() => toggleGroceryItem(item)} style={{ cursor: "pointer" }}>
                <span style={{ fontSize: 13.5, textDecoration: checked ? "line-through" : "none", color: checked ? "var(--ink-soft)" : "var(--ink)" }}>
                  {item}
                </span>
                <span className={`nyf-toggle ${checked ? "on" : "off"}`}>{checked ? "Got it" : "Need it"}</span>
              </div>
            );
          })}
          <button className="nyf-btn ghost full" style={{ marginTop: 12 }} onClick={clearGroceryChecks}>
            Clear ticks
          </button>
        </div>
      )}
    </>
  );
}

function GoalsCalculator({ onApply, initialGoalWeight }) {
  const [sex, setSex] = useState("woman");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState(initialGoalWeight || "");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("1.35");
  const [deficit, setDeficit] = useState("15");
  const [result, setResult] = useState(null);

  function calculate() {
    const w = Number(weight), h = Number(height), a = Number(age);
    if (!w || !h || !a) return;
    const bmr = sex === "woman" ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5;
    const maintenance = bmr * Number(activity);
    const target = maintenance * (1 - Number(deficit) / 100);
    const proteinG = Math.round(w * 2); // fixed at 2g per kg of current body weight
    const proteinCal = proteinG * 4;
    const fatCal = target * 0.25;
    const fatG = Math.round(fatCal / 9);
    const carbCal = Math.max(target - proteinCal - fatCal, 0);
    const carbG = Math.round(carbCal / 4);
    setResult({
      maintenance: Math.round(maintenance / 10) * 10,
      target: Math.round(target / 10) * 10,
      proteinG,
      fatG,
      carbG,
    });
  }

  return (
    <div className="nyf-card gold">
      <div className="nyf-section-title">
        <Calculator size={16} color="var(--gold)" /> Not sure where to start?
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 10 }}>
        Get a starting estimate based on the New You Fitness weight-loss method. This is a starting point to test over 2–4 weeks, not a fixed prescription — you can always come back and recalculate as your weight changes.
      </p>

      <div className="nyf-grid2">
        <div>
          <label className="nyf-field-label">Sex (for the equation)</label>
          <select className="nyf-select" value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="woman">Woman</option>
            <option value="man">Man</option>
          </select>
        </div>
        <div>
          <label className="nyf-field-label">Age (years)</label>
          <input className="nyf-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
      </div>
      <div className="nyf-grid2">
        <div>
          <label className="nyf-field-label">Current weight (kg)</label>
          <input className="nyf-input" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div>
          <label className="nyf-field-label">Height (cm)</label>
          <input className="nyf-input" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
      </div>
      <label className="nyf-field-label">Goal weight (kg)</label>
      <input className="nyf-input" type="number" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} placeholder="What are you working towards?" />

      <label className="nyf-field-label">Activity level</label>
      <select className="nyf-select" value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="1.20">Low — mostly seated, little structured activity</option>
        <option value="1.35">Light — some purposeful exercise, modest steps</option>
        <option value="1.50">Moderate — regular training plus daily movement</option>
        <option value="1.70">High — physically demanding work and/or heavy training</option>
      </select>

      <label className="nyf-field-label">Starting deficit (to work toward your goal weight)</label>
      <select className="nyf-select" value={deficit} onChange={(e) => setDeficit(e.target.value)}>
        <option value="10">10% — gentler, easier to sustain</option>
        <option value="15">15% — moderate starting option for many people</option>
        <option value="20">20% — faster on paper, harder on hunger and recovery</option>
      </select>
      <p style={{ fontSize: 11, color: "var(--ink-soft)", margin: "-6px 0 12px" }}>
        Protein is set automatically at 2g per kg of your current weight — the New You default for protecting muscle while losing fat.
      </p>

      <button className="nyf-btn full" onClick={calculate} disabled={!weight || !height || !age} style={{ marginTop: 4 }}>
        Calculate my numbers
      </button>

      {result && (
        <>
          <div className="nyf-product-card" style={{ marginTop: 12 }}>
            To <strong>maintain</strong> your current weight: <strong>{result.maintenance} kcal/day</strong>.
            <br />To work toward <strong>{goalWeight ? `${goalWeight}kg` : "your goal weight"}</strong>: <strong>{result.target} kcal/day</strong>.
            <br /><br />Protein <strong>{result.proteinG}g</strong> · Carbs <strong>{result.carbG}g</strong> · Fat <strong>{result.fatG}g</strong>
            <br />(Fat is set at roughly 25% of calories, carbs fill the rest.)
          </div>
          <button
            className="nyf-btn gold full"
            style={{ marginTop: 10 }}
            onClick={() => onApply({ calorieGoal: result.target, proteinGoal: result.proteinG, carbGoal: result.carbG, fatGoal: result.fatG, goalWeight })}
          >
            <Check size={15} /> Use these as my goals
          </button>
        </>
      )}
      <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 10 }}>
        This is a starting estimate (Mifflin-St Jeor method), not medical advice. If you're pregnant, breastfeeding, under 18, managing diabetes or another condition affected by diet, or have a history of disordered eating, please get individual guidance from a doctor or registered dietitian instead of self-prescribing a deficit.
      </p>
    </div>
  );
}

function ProfileTab({ profile, setProfile, setTab, onLogout, onExport, onDeleteData }) {
  const [local, setLocal] = useState(profile);
  const [justSaved, setJustSaved] = useState(false);
  useEffect(() => setLocal(profile), [profile]);
  function save() {
    setProfile({
      ...local,
      calorieGoal: Number(local.calorieGoal) || 0,
      proteinGoal: Number(local.proteinGoal) || 0,
      carbGoal: Number(local.carbGoal) || 0,
      fatGoal: Number(local.fatGoal) || 0,
    });
    setJustSaved(true);
  }
  function applyFromCalculator(vals) {
    setLocal((prev) => ({ ...prev, ...vals }));
    setJustSaved(false);
  }
  return (
    <>
      {!local.coachControlled && <GoalsCalculator onApply={applyFromCalculator} initialGoalWeight={local.goalWeight} />}
      <div className="nyf-card">
      <div className="nyf-section-title">Your goals</div>
      {local.coachControlled && <div className="nyf-product-card">Your nutrition targets are set by your New You coach. Contact your coach if you think they need adjusting.</div>}
      <label className="nyf-field-label">Name</label>
      <input className="nyf-input" value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} placeholder="Your name" />
      <label className="nyf-field-label">Goal weight (kg)</label>
      <input className="nyf-input" type="number" value={local.goalWeight || ""} onChange={(e) => setLocal({ ...local, goalWeight: e.target.value })} placeholder="What are you working towards?" />
      <label className="nyf-field-label">Daily calorie goal (kcal)</label>
      <input className="nyf-input" type="number" value={local.calorieGoal} disabled={local.coachControlled} onChange={(e) => setLocal({ ...local, calorieGoal: e.target.value })} />
      <div className="nyf-grid2">
        <div>
          <label className="nyf-field-label">Protein (g)</label>
          <input className="nyf-input" type="number" value={local.proteinGoal} disabled={local.coachControlled} onChange={(e) => setLocal({ ...local, proteinGoal: e.target.value })} />
        </div>
        <div>
          <label className="nyf-field-label">Carbs (g)</label>
          <input className="nyf-input" type="number" value={local.carbGoal} disabled={local.coachControlled} onChange={(e) => setLocal({ ...local, carbGoal: e.target.value })} />
        </div>
      </div>
      <label className="nyf-field-label">Fat (g)</label>
      <input className="nyf-input" type="number" value={local.fatGoal} disabled={local.coachControlled} onChange={(e) => setLocal({ ...local, fatGoal: e.target.value })} />
      <button className="nyf-btn full" onClick={save} style={{ marginTop: 4 }}>
        <Check size={15} /> Save goals
      </button>
      {justSaved && (
        <button className="nyf-btn gold full" style={{ marginTop: 10 }} onClick={() => setTab("meals")}>
          <ChefHat size={15} /> See meal ideas for these goals
        </button>
      )}
      {onLogout && (
        <button className="nyf-btn ghost full" style={{ marginTop: 10 }} onClick={onLogout}>
          <LogOut size={15} /> Log out
        </button>
      )}
      </div>
      <div className="nyf-card"><div className="nyf-section-title">Your data &amp; privacy</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>Your health and progress information is used to provide New You coaching support. Progress photos are optional. Do not use the app as a replacement for medical advice.</p><button className="nyf-btn ghost full" onClick={onExport}>Download my progress (CSV)</button><button className="nyf-link-btn" style={{ display: "block", margin: "12px auto 0", color: "var(--clay)" }} onClick={async () => { if (window.confirm("Delete all your saved food, weight, measurements, photos and check-ins? This cannot be undone.")) await onDeleteData(); }}>Delete all my app data</button></div>
    </>
  );
}

function FoodModal({ onAdd, onClose, recentFoods = [], savedMeals = [], onSaveMeal }) {
  const [mode, setMode] = useState("manual");
  const defaultMealType = new Date().getHours() < 10 ? "Breakfast" : new Date().getHours() < 14 ? "Lunch" : new Date().getHours() < 18 ? "Snack" : "Dinner";
  const [form, setForm] = useState({ mealType: defaultMealType, name: "", qty: "100", unit: "g", cal: "", protein: "", carb: "", fat: "" });
  const [barcode, setBarcode] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [product, setProduct] = useState(null); // per-100 macros from Open Food Facts
  const [foodQuery, setFoodQuery] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [foodSearchLoading, setFoodSearchLoading] = useState(false);
  const [foodSearchError, setFoodSearchError] = useState("");
  const [foodHasMore, setFoodHasMore] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);
  const cameraSupported = typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  const valid = form.name && form.cal;
  const quickFoods = useMemo(() => {
    const seen = new Set();
    return [...recentFoods].reverse().filter((item) => { const key = item.name?.trim().toLowerCase(); if (!key || seen.has(key)) return false; seen.add(key); return true; }).slice(0, 8);
  }, [recentFoods]);

  useEffect(() => {
    return () => stopScan();
  }, []);

  useEffect(() => {
    if (mode !== "manual" || foodQuery.trim().length < 2) { if (!foodQuery.trim()) setFoodResults([]); return; }
    const timer = setTimeout(() => searchFoods(foodQuery), 450);
    return () => clearTimeout(timer);
  }, [foodQuery, mode]);

  async function startScan() {
    setCameraError("");
    setScanning(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!videoRef.current) throw new Error("Camera preview did not start");
      const reader = new BrowserMultiFormatReader(undefined, { delayBetweenScanAttempts: 150 });
      const controls = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } },
        videoRef.current,
        (result) => {
          if (!result) return;
          const value = result.getText();
          stopScan();
          setBarcode(value);
          lookupBarcode(value);
        }
      );
      scannerControlsRef.current = controls;
    } catch (e) {
      setCameraError("The camera opened but couldn't start the scanner. Close other camera apps, reload this page and try again, or type the barcode below.");
      setScanning(false);
    }
  }

  function stopScan() {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    const stream = videoRef.current?.srcObject;
    if (stream?.getTracks) stream.getTracks().forEach((track) => track.stop());
    setScanning(false);
  }

  async function searchFoods(queryOverride, includeBrands = false) {
    const query = String(queryOverride ?? foodQuery).trim();
    if (query.length < 2) return;
    setFoodSearchLoading(true);
    setFoodSearchError("");
    if (!includeBrands) setFoodResults([]);
    try {
      const response = await fetch(`/api/foods?q=${encodeURIComponent(query)}${includeBrands ? "&more=1" : ""}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Food search failed");
      setFoodResults(data.results || []);
      setFoodHasMore(Boolean(data.hasMore) && !includeBrands);
      if (!data.results?.length) setFoodSearchError("No matching foods found. You can still enter the nutrition values manually.");
    } catch (error) {
      setFoodSearchError("Couldn't search the food database right now. You can still enter the values manually.");
    }
    setFoodSearchLoading(false);
  }

  function chooseFood(item) {
    const per100 = { cal: item.cal, protein: item.protein, carb: item.carb, fat: item.fat };
    const qty = Number(item.defaultQty) || 100;
    const factor = qty / 100;
    setProduct({ name: item.name, per100, baseUnit: item.unit || "g", measures: item.measures || {}, defaultQty: qty });
    setForm({
      mealType: form.mealType,
      name: item.name,
      qty: String(qty),
      unit: item.unit || "g",
      cal: String(Math.round(item.cal * factor)),
      protein: String(Math.round(item.protein * factor * 10) / 10),
      carb: String(Math.round(item.carb * factor * 10) / 10),
      fat: String(Math.round(item.fat * factor * 10) / 10),
    });
    setFoodResults([]);
    setFoodSearchError("");
  }

  async function lookupBarcode(codeOverride) {
    const code = (codeOverride ?? barcode).trim();
    if (!code) return;
    setLookupLoading(true);
    setLookupError("");
    setProduct(null);
    try {
      const res = await fetch(`/api/foods?barcode=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok || !data.product) {
        setLookupError("No product found for that barcode. You can enter it manually below.");
      } else {
        const p = data.product;
        const per100 = {
          cal: p.cal,
          protein: p.protein,
          carb: p.carb,
          fat: p.fat,
        };
        setProduct({ name: p.name || "Unnamed product", per100, baseUnit: p.unit || "g", measures: p.measures || {}, defaultQty: 100 });
        const qty = 100;
        setForm({
          mealType: form.mealType,
          name: p.name || "Unnamed product",
          qty: String(qty),
          unit: "g",
          cal: String(per100.cal),
          protein: String(per100.protein),
          carb: String(per100.carb),
          fat: String(per100.fat),
        });
      }
    } catch (e) {
      setLookupError("Couldn't reach the barcode database — check your connection and try again, or enter the item manually.");
    }
    setLookupLoading(false);
  }

  function equivalentAmount(qty, unit) {
    const number = Number(qty) || 0;
    if (unit === "tsp") return number * (product?.measures?.tsp || 5);
    if (unit === "tbsp") return number * (product?.measures?.tbsp || 15);
    if (unit === "cup") return number * (product?.measures?.cup || 240);
    if (unit === "serving") return number * (product?.defaultQty || 100);
    return number;
  }

  function applyQty(newQty, unitOverride = form.unit) {
    setForm((f) => ({ ...f, qty: newQty, unit: unitOverride }));
    if (product) {
      const factor = equivalentAmount(newQty, unitOverride) / 100;
      setForm((f) => ({
        ...f,
        qty: newQty,
        unit: unitOverride,
        cal: String(Math.round(product.per100.cal * factor)),
        protein: String(Math.round(product.per100.protein * factor * 10) / 10),
        carb: String(Math.round(product.per100.carb * factor * 10) / 10),
        fat: String(Math.round(product.per100.fat * factor * 10) / 10),
      }));
    }
  }

  function changeUnit(unit) {
    if (!product) { setForm((f) => ({ ...f, unit })); return; }
    const qty = ["tsp", "tbsp", "cup", "serving"].includes(unit) ? "1" : String(product.defaultQty || 100);
    applyQty(qty, unit);
  }

  return (
    <div className="nyf-modal-backdrop" onClick={onClose}>
      <div className="nyf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nyf-modal-head">
          <h3>Log a meal</h3>
          <button className="nyf-close-btn" onClick={() => { stopScan(); onClose(); }}><X size={14} /></button>
        </div>

        <div className="nyf-tabswitch">
          <button className={mode === "manual" ? "active" : ""} onClick={() => { stopScan(); setMode("manual"); }}>
            <Plus size={13} /> Manual
          </button>
          <button className={mode === "barcode" ? "active" : ""} onClick={() => setMode("barcode")}>
            <Barcode size={13} /> Barcode
          </button>
        </div>

        {quickFoods.length > 0 && (
          <div style={{ marginBottom: 5 }}>
            <label className="nyf-field-label">Recently logged · tap to add again</label>
            <div className="nyf-quick-scroll">{quickFoods.map((item) => <button className="nyf-quick-food" key={item.id} onClick={() => onAdd({ mealType: item.mealType || defaultMealType, name: item.name, qty: item.qty || null, unit: item.unit || "g", cal: Number(item.cal) || 0, protein: Number(item.protein) || 0, carb: Number(item.carb) || 0, fat: Number(item.fat) || 0 })}><strong>{item.name}</strong><span>{item.qty ? `${item.qty}${item.unit || "g"} · ` : ""}{item.cal} kcal · P{item.protein}</span></button>)}</div>
          </div>
        )}
        {savedMeals.length > 0 && <div style={{ marginBottom: 5 }}><label className="nyf-field-label">Saved meals · one tap to log</label><div className="nyf-quick-scroll">{savedMeals.map((item) => <button className="nyf-quick-food" key={item.id} onClick={() => onAdd({ mealType: item.mealType || defaultMealType, name: item.name, qty: item.qty || null, unit: item.unit || "serving", cal: Number(item.cal) || 0, protein: Number(item.protein) || 0, carb: Number(item.carb) || 0, fat: Number(item.fat) || 0 })}><strong>★ {item.name}</strong><span>{item.cal} kcal · P{item.protein} · C{item.carb} · F{item.fat}</span></button>)}</div></div>}

        {mode === "barcode" && (
          <>
            <label className="nyf-field-label">Barcode number</label>
            <div className="nyf-lookup-row">
              <input
                className="nyf-input"
                inputMode="numeric"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="e.g. 6009182982946"
              />
              <button className="nyf-btn" onClick={() => lookupBarcode()} disabled={lookupLoading || !barcode.trim()}>
                {lookupLoading ? "…" : <Search size={15} />}
              </button>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "2px 0 12px" }}>
              Type the digits under the barcode — this works on every device.
            </p>

            {cameraSupported && (
              <>
                {!scanning ? (
                  <button className="nyf-btn ghost full" onClick={startScan} style={{ marginBottom: 8 }}>
                    <Camera size={15} /> Try camera scan (experimental)
                  </button>
                ) : (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", background: "#000" }}>
                      <video ref={videoRef} muted playsInline style={{ width: "100%", display: "block" }} />
                      <div style={{ position: "absolute", inset: "35% 12%", border: "2px solid var(--gold)", borderRadius: 4, pointerEvents: "none" }} />
                    </div>
                    <button className="nyf-btn ghost full" onClick={stopScan} style={{ marginTop: 8 }}>
                      <CameraOff size={15} /> Stop scanning
                    </button>
                  </div>
                )}
                {cameraError && <div className="nyf-lookup-error" style={{ marginBottom: 10 }}>{cameraError}</div>}
                <p style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "2px 0 10px" }}>
                  Camera scanning depends on your specific phone and browser and doesn't work everywhere yet — if nothing happens after a few seconds, just type the number above instead.
                </p>
              </>
            )}
            {product && (
              <div className="nyf-product-card">
                Found: <strong>{product.name}</strong> — values below are per 100g/ml, adjust the amount to match your portion.
              </div>
            )}
            {lookupError && <div className="nyf-lookup-error">{lookupError}</div>}
          </>
        )}

        {(mode === "manual" || product || lookupError) && (
          <>
            <div style={{ height: mode === "barcode" ? 4 : 0 }} />
            {mode === "manual" && (
              <>
                <label className="nyf-field-label">Search for a food or product</label>
                <div className="nyf-lookup-row">
                  <input
                    className="nyf-input"
                    value={foodQuery}
                    onChange={(e) => setFoodQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchFoods(foodQuery)}
                    placeholder="e.g. chicken breast, yoghurt or Weet-Bix"
                  />
                  <button className="nyf-btn" onClick={() => searchFoods()} disabled={foodSearchLoading || foodQuery.trim().length < 2}>
                    {foodSearchLoading ? "…" : <Search size={15} />}
                  </button>
                </div>
                {foodSearchError && <div className="nyf-lookup-error">{foodSearchError}</div>}
                {foodResults.length > 0 && (
                  <div className="nyf-food-results">
                    {foodResults.map((item) => (
                      <button className="nyf-food-option" key={item.id} onClick={() => chooseFood(item)}>
                        <strong>{item.name}</strong>
                        <span>{item.brand ? `${item.brand} · ` : ""}per 100{item.unit}: {item.cal} kcal · P{item.protein}g · C{item.carb}g · F{item.fat}g</span>
                      </button>
                    ))}
                  </div>
                )}
                {foodResults.length > 0 && foodHasMore && <button className="nyf-btn ghost full" onClick={() => searchFoods(foodQuery, true)} disabled={foodSearchLoading} style={{ marginBottom: 10 }}><Search size={15} /> {foodSearchLoading ? "Searching brands…" : "Search South African brands"}</button>}
              </>
            )}
            <label className="nyf-field-label">Meal</label>
            <select className="nyf-select" value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select>
            <label className="nyf-field-label">Meal or food name</label>
            <input className="nyf-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Chicken & rice bowl" />

            <label className="nyf-field-label">Amount</label>
            <div className="nyf-grid2">
              <input
                className="nyf-input"
                type="number"
                value={form.qty}
                onChange={(e) => applyQty(e.target.value)}
                placeholder="e.g. 150"
              />
              <select className="nyf-select" value={form.unit} onChange={(e) => changeUnit(e.target.value)}>
                <option value="g">grams (g)</option>
                <option value="ml">millilitres (ml)</option>
                <option value="tsp">teaspoons</option>
                <option value="tbsp">tablespoons</option>
                <option value="cup">cups</option>
                <option value="serving">servings</option>
              </select>
            </div>
            {product && <><div className="nyf-portion-row">{(["tsp", "tbsp", "cup", "serving"].includes(form.unit) ? [1, 2, 3] : [50, 100, 150, 200]).map((amount) => <button key={amount} onClick={() => applyQty(String(amount))}>{amount}{form.unit === "ml" ? "ml" : form.unit === "g" ? "g" : ` ${form.unit}`}</button>)}</div><p style={{ fontSize: 11, color: "var(--ink-soft)", margin: "4px 0 10px" }}>Spoon and cup values use the selected food's standard weight, so 1 teaspoon is not treated as 1 gram.</p></>}

            <label className="nyf-field-label">Calories (kcal)</label>
            <input className="nyf-input" type="number" value={form.cal} onChange={(e) => setForm({ ...form, cal: e.target.value })} />
            <div className="nyf-grid2">
              <div>
                <label className="nyf-field-label">Protein (g)</label>
                <input className="nyf-input" type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
              </div>
              <div>
                <label className="nyf-field-label">Carbs (g)</label>
                <input className="nyf-input" type="number" value={form.carb} onChange={(e) => setForm({ ...form, carb: e.target.value })} />
              </div>
            </div>
            <label className="nyf-field-label">Fat (g)</label>
            <input className="nyf-input" type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} />
            <button
              className="nyf-btn full"
              disabled={!valid}
              onClick={() =>
                onAdd({
                  mealType: form.mealType,
                  name: form.name,
                  qty: form.qty || null,
                  unit: form.unit,
                  cal: Number(form.cal) || 0,
                  protein: Number(form.protein) || 0,
                  carb: Number(form.carb) || 0,
                  fat: Number(form.fat) || 0,
                })
              }
              style={{ marginTop: 4 }}
            >
              Add to today
            </button>
            <button className="nyf-btn ghost full" disabled={!valid} onClick={() => onSaveMeal?.({ mealType: form.mealType, name: form.name, qty: form.qty || null, unit: form.unit, cal: Number(form.cal) || 0, protein: Number(form.protein) || 0, carb: Number(form.carb) || 0, fat: Number(form.fat) || 0 })} style={{ marginTop: 8 }}><Heart size={14} /> Save as usual meal</button>
          </>
        )}
      </div>
    </div>
  );
}

function WeightModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ weight: "", bodyFat: "" });
  const valid = form.weight;
  return (
    <div className="nyf-modal-backdrop" onClick={onClose}>
      <div className="nyf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nyf-modal-head">
          <h3>Log check-in</h3>
          <button className="nyf-close-btn" onClick={onClose}><X size={14} /></button>
        </div>
        <label className="nyf-field-label">Weight (kg)</label>
        <input className="nyf-input" type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
        <label className="nyf-field-label">Body fat % (optional)</label>
        <input className="nyf-input" type="number" step="0.1" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} />
        <button
          className="nyf-btn full"
          disabled={!valid}
          onClick={() => onAdd({ weight: Number(form.weight), bodyFat: form.bodyFat ? Number(form.bodyFat) : null })}
          style={{ marginTop: 4 }}
        >
          Save check-in
        </button>
      </div>
    </div>
  );
}

// ---- Access control: gates the member app behind a code Melissa issues/revokes ----

function LegacyApp() {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [accessList, setAccessList] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pausedNotice, setPausedNotice] = useState(false);
  const [view, setView] = useState("login"); // login | admin-pin | admin | app

  async function loadAccessList() {
    try {
      const r = await window.storage.get("nyf-access-list", true);
      return r && r.value ? JSON.parse(r.value) : [];
    } catch (e) {
      return [];
    }
  }
  async function saveAccessList(list) {
    setAccessList(list);
    try {
      await window.storage.set("nyf-access-list", JSON.stringify(list), true);
    } catch (e) {
      console.error("save access list failed", e);
    }
  }

  useEffect(() => {
    (async () => {
      const list = await loadAccessList();
      setAccessList(list);
      try {
        const mine = await window.storage.get("nyf-my-code");
        const code = mine && mine.value ? mine.value : "";
        if (code) {
          const entry = list.find((m) => m.code.toUpperCase() === code.toUpperCase());
          if (entry && entry.active) {
            setLoggedIn(true);
            setView("app");
          } else if (entry && !entry.active) {
            setPausedNotice(true);
          }
        }
      } catch (e) {
        // no saved code yet
      }
      setAuthLoaded(true);
    })();
  }, []);

  async function handleLogin(codeInput) {
    const code = codeInput.trim();
    const list = await loadAccessList(); // refresh in case Melissa just updated it
    setAccessList(list);
    const entry = list.find((m) => m.code.toUpperCase() === code.toUpperCase());
    if (!entry) return "Code not recognised. Check with New You Fitness for your access code.";
    if (!entry.active) return "This code isn't active right now. Check with New You Fitness.";
    try {
      await window.storage.set("nyf-my-code", code.toUpperCase());
    } catch (e) {
      // continue anyway, session still works this visit
    }
    setPausedNotice(false);
    setLoggedIn(true);
    setView("app");
    return null;
  }

  async function handleLogout() {
    try {
      await window.storage.delete("nyf-my-code");
    } catch (e) {
      // ignore
    }
    setLoggedIn(false);
    setView("login");
  }

  if (!authLoaded) {
    return (
      <div className="nyf">
        <style>{STYLE}</style>
        <div className="nyf-empty">Loading…</div>
      </div>
    );
  }

  if (view === "app" && loggedIn) {
    return <MainApp onLogout={handleLogout} />;
  }

  if (view === "admin-pin") {
    return <AdminPinScreen onBack={() => setView("login")} onUnlock={() => setView("admin")} />;
  }

  if (view === "admin") {
    return <AdminScreen accessList={accessList} saveAccessList={saveAccessList} onBack={() => setView("login")} />;
  }

  return <LoginScreen onLogin={handleLogin} pausedNotice={pausedNotice} onStaffAccess={() => setView("admin-pin")} />;
}

function LoginScreen({ onLogin, pausedNotice, onStaffAccess, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function submit() {
    if (!code.trim()) return;
    setChecking(true);
    setError("");
    const err = await onLogin(code);
    if (err) setError(err);
    setChecking(false);
  }

  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-login-wrap">
        <div className="nyf-login-logo">
          <h1>Member access</h1>
        </div>
        <div className="nyf-card">
          <div className="nyf-section-title">
            <Lock size={16} /> Enter your access code
          </div>
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
            You'll get this from New You Fitness once your monthly subscription is active.
          </p>
          <input
            className="nyf-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. AB12CD"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            autoCapitalize="characters"
          />
          {pausedNotice && (
            <div className="nyf-lookup-error" style={{ marginBottom: 10 }}>
              Your access has been paused. Contact New You Fitness to reactivate your subscription.
            </div>
          )}
          {error && <div className="nyf-lookup-error" style={{ marginBottom: 10 }}>{error}</div>}
          <button className="nyf-btn full" onClick={submit} disabled={checking || !code.trim()}>
            {checking ? "Checking…" : "Unlock"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <button className="nyf-link-btn" onClick={onStaffAccess}>New You staff access</button>
          {onBack && <><span style={{ color: "var(--line)", margin: "0 8px" }}>·</span><button className="nyf-link-btn" onClick={onBack}>Back</button></>}
        </div>
      </div>
      <FooterLogo />
    </div>
  );
}

function InstallGuide({ onClose, onInstall }) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
  return <div className="nyf-install-guide" onClick={onClose}><div className="nyf-install-sheet" onClick={(e) => e.stopPropagation()}><div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}><img className="nyf-install-icon" src="/new-you-logo.png" alt="New You" /><div><div className="nyf-step">Quick setup</div><h2 style={{ fontSize: 23 }}>Add New You to your phone</h2></div></div>{isSamsung ? <><div className="nyf-lookup-error" style={{ marginBottom: 12 }}>Samsung Internet may show an incorrect “older Android version” warning. Please install through Google Chrome instead.</div><div className="nyf-install-step"><strong>1</strong><span>Copy this app link, then open <b>Google Chrome</b>.</span></div><div className="nyf-install-step"><strong>2</strong><span>Paste and open the link in Chrome.</span></div><div className="nyf-install-step"><strong>3</strong><span>Tap Chrome’s three-dot menu and choose <b>Install app</b>.</span></div></> : isIOS ? <><div className="nyf-install-step"><strong>1</strong><span>Make sure this page is open in <b>Safari</b>.</span></div><div className="nyf-install-step"><strong>2</strong><span>Tap the <b>Share</b> button at the bottom of Safari.</span></div><div className="nyf-install-step"><strong>3</strong><span>Select <b>Add to Home Screen</b>, turn on <b>Open as Web App</b>, then tap Add.</span></div></> : onInstall ? <><p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>Install New You for faster access and an app icon on your home screen.</p><button className="nyf-btn gold full" onClick={() => { onInstall(); onClose(); }} style={{ marginTop: 10 }}>Install New You</button></> : <><div className="nyf-install-step"><strong>1</strong><span>Open your browser menu using the three dots.</span></div><div className="nyf-install-step"><strong>2</strong><span>Choose <b>Install app</b> or <b>Add to Home screen</b>.</span></div><div className="nyf-install-step"><strong>3</strong><span>Confirm to place the New You icon on your phone.</span></div></>}<button className="nyf-btn ghost full" onClick={onClose} style={{ marginTop: 10 }}>Maybe later</button></div></div>;
}

function LandingScreen({ onMember, onStaff, onInstall, showInstallGuide, onCloseInstallGuide }) {
  return (
    <div className="nyf nyf-landing">
      <style>{STYLE}</style>
      <div className="nyf-landing-hero">
        <img className="nyf-landing-mark" src="/new-you-logo.png" alt="New You Transformation Studio" />
        <h1>Your transformation,<br />tracked.</h1>
        <p className="nyf-landing-copy">Personalised calories, macros, meal inspiration, progress tracking and supportive coach insights—all in one place.</p>
        <div className="nyf-feature-row"><div className="nyf-feature-pill">Smart meals</div><div className="nyf-feature-pill">Daily tracking</div><div className="nyf-feature-pill">Coach support</div></div>
      </div>
      <div className="nyf-landing-actions">
        <button className="nyf-btn gold full" onClick={onMember} style={{ minHeight: 50 }}>Member login</button>
        <button className="nyf-btn ghost full" onClick={onStaff} style={{ marginTop: 10 }}>Coach &amp; staff access</button>
        {onInstall && <button className="nyf-link-btn" onClick={onInstall} style={{ display: "block", margin: "10px auto 0", color: "#fff" }}>Install New You on this phone</button>}
        <div style={{ textAlign: "center", color: "#C9D9E8", fontSize: 10.5, marginTop: 13, fontWeight: 600 }}>NEW YOU TRANSFORMATION STUDIO · WELLINGTON</div>
      </div>
      {showInstallGuide && <InstallGuide onClose={onCloseInstallGuide} onInstall={onInstall} />}
    </div>
  );
}

function AdminPinScreen({ onBack, onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  function submit() {
    if (pin === ADMIN_PIN) {
      onUnlock();
    } else {
      setError("Incorrect PIN.");
    }
  }
  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-login-wrap">
        <div className="nyf-login-logo">
          <h1>Staff access</h1>
        </div>
        <div className="nyf-card">
          <div className="nyf-section-title">
            <ShieldCheck size={16} /> Enter staff PIN
          </div>
          <input
            className="nyf-input"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="PIN"
          />
          {error && <div className="nyf-lookup-error" style={{ marginBottom: 10 }}>{error}</div>}
          <button className="nyf-btn full" onClick={submit} disabled={!pin}>Unlock</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <button className="nyf-link-btn" onClick={onBack}>Back to member login</button>
        </div>
      </div>
      <FooterLogo />
    </div>
  );
}

function AdminScreen({ accessList, saveAccessList, onBack }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState(genCode());

  function addMember() {
    if (!name.trim() || !code.trim()) return;
    const entry = { id: uid(), name: name.trim(), code: code.trim().toUpperCase(), active: true };
    saveAccessList([...accessList, entry]);
    setName("");
    setCode(genCode());
  }
  function toggleActive(id) {
    saveAccessList(accessList.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  }
  function removeMember(id) {
    saveAccessList(accessList.filter((m) => m.id !== id));
  }

  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-header">
        <div className="nyf-greeting">Member access</div>
      </div>
      <div className="nyf-scroll">
        <div className="nyf-card gold">
          <div className="nyf-section-title">
            <UserPlus size={16} color="var(--gold)" /> Add a member
          </div>
          <label className="nyf-field-label">Member name</label>
          <input className="nyf-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Adams" />
          <label className="nyf-field-label">Access code</label>
          <div className="nyf-lookup-row" style={{ marginBottom: 10 }}>
            <input className="nyf-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            <button className="nyf-btn ghost" onClick={() => setCode(genCode())}>New</button>
          </div>
          <button className="nyf-btn full" onClick={addMember} disabled={!name.trim() || !code.trim()}>
            <Plus size={15} /> Add &amp; activate
          </button>
        </div>

        <div className="nyf-card">
          <div className="nyf-section-title">Members ({accessList.filter((m) => m.active).length} active)</div>
          {accessList.length === 0 ? (
            <div className="nyf-empty">No members added yet.</div>
          ) : (
            accessList.map((m) => (
              <div className="nyf-member-row" key={m.id}>
                <div>
                  <div className="nyf-member-name">{m.name}</div>
                  <div className="nyf-member-code">{m.code}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className={`nyf-toggle ${m.active ? "on" : "off"}`} onClick={() => toggleActive(m.id)}>
                    {m.active ? "Active" : "Paused"}
                  </button>
                  <button className="nyf-close-btn" onClick={() => removeMember(m.id)} aria-label="Remove">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <p style={{ fontSize: 11.5, color: "var(--ink-soft)", textAlign: "center", padding: "0 10px" }}>
          Give each member their code once their New You Fitness subscription is active. Toggle "Paused" to cut off access instantly — no need to remove them.
        </p>
      </div>
      <div style={{ padding: "12px 18px 20px" }}>
        <button className="nyf-btn ghost full" onClick={onBack}>Back to member login</button>
      </div>
      <FooterLogo />
    </div>
  );
}

// Central, database-backed access used by the deployed member app.
export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("landing");
  const [memberName, setMemberName] = useState("");
  const [pausedNotice, setPausedNotice] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const manifest = document.createElement("link"); manifest.rel = "manifest"; manifest.href = "/manifest.webmanifest"; document.head.appendChild(manifest);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const captureInstall = (event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener("beforeinstallprompt", captureInstall);
    const standalone = window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone;
    if (!standalone && !localStorage.getItem("nyf_install_guide_seen")) setTimeout(() => setShowInstallGuide(true), 900);
    (async () => {
      try {
        const response = await fetch("/api/auth?action=session", { credentials: "same-origin" });
        const session = await response.json();
        setPausedNotice(Boolean(session.paused));
        if (session.authenticated && session.role === "member") {
          setMemberName(session.name || "");
          setView("app");
        } else if (session.authenticated && session.role === "staff") {
          setView("admin");
        }
      } catch {
        // Show login if the service is temporarily unavailable.
      }
      setReady(true);
    })();
    return () => window.removeEventListener("beforeinstallprompt", captureInstall);
  }, []);

  async function installApp() { if (!installPrompt) return; await installPrompt.prompt(); setInstallPrompt(null); }
  function closeInstallGuide() { localStorage.setItem("nyf_install_guide_seen", "1"); setShowInstallGuide(false); }

  async function memberLogin(code) {
    const response = await fetch("/api/auth", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "memberLogin", code }),
    });
    const result = await response.json();
    if (!response.ok) return result.error || "Could not sign in.";
    setMemberName(result.name || "");
    setPausedNotice(false);
    setView("app");
    return null;
  }

  async function staffLogin(pin) {
    const response = await fetch("/api/auth", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "staffLogin", pin }),
    });
    const result = await response.json();
    if (!response.ok) return result.error || "Could not sign in.";
    setView("admin");
    return null;
  }

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setMemberName("");
    setView("login");
  }

  if (!ready) return <div className="nyf"><style>{STYLE}</style><div className="nyf-empty">Loading…</div></div>;
  if (view === "app") return <MainApp onLogout={logout} memberName={memberName} />;
  if (view === "admin") return <CoachDashboard onLogout={logout} />;
  if (view === "staff-login") return <CentralStaffLogin onBack={() => setView("login")} onLogin={staffLogin} />;
  if (view === "landing") { const isSamsung = /SamsungBrowser/i.test(navigator.userAgent); return <LandingScreen onMember={() => setView("login")} onStaff={() => setView("staff-login")} onInstall={installPrompt && !isSamsung ? installApp : null} showInstallGuide={showInstallGuide} onCloseInstallGuide={closeInstallGuide} />; }
  return <LoginScreen onLogin={memberLogin} pausedNotice={pausedNotice} onStaffAccess={() => setView("staff-login")} onBack={() => setView("landing")} />;
}

function CentralStaffLogin({ onBack, onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit() {
    if (!pin) return;
    setLoading(true);
    setError("");
    const message = await onLogin(pin);
    if (message) setError(message);
    setLoading(false);
  }
  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-login-wrap">
        <div className="nyf-login-logo">
          <h1>Staff access</h1>
        </div>
        <div className="nyf-card">
          <div className="nyf-section-title"><ShieldCheck size={16} /> Enter staff PIN</div>
          <input className="nyf-input" type="password" inputMode="numeric" value={pin}
            onChange={(event) => setPin(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="PIN" />
          {error && <div className="nyf-lookup-error" style={{ marginBottom: 10 }}>{error}</div>}
          <button className="nyf-btn full" onClick={submit} disabled={!pin || loading}>{loading ? "Checking…" : "Unlock"}</button>
        </div>
        <div style={{ textAlign: "center" }}><button className="nyf-link-btn" onClick={onBack}>Back to member login</button></div>
      </div>
      <FooterLogo />
    </div>
  );
}

function CoachGoalsEditor({ profile, onSave }) {
  const [form, setForm] = useState({ calorieGoal: profile.calorieGoal || "", proteinGoal: profile.proteinGoal || "", carbGoal: profile.carbGoal || "", fatGoal: profile.fatGoal || "", exerciseCredit: profile.exerciseCredit ?? 50 });
  const [saved, setSaved] = useState(false);
  async function save() { await onSave(form); setSaved(true); }
  return <div className="nyf-card gold"><div className="nyf-section-title"><Settings size={17} /> Coach-set targets</div><div className="nyf-grid2"><div><label className="nyf-field-label">Calories</label><input className="nyf-input" type="number" value={form.calorieGoal} onChange={(e) => setForm({ ...form, calorieGoal: e.target.value })} /></div><div><label className="nyf-field-label">Protein (g)</label><input className="nyf-input" type="number" value={form.proteinGoal} onChange={(e) => setForm({ ...form, proteinGoal: e.target.value })} /></div><div><label className="nyf-field-label">Carbs (g)</label><input className="nyf-input" type="number" value={form.carbGoal} onChange={(e) => setForm({ ...form, carbGoal: e.target.value })} /></div><div><label className="nyf-field-label">Fat (g)</label><input className="nyf-input" type="number" value={form.fatGoal} onChange={(e) => setForm({ ...form, fatGoal: e.target.value })} /></div></div><label className="nyf-field-label">Exercise calories added back</label><select className="nyf-select" value={form.exerciseCredit} onChange={(e) => setForm({ ...form, exerciseCredit: Number(e.target.value) })}><option value="0">0% — no extra allowance</option><option value="50">50% — recommended</option><option value="100">100% — full estimate</option></select><button className="nyf-btn full" onClick={save}>Save member targets</button>{saved && <div className="nyf-product-card">Targets updated successfully.</div>}</div>;
}

function CoachDashboard({ onLogout }) {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState(genCode());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [memberSearch, setMemberSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [backupLoading, setBackupLoading] = useState(false);

  async function memberAction(action, extra = {}) {
    const response = await fetch("/api/members", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed");
    if (result.members) setMembers(result.members);
    return result;
  }

  useEffect(() => {
    memberAction("list").catch((e) => setError(e.message)).finally(() => setLoading(false));
    fetch("/api/coach-overview", { credentials: "same-origin" }).then((response) => response.json()).then((result) => setSummaries(Object.fromEntries((result.summaries || []).map((item) => [item.code, item])))).catch(() => {});
  }, []);

  async function addMember() {
    setError("");
    try {
      await memberAction("add", { name, code });
      setName("");
      setCode(genCode());
    } catch (e) {
      setError(e.message);
    }
  }

  async function openMember(member) {
    setSelected(member);
    setMemberData(null);
    setError("");
    try {
      const response = await fetch(`/api/data?code=${encodeURIComponent(member.code)}`, { credentials: "same-origin" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load member");
      setMemberData(result);
    } catch (e) {
      setError(e.message);
    }
  }

  async function saveCoachGoals(goals) {
    const response = await fetch("/api/coach-goals", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: selected.code, goals }) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not save goals"); setMemberData(result.data);
  }
  async function downloadBackup() {
    setBackupLoading(true); setError("");
    try { const response = await fetch("/api/backup", { credentials: "same-origin" }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not create backup"); const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = `new-you-backup-${todayStr()}.json`; link.click(); URL.revokeObjectURL(url); } catch (e) { setError(e.message); }
    setBackupLoading(false);
  }

  if (selected) {
    const weights = [...(memberData?.weightLogs || [])].sort((a, b) => b.date.localeCompare(a.date));
    const foods = [...(memberData?.foodLogs || [])].sort((a, b) => b.date.localeCompare(a.date));
    const checkIns = [...(memberData?.weeklyCheckIns || [])].sort((a, b) => b.date.localeCompare(a.date));
    const measurements = [...(memberData?.measurementLogs || [])].sort((a, b) => b.date.localeCompare(a.date));
    const memberHabits = memberData?.dailyHabits || {};
    const profile = memberData?.profile || {};
    const latestCoachWeight = weights[0]?.weight;
    const firstCoachWeight = weights[weights.length - 1]?.weight;
    const change = latestCoachWeight && firstCoachWeight ? (latestCoachWeight - firstCoachWeight).toFixed(1) : null;
    const loggedDays = new Set(foods.map((item) => item.date)).size;
    const habitCompletions = Object.values(memberHabits).reduce((sum, day) => sum + HABITS.filter(([key]) => day?.[key]).length, 0);
    return (
      <div className="nyf">
        <style>{STYLE}</style>
        <div className="nyf-header">
          <div className="nyf-greeting">{selected.name}</div>
          <div className="nyf-sub">Coach view · {selected.code}</div>
        </div>
        <div className="nyf-scroll">
          <button className="nyf-btn ghost" onClick={() => setSelected(null)} style={{ marginBottom: 14 }}>Back to members</button>
          {!memberData ? <div className="nyf-empty">Loading profile…</div> : (
            <>
              <div className="nyf-card gold">
                <div className="nyf-section-title">Goals</div>
                <div className="nyf-grid2">
                  <div><div className="nyf-stat-big" style={{ fontSize: 22 }}>{profile.calorieGoal || "—"}</div><div className="nyf-stat-label">daily kcal</div></div>
                  <div><div className="nyf-stat-big" style={{ fontSize: 22 }}>{profile.proteinGoal || "—"}g</div><div className="nyf-stat-label">protein</div></div>
                </div>
              </div>
              <CoachGoalsEditor profile={profile} onSave={saveCoachGoals} />
              <div className="nyf-progress-summary">
                <div className="nyf-progress-tile"><strong>{latestCoachWeight ? `${latestCoachWeight}kg` : "—"}</strong><span>Current</span></div>
                <div className="nyf-progress-tile"><strong>{change !== null ? `${change > 0 ? "+" : ""}${change}kg` : "—"}</strong><span>Change</span></div>
                <div className="nyf-progress-tile"><strong>{loggedDays}</strong><span>Food days</span></div>
              </div>
              <div className="nyf-card">
                <div className="nyf-section-title">Measurements &amp; habits</div>
                <div className="nyf-progress-summary">
                  <div className="nyf-progress-tile"><strong>{measurements[0]?.waist ? `${measurements[0].waist}cm` : "—"}</strong><span>Latest waist</span></div>
                  <div className="nyf-progress-tile"><strong>{measurements.length}</strong><span>Measure-ins</span></div>
                  <div className="nyf-progress-tile"><strong>{habitCompletions}</strong><span>Habits done</span></div>
                </div>
                {measurements.length ? measurements.slice(0, 5).map((item) => <div className="nyf-log-item" key={item.id}><div><div className="nyf-log-name">{item.date}</div><div className="nyf-log-macro">Waist {item.waist || "—"} · Hips {item.hips || "—"} · Chest {item.chest || "—"} · Arm {item.arm || "—"} · Thigh {item.thigh || "—"} cm</div></div></div>) : <div className="nyf-empty">No measurements yet.</div>}
              </div>
              <div className="nyf-card gold">
                <div className="nyf-section-title">Weekly check-ins</div>
                {checkIns.length ? checkIns.map((item) => (
                  <div className="nyf-log-item" key={item.id} style={{ display: "block" }}>
                    <div className="nyf-log-name">{item.date}</div>
                    <div className="nyf-log-macro">Energy {item.energy}/5 · Hunger {item.hunger}/5 · Sleep {item.sleep}/5 · Training {item.training}/5</div>
                    {item.win && <div style={{ fontSize: 12.5, marginTop: 5 }}><strong>Win:</strong> {item.win}</div>}
                    {item.struggle && <div style={{ fontSize: 12.5, marginTop: 3 }}><strong>Support:</strong> {item.struggle}</div>}
                  </div>
                )) : <div className="nyf-empty">No weekly check-ins yet.</div>}
              </div>
              {(memberData?.progressPhotos || []).length > 0 && <div className="nyf-card"><div className="nyf-section-title">Progress photos</div><div className="nyf-photo-grid">{memberData.progressPhotos.map((photo) => <div className="nyf-photo" key={photo.id}><img src={photo.image} alt={`Member progress ${photo.date}`} /></div>)}</div><p style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>Private coach view · do not share without the member’s permission.</p></div>}
              <div className="nyf-card">
                <div className="nyf-section-title">Weight and body fat</div>
                {weights.length ? weights.map((item) => (
                  <div className="nyf-log-item" key={item.id}>
                    <div><div className="nyf-log-name">{item.date}</div><div className="nyf-log-macro">{item.bodyFat ? `${item.bodyFat}% body fat` : "Body fat not logged"}</div></div>
                    <strong>{item.weight}kg</strong>
                  </div>
                )) : <div className="nyf-empty">No check-ins yet.</div>}
              </div>
              <div className="nyf-card">
                <div className="nyf-section-title">Food diary</div>
                {foods.length ? foods.map((item) => (
                  <div className="nyf-log-item" key={item.id}>
                    <div><div className="nyf-log-name">{item.name}</div><div className="nyf-log-macro">{item.date} · P{item.protein} · C{item.carb} · F{item.fat}</div></div>
                    <strong>{item.cal} kcal</strong>
                  </div>
                )) : <div className="nyf-empty">No food logged yet.</div>}
              </div>
            </>
          )}
        </div>
        <FooterLogo />
      </div>
    );
  }

  const needsAttention = (member) => {
    const summary = summaries[member.code];
    if (!summary?.lastFoodDate || !summary?.lastCheckIn) return true;
    return Date.now() - new Date(`${summary.lastFoodDate}T00:00:00`).getTime() > 7 * 86400000;
  };
  const visibleMembers = members.filter((member) => member.name.toLowerCase().includes(memberSearch.trim().toLowerCase()) && (memberFilter === "all" || (memberFilter === "active" && member.active) || (memberFilter === "attention" && needsAttention(member))));

  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-header">
        <div className="nyf-greeting">Coach dashboard</div>
      </div>
      <div className="nyf-scroll">
        <div className="nyf-card gold">
          <div className="nyf-section-title"><UserPlus size={16} /> Add a member</div>
          <label className="nyf-field-label">Member name</label>
          <input className="nyf-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Adams" />
          <label className="nyf-field-label">Access code</label>
          <div className="nyf-lookup-row" style={{ marginBottom: 10 }}>
            <input className="nyf-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            <button className="nyf-btn ghost" onClick={() => setCode(genCode())}>New</button>
          </div>
          {error && <div className="nyf-lookup-error" style={{ marginBottom: 10 }}>{error}</div>}
          <button className="nyf-btn full" onClick={addMember} disabled={!name.trim() || !code.trim()}>Add &amp; activate</button>
        </div>
        <div className="nyf-card">
          <div className="nyf-section-title">Members ({members.filter((m) => m.active).length} active)</div>
          <input className="nyf-input" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search members…" />
          <div className="nyf-tabswitch"><button className={memberFilter === "all" ? "active" : ""} onClick={() => setMemberFilter("all")}>All</button><button className={memberFilter === "active" ? "active" : ""} onClick={() => setMemberFilter("active")}>Active</button><button className={memberFilter === "attention" ? "active" : ""} onClick={() => setMemberFilter("attention")}>Needs attention</button></div>
          {loading ? <div className="nyf-empty">Loading members…</div> : members.length === 0 ? <div className="nyf-empty">No members added yet.</div> :
            visibleMembers.length === 0 ? <div className="nyf-empty">No members match this view.</div> : visibleMembers.map((member) => (
              <div className="nyf-member-row" key={member.id}>
                <button className="nyf-link-btn" style={{ textAlign: "left", textDecoration: "none", flex: 1 }} onClick={() => openMember(member)}>
                  <div className="nyf-member-name">{member.name}</div>
                  <div className="nyf-member-code">{member.code} · View profile</div>
                  {summaries[member.code] && <div className="nyf-log-macro" style={{ marginTop: 4 }}>{summaries[member.code].latestWeight ? `${summaries[member.code].latestWeight}kg` : "No weight"}{summaries[member.code].weightChange !== null ? ` · ${summaries[member.code].weightChange > 0 ? "+" : ""}${summaries[member.code].weightChange}kg total` : ""} · {summaries[member.code].averageCalories ? `${summaries[member.code].averageCalories} avg kcal` : "No food this week"}{summaries[member.code].lastCheckIn ? ` · Check-in ${summaries[member.code].lastCheckIn}` : " · No check-in"}</div>}
                </button>
                <button className={`nyf-toggle ${member.active ? "on" : "off"}`} onClick={() => memberAction("toggle", { id: member.id }).catch((e) => setError(e.message))}>
                  {member.active ? "Active" : "Paused"}
                </button>
              </div>
            ))}
        </div>
        <button className="nyf-btn ghost full" onClick={downloadBackup} disabled={backupLoading}>{backupLoading ? "Preparing backup…" : "Download complete member backup"}</button>
        <button className="nyf-btn ghost full" style={{ marginTop: 10 }} onClick={onLogout}><LogOut size={15} /> Sign out</button>
      </div>
      <FooterLogo />
    </div>
  );
}
