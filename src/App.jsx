import React, { useState, useEffect, useMemo, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dumbbell, UtensilsCrossed, BookOpen, User, Plus, X, Sparkles, ChevronDown, Check, Barcode, Search, ChefHat, Camera, CameraOff, RefreshCw, Lock, Settings, UserPlus, Trash2, LogOut, ShieldCheck, Calculator, Heart, ShoppingCart, Flame } from "lucide-react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.nyf {
  --bg: #F2F5F9;
  --surface: #FFFFFF;
  --ink: #0B1F33;
  --ink-soft: #5B6B7D;
  --forest: #072952;
  --forest-deep: #04182F;
  --gold: #D9A441;
  --gold-soft: #F3E3C0;
  --sand: #E6ECF3;
  --clay: #C0392B;
  --clay-soft: #F5DCD8;
  --success: #2E7D5B;
  --success-soft: #DCEFE5;
  --line: #DCE3EC;
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--ink);
  max-width: 460px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
.nyf * { box-sizing: border-box; }
.nyf h1, .nyf h2, .nyf h3 { font-family: 'Outfit', sans-serif; margin: 0; }
.nyf-scroll { flex: 1; overflow-y: auto; padding: 20px 18px 90px; }

.nyf-header {
  padding: 14px 18px 16px;
  background: var(--forest);
  color: #fff;
  border-bottom: 3px solid var(--gold);
}
.nyf-header-logo { display: block; width: 96px; height: 96px; object-fit: contain; margin-bottom: 8px; border-radius: 4px; }
.nyf-greeting { font-size: 24px; font-weight: 700; margin-top: 4px; }
.nyf-sub { color: #C9D6C9; font-size: 13px; margin-top: 3px; }

.nyf-nav {
  position: sticky; bottom: 0;
  display: flex;
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 8px 6px 10px;
}
.nyf-navbtn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: none; border: none; padding: 6px 2px; cursor: pointer;
  color: var(--ink-soft); font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 600;
}
.nyf-navbtn.active { color: var(--forest); }
.nyf-navbtn.active svg { color: var(--gold); }

.nyf-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--forest);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 14px;
}
.nyf-card.gold { border-left-color: var(--gold); }
.nyf-card.clay { border-left-color: var(--clay); }

.nyf-section-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }

.nyf-bar-row { margin-bottom: 12px; }
.nyf-bar-label { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 5px; color: var(--ink-soft); }
.nyf-bar-track { height: 8px; background: var(--sand); border-radius: 20px; overflow: hidden; }
.nyf-bar-fill { height: 100%; border-radius: 20px; background: var(--forest); transition: width 0.4s ease; }
.nyf-bar-fill.over { background: var(--clay); }

.nyf-btn {
  background: var(--forest); color: #fff; border: none; border-radius: 3px;
  padding: 11px 16px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13.5px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 6px; justify-content: center;
}
.nyf-btn.gold { background: var(--gold); color: var(--forest-deep); }
.nyf-btn.ghost { background: transparent; color: var(--forest); border: 1px solid var(--forest); }
.nyf-btn.full { width: 100%; }
.nyf-btn:disabled { opacity: 0.55; cursor: default; }

.nyf-input, .nyf-select {
  width: 100%; padding: 9px 10px; border: 1px solid var(--line); border-radius: 3px;
  font-family: 'Inter', sans-serif; font-size: 13.5px; background: var(--bg); color: var(--ink);
  margin-bottom: 10px;
}
.nyf-input:focus, .nyf-select:focus { outline: 2px solid var(--gold); outline-offset: 1px; }
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

.nyf-ai-box { background: var(--forest); color: #fff; border-radius: 4px; padding: 14px 16px; }
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
.nyf-modal-backdrop { position: absolute; inset: 0; background: rgba(27,45,35,0.55); display: flex; align-items: flex-end; z-index: 20; }
.nyf-modal { background: var(--surface); width: 100%; border-radius: 12px 12px 0 0; padding: 20px 18px 24px; max-height: 80%; overflow-y: auto; }
.nyf-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.nyf-close-btn { background: var(--sand); border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink); }

.nyf-tabswitch { display: flex; background: var(--sand); border-radius: 4px; padding: 3px; margin-bottom: 14px; }
.nyf-tabswitch button {
  flex: 1; border: none; background: none; padding: 8px 4px; font-family: 'Inter', sans-serif;
  font-size: 12.5px; font-weight: 600; color: var(--ink-soft); border-radius: 3px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.nyf-tabswitch button.active { background: var(--surface); color: var(--forest); }
.nyf-lookup-row { display: flex; gap: 8px; align-items: flex-start; }
.nyf-lookup-row .nyf-input { margin-bottom: 0; }
.nyf-product-card {
  background: var(--success-soft); border-radius: 4px; padding: 10px 12px; margin: 10px 0 4px;
  font-size: 12.5px; color: var(--forest-deep);
}
.nyf-food-results { display: grid; gap: 8px; margin: 8px 0 14px; }
.nyf-food-option {
  width: 100%; text-align: left; border: 1px solid var(--line); border-radius: 4px;
  padding: 10px 12px; background: var(--surface); color: var(--ink); cursor: pointer;
}
.nyf-food-option strong { display: block; font-size: 13px; margin-bottom: 3px; }
.nyf-food-option span { display: block; color: var(--ink-soft); font-size: 11.5px; line-height: 1.4; }
.nyf-lookup-error { background: var(--clay-soft); color: var(--clay); border-radius: 4px; padding: 10px 12px; margin: 10px 0 4px; font-size: 12.5px; }

.nyf-login-wrap { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 28px 22px; }
.nyf-login-logo { text-align: center; margin-bottom: 30px; }
.nyf-login-logo img { display: block; width: 190px; height: 190px; object-fit: contain; margin: 0 auto 12px; border-radius: 6px; }
.nyf-login-logo h1 { font-size: 26px; margin-top: 6px; color: var(--forest); }
.nyf-link-btn { background: none; border: none; color: var(--forest); font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 6px 0; text-decoration: underline; }
.nyf-member-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); gap: 8px; }
.nyf-member-row:last-child { border-bottom: none; }
.nyf-member-name { font-weight: 700; font-size: 13.5px; }
.nyf-member-code { font-size: 11.5px; color: var(--ink-soft); font-family: monospace; }
.nyf-toggle { border: none; border-radius: 20px; padding: 4px 10px; font-size: 10.5px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.nyf-toggle.on { background: var(--success-soft); color: var(--success); }
.nyf-toggle.off { background: var(--clay-soft); color: var(--clay); }

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
function MainApp({ onLogout, memberName }) {
  const [tab, setTab] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({ name: memberName || "", calorieGoal: 1800, proteinGoal: 130, carbGoal: 180, fatGoal: 55 });
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
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/data", { credentials: "same-origin" });
        if (!r.ok) throw new Error("Could not load member data");
        const d = await r.json();
        if (d && Object.keys(d).length) {
          if (d.profile) setProfile(d.profile);
          if (d.weightLogs) setWeightLogs(d.weightLogs);
          if (d.foodLogs) setFoodLogs(d.foodLogs);
          if (d.favoriteMeals) setFavoriteMeals(d.favoriteMeals);
          if (d.checkedGroceryItems) setCheckedGroceryItems(d.checkedGroceryItems);
          if (d.likedFoods) setLikedFoods(d.likedFoods);
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
          body: JSON.stringify({ data: { profile, weightLogs, foodLogs, favoriteMeals, checkedGroceryItems, likedFoods } }),
        });
        if (!response.ok) throw new Error("Save failed");
      } catch (e) {
        console.error("save failed", e);
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [profile, weightLogs, foodLogs, favoriteMeals, checkedGroceryItems, likedFoods, loaded]);

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
    const overCal = totals.cal - profile.calorieGoal;
    const overCarb = totals.carb - profile.carbGoal;
    const trend =
      sortedWeights.length >= 2
        ? `Weight trend: started at ${sortedWeights[0].weight}kg, now ${latestWeight.weight}kg over ${sortedWeights.length} entries.`
        : "Not enough weight entries yet for a trend.";
    const prompt = `You are a supportive, knowledgeable fitness coach at New You Fitness, a gym whose tone is warm and non-intimidating (brand line: "YOU vs YOU"). Give the member a complete, short, specific and encouraging insight in exactly 3 concise sentences, with no headers or bullet points, based on today's nutrition data below. Finish every sentence fully. If they are over their calorie or carb goal, gently flag it and give one practical, non-judgmental suggestion for tomorrow. If they are on track, affirm it briefly and offer one useful tip. Never mention that you are an AI model.

Calorie goal: ${profile.calorieGoal} kcal. Consumed today: ${totals.cal} kcal (${overCal > 0 ? `${overCal} over` : `${Math.abs(overCal)} under`}).
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

  if (!loaded) {
    return (
      <div className="nyf">
        <style>{STYLE}</style>
        <div className="nyf-empty">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-header">
        <img className="nyf-header-logo" src="/new-you-logo.png" alt="New You Transformation Studio" />
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

      <div className="nyf-nav">
        <NavBtn icon={<Dumbbell size={19} />} label="Today" active={tab === "home"} onClick={() => setTab("home")} />
        <NavBtn icon={<UtensilsCrossed size={19} />} label="Track" active={tab === "track"} onClick={() => setTab("track")} />
        <NavBtn icon={<ChefHat size={19} />} label="Meals" active={tab === "meals"} onClick={() => setTab("meals")} />
        <NavBtn icon={<BookOpen size={19} />} label="Learn" active={tab === "learn"} onClick={() => setTab("learn")} />
        <NavBtn icon={<User size={19} />} label="Goals" active={tab === "profile"} onClick={() => setTab("profile")} />
      </div>

      {showFoodModal && <FoodModal onAdd={addFood} onClose={() => setShowFoodModal(false)} />}
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

function HomeTab({ profile, totals, latestWeight, aiText, aiLoading, getAiInsight, setTab }) {
  const remaining = profile.calorieGoal - totals.cal;
  return (
    <>
      <div className="nyf-card">
        <div className="nyf-stat-big">{Math.max(0, remaining)} kcal</div>
        <div className="nyf-stat-label">{remaining >= 0 ? "remaining today" : `${Math.abs(remaining)} over today's goal`}</div>
        <div style={{ height: 14 }} />
        <Bar label="Protein" value={totals.protein} goal={profile.proteinGoal} unit="g" />
        <Bar label="Carbs" value={totals.carb} goal={profile.carbGoal} unit="g" />
        <Bar label="Fat" value={totals.fat} goal={profile.fatGoal} unit="g" />
        <button className="nyf-btn full" onClick={() => setTab("track")} style={{ marginTop: 4 }}>
          <Plus size={15} /> Log food
        </button>
      </div>

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
    </>
  );
}

function TrackTab({ profile, totals, todayLogs, removeFood, chartData, latestWeight, setShowFoodModal, setShowWeightModal }) {
  return (
    <>
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

function FoodModal({ onAdd, onClose }) {
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

  useEffect(() => {
    return () => stopScan();
  }, []);

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

  async function searchFoods() {
    const query = foodQuery.trim();
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
                    onKeyDown={(e) => e.key === "Enter" && searchFoods()}
                    placeholder="e.g. chicken breast, yoghurt or Weet-Bix"
                  />
                  <button className="nyf-btn" onClick={searchFoods} disabled={foodSearchLoading || foodQuery.trim().length < 2}>
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
              </select>
            </div>

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

function LoginScreen({ onLogin, pausedNotice, onStaffAccess }) {
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
          <img src="/new-you-logo.png" alt="New You Transformation Studio" />
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
        </div>
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
          <img src="/new-you-logo.png" alt="New You Transformation Studio" />
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
        <img className="nyf-header-logo" src="/new-you-logo.png" alt="New You Transformation Studio" />
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
    </div>
  );
}

// Central, database-backed access used by the deployed member app.
export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("login");
  const [memberName, setMemberName] = useState("");
  const [pausedNotice, setPausedNotice] = useState(false);

  useEffect(() => {
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
  }, []);

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
  return <LoginScreen onLogin={memberLogin} pausedNotice={pausedNotice} onStaffAccess={() => setView("staff-login")} />;
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
          <img src="/new-you-logo.png" alt="New You Transformation Studio" />
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
    </div>
  );
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

  if (selected) {
    const weights = [...(memberData?.weightLogs || [])].sort((a, b) => b.date.localeCompare(a.date));
    const foods = [...(memberData?.foodLogs || [])].sort((a, b) => b.date.localeCompare(a.date));
    const profile = memberData?.profile || {};
    return (
      <div className="nyf">
        <style>{STYLE}</style>
        <div className="nyf-header">
          <img className="nyf-header-logo" src="/new-you-logo.png" alt="New You Transformation Studio" />
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
      </div>
    );
  }

  return (
    <div className="nyf">
      <style>{STYLE}</style>
      <div className="nyf-header">
        <img className="nyf-header-logo" src="/new-you-logo.png" alt="New You Transformation Studio" />
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
    </div>
  );
}
