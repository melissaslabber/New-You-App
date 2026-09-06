import React, { useState, useEffect, useMemo, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dumbbell, UtensilsCrossed, BookOpen, User, Plus, X, Sparkles, ChevronDown, Check, Barcode, Search, ChefHat, Camera, CameraOff, RefreshCw, Lock, Settings, UserPlus, Trash2, LogOut, ShieldCheck, Calculator, Heart, ShoppingCart, Flame } from "lucide-react";

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
.nyf-modal-backdrop { position: absolute; inset: 0; background: rgba(3,20,40,0.68); backdrop-filter: blur(4px); display: flex; align-items: flex-end; z-index: 20; }
.nyf-modal { background: var(--surface); width: 100%; border-radius: 24px 24px 0 0; padding: 22px 18px calc(26px + env(safe-area-inset-bottom)); max-height: 88%; overflow-y: auto; box-shadow: 0 -20px 50px rgba(3,20,40,.2); }
.nyf-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
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
function MainApp({ onLogout, memberName }) {
  const [tab, setTab] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({ name: memberName || "", calorieGoal: 1800, proteinGoal: 130, carbGoal: 180, fatGoal: 55, onboardingComplete: false });
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
  const [coachMessages, setCoachMessages] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);
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
          if (d.coachMessages) setCoachMessages(d.coachMessages);
          if (d.exerciseLogs) setExerciseLogs(d.exerciseLogs);
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
      try {
        const response = await fetch("/api/data", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { profile, weightLogs, foodLogs, favoriteMeals, checkedGroceryItems, likedFoods, weeklyCheckIns, measurementLogs, dailyHabits, progressPhotos, coachMessages, exerciseLogs } }),
        });
        if (!response.ok) throw new Error("Save failed");
      } catch (e) {
        console.error("save failed", e);
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [profile, weightLogs, foodLogs, favoriteMeals, checkedGroceryItems, likedFoods, weeklyCheckIns, measurementLogs, dailyHabits, progressPhotos, coachMessages, exerciseLogs, loaded]);

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
  const exerciseCalories = useMemo(() => todayExercise.reduce((sum, item) => sum + (Number(item.calories) || 0), 0), [todayExercise]);

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
  function addWeight(entry) {
    setWeightLogs((prev) => [...prev, { id: uid(), date: todayStr(), ...entry }]);
    setShowWeightModal(false);
  }
  async function callAI(prompt, maxTokens, jsonMode) {
    // Try the app's own backend first (works once deployed with /api/ai.js + an
    // ANTHROPIC_API_KEY set in Vercel).
    let backendReachable = true;
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, maxTokens, jsonMode }),
      });
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
    const overCal = totals.cal - exerciseCalories - profile.calorieGoal;
    const overCarb = totals.carb - profile.carbGoal;
    const trend =
      sortedWeights.length >= 2
        ? `Weight trend: started at ${sortedWeights[0].weight}kg, now ${latestWeight.weight}kg over ${sortedWeights.length} entries.`
        : "Not enough weight entries yet for a trend.";
    const prompt = `You are a supportive, knowledgeable fitness coach at New You Fitness, a gym whose tone is warm and non-intimidating (brand line: "YOU vs YOU"). Give the member a complete, short, specific and encouraging insight in exactly 3 concise sentences, with no headers or bullet points, based on today's nutrition data below. Finish every sentence fully. If they are over their calorie or carb goal, gently flag it and give one practical, non-judgmental suggestion for tomorrow. If they are on track, affirm it briefly and offer one useful tip. Never mention that you are an AI model.

Calorie goal: ${profile.calorieGoal} kcal. Consumed today: ${totals.cal} kcal (${overCal > 0 ? `${overCal} over` : `${Math.abs(overCal)} under`}).
Exercise logged today: ${exerciseCalories} kcal. Net calories after exercise: ${Math.max(0, totals.cal - exerciseCalories)} kcal. Treat exercise-calorie estimates as approximate.
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

      const text = await callAI(prompt, 6000, true);
      let parsed;
      try {
        parsed = parseMeals(text);
      } catch {
        // Repair a rare malformed response automatically instead of exposing a
        // technical JSON error to the member.
        const repairPrompt = `Repair the JSON below. Return only one valid JSON array. Keep the same meal information, use whole numbers without leading zeroes, and do not add markdown or commentary.\n\n${text}`;
        parsed = parseMeals(await callAI(repairPrompt, 6000, true));
      }
      if (Array.isArray(parsed)) {
        setMealSuggestions(parsed);
      } else {
        setMealsError("Couldn't read the suggestions — try again.");
      }
    } catch {
      setMealsError("Couldn't generate meal ideas right now. Please tap New suggestions to try again.");
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
  function addCoachMessage(text) {
    setCoachMessages((prev) => [...prev, { id: uid(), role: "member", text, date: new Date().toISOString() }]);
  }
  function addProgressPhoto(photo) {
    setProgressPhotos((prev) => [{ id: uid(), date: todayStr(), ...photo }, ...prev].slice(0, 6));
  }
  function removeProgressPhoto(id) {
    setProgressPhotos((prev) => prev.filter((item) => item.id !== id));
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
        <div className="nyf-greeting">{tab === "home" ? "Today" : tab === "track" ? "Track" : tab === "meals" ? "Meal suggestions" : tab === "learn" ? "Learn" : "Goals"}</div>
        {tab === "home" && <div className="nyf-sub">{new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}</div>}
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
            coachMessages={coachMessages}
            addCoachMessage={addCoachMessage}
            foodLogs={foodLogs}
            weightLogs={weightLogs}
            todayExercise={todayExercise}
            exerciseCalories={exerciseCalories}
            addExercise={addExercise}
            removeExercise={removeExercise}
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
          />
        )}
        {tab === "learn" && <LearnTab openArticle={openArticle} setOpenArticle={setOpenArticle} />}
        {tab === "meals" && (
          <MealsTab
            profile={profile}
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
        {tab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} setTab={setTab} onLogout={onLogout} />}
      </div>

      <FooterLogo />
      <div className="nyf-nav">
        <NavBtn icon={<Dumbbell size={19} />} label="Today" active={tab === "home"} onClick={() => setTab("home")} />
        <NavBtn icon={<UtensilsCrossed size={19} />} label="Track" active={tab === "track"} onClick={() => setTab("track")} />
        <NavBtn icon={<ChefHat size={19} />} label="Meals" active={tab === "meals"} onClick={() => setTab("meals")} />
        <NavBtn icon={<BookOpen size={19} />} label="Learn" active={tab === "learn"} onClick={() => setTab("learn")} />
        <NavBtn icon={<User size={19} />} label="Goals" active={tab === "profile"} onClick={() => setTab("profile")} />
      </div>

      {showFoodModal && <FoodModal onAdd={addFood} onClose={() => setShowFoodModal(false)} recentFoods={foodLogs} />}
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
  const [form, setForm] = useState({ name: profile.name || "", sex: "female", age: "", height: "", weight: "", goalWeight: "", activity: "1.375" });
  const ready = form.age && form.height && form.weight && form.goalWeight;
  function finish() {
    const weight = Number(form.weight);
    const bmr = 10 * weight + 6.25 * Number(form.height) - 5 * Number(form.age) + (form.sex === "male" ? 5 : -161);
    const maintenance = Math.round(bmr * Number(form.activity));
    const calorieGoal = Math.max(1200, Math.round((maintenance - 400) / 10) * 10);
    const proteinGoal = Math.round(weight * 1.8);
    const fatGoal = Math.round(weight * 0.7);
    const carbGoal = Math.max(50, Math.round((calorieGoal - proteinGoal * 4 - fatGoal * 9) / 4));
    onComplete({ ...profile, ...form, age: Number(form.age), height: Number(form.height), weight, goalWeight: Number(form.goalWeight), maintenance, calorieGoal, proteinGoal, carbGoal, fatGoal, onboardingComplete: true });
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
  function send() { if (!text.trim()) return; const clean = text.trim(); const message = `NEW YOU MEMBER MESSAGE\nFrom: ${memberName || "Member"}\nDate: ${todayStr()}\n\n${clean}`; window.open(`https://wa.me/27731800485?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); setText(""); }
  return <div className="nyf-card"><div className="nyf-section-title"><User size={17} /> Message your coach</div><p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Ask a question or share something with Coach Martin through WhatsApp.</p><textarea className="nyf-input" rows="2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" /><button className="nyf-btn gold full" onClick={send} disabled={!text.trim()}>WhatsApp your coach</button></div>;
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

function HomeTab({ profile, totals, latestWeight, aiText, aiLoading, getAiInsight, setTab, weeklyCheckIns, addWeeklyCheckIn, coachMessages, addCoachMessage, foodLogs, weightLogs, todayExercise, exerciseCalories, addExercise, removeExercise }) {
  const netCalories = Math.max(0, totals.cal - exerciseCalories);
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
      <div className="nyf-card">
        <div className="nyf-stat-big">{Math.max(0, remaining)} kcal</div>
        <div className="nyf-stat-label">{remaining >= 0 ? "remaining today after exercise" : `${Math.abs(remaining)} over today's adjusted goal`}</div>
        <div className="nyf-calorie-equation"><div><strong>{totals.cal}</strong><span>Food kcal</span></div><div><strong>− {exerciseCalories}</strong><span>Exercise</span></div><div><strong>{netCalories}</strong><span>Net kcal</span></div></div>
        <div style={{ height: 14 }} />
        <Bar label="Protein" value={totals.protein} goal={profile.proteinGoal} unit="g" />
        <Bar label="Carbs" value={totals.carb} goal={profile.carbGoal} unit="g" />
        <Bar label="Fat" value={totals.fat} goal={profile.fatGoal} unit="g" />
        <button className="nyf-btn full" onClick={() => setTab("track")} style={{ marginTop: 4 }}>
          <Plus size={15} /> Log food
        </button>
      </div>

      <ExerciseCard entries={todayExercise} calories={exerciseCalories} onAdd={addExercise} onRemove={removeExercise} />

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

function TrackTab({ profile, totals, todayLogs, removeFood, chartData, latestWeight, setShowFoodModal, setShowWeightModal, measurementLogs, addMeasurements, todayHabits, dailyHabits, toggleHabit, repeatFood, progressPhotos, addProgressPhoto, removeProgressPhoto }) {
  return (
    <>
      <HabitTracker todayHabits={todayHabits} dailyHabits={dailyHabits} toggleHabit={toggleHabit} />
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
          todayLogs.map((f) => (
            <div className="nyf-log-item" key={f.id}>
              <div>
                <div className="nyf-log-name">{f.name}{f.qty ? ` — ${f.qty}${f.unit}` : ""}</div>
                <div className="nyf-log-macro">P{f.protein} · C{f.carb} · F{f.fat}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span>{f.cal} kcal</span>
                <button className="nyf-close-btn" onClick={() => repeatFood({ name: f.name, qty: f.qty, unit: f.unit, cal: f.cal, protein: f.protein, carb: f.carb, fat: f.fat })} aria-label="Log again" title="Log again">
                  <Plus size={13} />
                </button>
                <button className="nyf-close-btn" onClick={() => removeFood(f.id)} aria-label="Remove">
                  <X size={13} />
                </button>
              </div>
            </div>
          ))
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
      <FoodPicksCard />
      <div className="nyf-card">
      <div className="nyf-section-title">Weight loss, plainly explained</div>
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

function MealsTab({
  profile,
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
            {loading ? "Thinking of meals…" : suggestions.length ? <><RefreshCw size={15} /> New suggestions</> : "Suggest meals for me"}
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

function ProfileTab({ profile, setProfile, setTab, onLogout }) {
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
      <GoalsCalculator onApply={applyFromCalculator} initialGoalWeight={local.goalWeight} />
      <div className="nyf-card">
      <div className="nyf-section-title">Your goals</div>
      <label className="nyf-field-label">Name</label>
      <input className="nyf-input" value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} placeholder="Your name" />
      <label className="nyf-field-label">Goal weight (kg)</label>
      <input className="nyf-input" type="number" value={local.goalWeight || ""} onChange={(e) => setLocal({ ...local, goalWeight: e.target.value })} placeholder="What are you working towards?" />
      <label className="nyf-field-label">Daily calorie goal (kcal)</label>
      <input className="nyf-input" type="number" value={local.calorieGoal} onChange={(e) => setLocal({ ...local, calorieGoal: e.target.value })} />
      <div className="nyf-grid2">
        <div>
          <label className="nyf-field-label">Protein (g)</label>
          <input className="nyf-input" type="number" value={local.proteinGoal} onChange={(e) => setLocal({ ...local, proteinGoal: e.target.value })} />
        </div>
        <div>
          <label className="nyf-field-label">Carbs (g)</label>
          <input className="nyf-input" type="number" value={local.carbGoal} onChange={(e) => setLocal({ ...local, carbGoal: e.target.value })} />
        </div>
      </div>
      <label className="nyf-field-label">Fat (g)</label>
      <input className="nyf-input" type="number" value={local.fatGoal} onChange={(e) => setLocal({ ...local, fatGoal: e.target.value })} />
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
    </>
  );
}

function FoodModal({ onAdd, onClose, recentFoods = [] }) {
  const [mode, setMode] = useState("manual");
  const [form, setForm] = useState({ name: "", qty: "100", unit: "g", cal: "", protein: "", carb: "", fat: "" });
  const [barcode, setBarcode] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [product, setProduct] = useState(null); // per-100 macros from Open Food Facts
  const [foodQuery, setFoodQuery] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [foodSearchLoading, setFoodSearchLoading] = useState(false);
  const [foodSearchError, setFoodSearchError] = useState("");
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

  async function searchFoods(queryOverride) {
    const query = String(queryOverride ?? foodQuery).trim();
    if (query.length < 2) return;
    setFoodSearchLoading(true);
    setFoodSearchError("");
    setFoodResults([]);
    try {
      const response = await fetch(`/api/foods?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Food search failed");
      setFoodResults(data.results || []);
      if (!data.results?.length) setFoodSearchError("No matching foods found. You can still enter the nutrition values manually.");
    } catch (error) {
      setFoodSearchError("Couldn't search the food database right now. You can still enter the values manually.");
    }
    setFoodSearchLoading(false);
  }

  function chooseFood(item) {
    const per100 = { cal: item.cal, protein: item.protein, carb: item.carb, fat: item.fat };
    setProduct({ name: item.name, per100 });
    setForm({
      name: item.name,
      qty: "100",
      unit: item.unit || "g",
      cal: String(item.cal),
      protein: String(item.protein),
      carb: String(item.carb),
      fat: String(item.fat),
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
        setProduct({ name: p.name || "Unnamed product", per100 });
        const qty = 100;
        setForm({
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

  function applyQty(newQty) {
    setForm((f) => ({ ...f, qty: newQty }));
    if (product) {
      const factor = (Number(newQty) || 0) / 100;
      setForm((f) => ({
        ...f,
        qty: newQty,
        cal: String(Math.round(product.per100.cal * factor)),
        protein: String(Math.round(product.per100.protein * factor)),
        carb: String(Math.round(product.per100.carb * factor)),
        fat: String(Math.round(product.per100.fat * factor)),
      }));
    }
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
            <div className="nyf-quick-scroll">{quickFoods.map((item) => <button className="nyf-quick-food" key={item.id} onClick={() => onAdd({ name: item.name, qty: item.qty || null, unit: item.unit || "g", cal: Number(item.cal) || 0, protein: Number(item.protein) || 0, carb: Number(item.carb) || 0, fat: Number(item.fat) || 0 })}><strong>{item.name}</strong><span>{item.qty ? `${item.qty}${item.unit || "g"} · ` : ""}{item.cal} kcal · P{item.protein}</span></button>)}</div>
          </div>
        )}

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
              </>
            )}
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
              <select className="nyf-select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="g">grams (g)</option>
                <option value="ml">millilitres (ml)</option>
                <option value="tsp">teaspoons</option>
                <option value="tbsp">tablespoons</option>
                <option value="cup">cups</option>
                <option value="serving">servings</option>
              </select>
            </div>
            {product && <div className="nyf-portion-row">{[50, 100, 150, 200].map((amount) => <button key={amount} onClick={() => applyQty(String(amount))}>{amount}{form.unit === "ml" ? "ml" : "g"}</button>)}</div>}

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

function LandingScreen({ onMember, onStaff, onInstall }) {
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

  useEffect(() => {
    const manifest = document.createElement("link"); manifest.rel = "manifest"; manifest.href = "/manifest.webmanifest"; document.head.appendChild(manifest);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const captureInstall = (event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener("beforeinstallprompt", captureInstall);
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
  if (view === "landing") return <LandingScreen onMember={() => setView("login")} onStaff={() => setView("staff-login")} onInstall={installPrompt ? installApp : null} />;
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

function CoachReplyPanel({ messages, onSend }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  async function send() { if (!text.trim()) return; setSending(true); setError(""); try { await onSend(text.trim()); setText(""); } catch (e) { setError(e.message); } setSending(false); }
  return <div className="nyf-card gold"><div className="nyf-section-title"><User size={17} /> Member messages</div>{messages.length ? <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 10 }}>{messages.slice(-12).map((message) => <div key={message.id} className={`nyf-message ${message.role}`}><strong>{message.role === "coach" ? "Coach" : "Member"}</strong><div>{message.text}</div><small>{new Date(message.date).toLocaleDateString("en-ZA")}</small></div>)}</div> : <div className="nyf-empty">No messages yet.</div>}<textarea className="nyf-input" rows="2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply to this member…" />{error && <div className="nyf-lookup-error">{error}</div>}<button className="nyf-btn full" onClick={send} disabled={!text.trim() || sending}>{sending ? "Sending…" : "Send reply"}</button></div>;
}

function CoachDashboard({ onLogout }) {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState(genCode());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [memberData, setMemberData] = useState(null);

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

  async function sendCoachReply(text) {
    const response = await fetch("/api/coach-message", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: selected.code, text }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not send reply");
    setMemberData(result.data);
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
              <CoachReplyPanel messages={memberData?.coachMessages || []} onSend={sendCoachReply} />
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
          {loading ? <div className="nyf-empty">Loading members…</div> : members.length === 0 ? <div className="nyf-empty">No members added yet.</div> :
            members.map((member) => (
              <div className="nyf-member-row" key={member.id}>
                <button className="nyf-link-btn" style={{ textAlign: "left", textDecoration: "none", flex: 1 }} onClick={() => openMember(member)}>
                  <div className="nyf-member-name">{member.name}</div>
                  <div className="nyf-member-code">{member.code} · View profile</div>
                </button>
                <button className={`nyf-toggle ${member.active ? "on" : "off"}`} onClick={() => memberAction("toggle", { id: member.id }).catch((e) => setError(e.message))}>
                  {member.active ? "Active" : "Paused"}
                </button>
              </div>
            ))}
        </div>
        <button className="nyf-btn ghost full" onClick={onLogout}><LogOut size={15} /> Sign out</button>
      </div>
      <FooterLogo />
    </div>
  );
}
