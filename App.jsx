import React, { useState, useEffect, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dumbbell, UtensilsCrossed, BookOpen, User, Plus, X, Sparkles, ChevronDown, Check, Barcode, Search, ChefHat, Camera, CameraOff, RefreshCw, Lock, Settings, UserPlus, Trash2, LogOut, ShieldCheck } from "lucide-react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.nyf {
  --bg: #FAF8F2;
  --surface: #FFFFFF;
  --ink: #1E241F;
  --ink-soft: #55604F;
  --forest: #2F4B3C;
  --forest-deep: #1B2D23;
  --gold: #B98A2E;
  --gold-soft: #E9D9AE;
  --sand: #EFE8D6;
  --clay: #A8472C;
  --clay-soft: #F3DCD3;
  --success: #3E7A4C;
  --success-soft: #DCEBDD;
  --line: #E3DCC9;
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
  padding: 22px 18px 16px;
  background: var(--forest);
  color: #fff;
  border-bottom: 3px solid var(--gold);
}
.nyf-wordmark { font-size: 12px; letter-spacing: 0.14em; color: var(--gold-soft); font-weight: 600; }
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
.nyf-ai-box p { font-size: 13.5px; line-height: 1.55; margin: 0; }

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
.nyf-lookup-error { background: var(--clay-soft); color: var(--clay); border-radius: 4px; padding: 10px 12px; margin: 10px 0 4px; font-size: 12.5px; }

.nyf-login-wrap { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 28px 22px; }
.nyf-login-logo { text-align: center; margin-bottom: 30px; }
.nyf-login-logo .mark { font-size: 13px; letter-spacing: 0.14em; color: var(--gold); font-weight: 700; }
.nyf-login-logo h1 { font-size: 26px; margin-top: 6px; color: var(--forest); }
.nyf-link-btn { background: none; border: none; color: var(--forest); font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 6px 0; text-decoration: underline; }
.nyf-member-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); gap: 8px; }
.nyf-member-row:last-child { border-bottom: none; }
.nyf-member-name { font-weight: 700; font-size: 13.5px; }
.nyf-member-code { font-size: 11.5px; color: var(--ink-soft); font-family: monospace; }
.nyf-toggle { border: none; border-radius: 20px; padding: 4px 10px; font-size: 10.5px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.nyf-toggle.on { background: var(--success-soft); color: var(--success); }
.nyf-toggle.off { background: var(--clay-soft); color: var(--clay); }
`;

const ARTICLES = [
  {
    title: "Calories in, calories out — the honest version",
    body: [
      "Weight change comes down to energy balance: eat less energy than you burn and you'll lose weight over time; eat more and you'll gain. It sounds simple, and the principle is — but your body burns energy in more ways than just workouts.",
      "Most of your daily burn comes from just being alive (breathing, digesting, keeping your heart beating), not from exercise. Training matters, but what you eat has the bigger say in whether you're in a deficit or not.",
      "A sensible deficit is small and sustainable — think a gentle, steady gap you can keep up for months, not a drastic cut you'll abandon in two weeks.",
    ],
  },
  {
    title: "Macros, explained without the jargon",
    body: [
      "Protein, carbs and fat are the three nutrients that make up your calories. Protein builds and repairs muscle and keeps you feeling full — aim to include it at every meal. Carbs are your body's preferred fuel, especially for training. Fat supports hormones and helps you absorb certain vitamins.",
      "There's no single 'perfect' split. A useful starting point is enough protein to support your training and appetite, enough carbs to fuel your sessions, and the rest made up of fat. Your coach can help fine-tune this once you've got a few weeks of data.",
    ],
  },
  {
    title: "Why the scale lies to you",
    body: [
      "Body weight bounces around daily because of water, sodium, hormones, and how much food is sitting in your gut — none of which reflect fat loss or gain. A single reading means very little on its own.",
      "Track the trend, not the day. Weigh in at a similar time under similar conditions a few times a week, and look at the direction over two to three weeks. Pairing weight with a body fat estimate gives you a fuller picture, since you can be losing fat and gaining muscle at the same time.",
    ],
  },
  {
    title: "Protein and staying satisfied",
    body: [
      "Protein is the most filling of the three macros, which is one reason higher-protein meals tend to make a calorie deficit feel less like a struggle. It also helps protect the muscle you've worked hard to build while you're losing fat.",
      "Spreading protein across your meals — rather than saving it all for dinner — tends to work better for both fullness and muscle maintenance.",
    ],
  },
  {
    title: "Building habits that actually stick",
    body: [
      "The plan that works is the one you can still follow in three months. Extreme restriction often backfires because it's hard to sustain, and any weight lost tends to return once normal eating resumes.",
      "Small, repeatable changes — a consistent training schedule, a protein source at each meal, tracking most days rather than perfectly — beat a perfect week you can't repeat. Progress is rarely a straight line, and that's normal.",
    ],
  },
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const ADMIN_PIN = "1412";

function MainApp({ onLogout }) {
  const [tab, setTab] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({ name: "", calorieGoal: 1800, proteinGoal: 130, carbGoal: 180, fatGoal: 55 });
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

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("nyf-data");
        if (r && r.value) {
          const d = JSON.parse(r.value);
          if (d.profile) setProfile(d.profile);
          if (d.weightLogs) setWeightLogs(d.weightLogs);
          if (d.foodLogs) setFoodLogs(d.foodLogs);
        }
      } catch (e) {
        // no saved data yet
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set("nyf-data", JSON.stringify({ profile, weightLogs, foodLogs }));
      } catch (e) {
        console.error("save failed", e);
      }
    })();
  }, [profile, weightLogs, foodLogs, loaded]);

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
  async function getAiInsight() {
    setAiLoading(true);
    setAiText("");
    const overCal = totals.cal - profile.calorieGoal;
    const overCarb = totals.carb - profile.carbGoal;
    const trend =
      sortedWeights.length >= 2
        ? `Weight trend: started at ${sortedWeights[0].weight}kg, now ${latestWeight.weight}kg over ${sortedWeights.length} entries.`
        : "Not enough weight entries yet for a trend.";
    const prompt = `You are a supportive, knowledgeable fitness coach at New You Fitness, a gym whose tone is warm and non-intimidating (brand line: "YOU vs YOU"). Give the member a short, specific, encouraging insight (3-4 sentences max, no headers, no bullet points) based on today's nutrition data below. If they are over their calorie or carb goal, gently flag it and give one practical, non-judgmental suggestion for tomorrow. If they are on track, affirm it briefly and offer one useful tip. Never mention that you are an AI model.

Calorie goal: ${profile.calorieGoal} kcal. Consumed today: ${totals.cal} kcal (${overCal > 0 ? `${overCal} over` : `${Math.abs(overCal)} under`}).
Protein goal: ${profile.proteinGoal}g. Consumed: ${totals.protein}g.
Carb goal: ${profile.carbGoal}g. Consumed: ${totals.carb}g (${overCarb > 0 ? `${overCarb}g over` : `${Math.abs(overCarb)}g under`}).
Fat goal: ${profile.fatGoal}g. Consumed: ${totals.fat}g.
${trend}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setAiText(text || "Couldn't generate an insight right now — try again in a moment.");
    } catch (e) {
      setAiText("Couldn't reach the coach right now — check your connection and try again.");
    }
    setAiLoading(false);
  }

  async function getMealSuggestions() {
    setMealsLoading(true);
    setMealsError("");
    const prompt = `You are a nutrition-savvy meal planner for New You Fitness, a gym whose tone is warm and non-intimidating (brand line: "YOU vs YOU"). A member has these daily targets: ${profile.calorieGoal} kcal, ${profile.proteinGoal}g protein, ${profile.carbGoal}g carbs, ${profile.fatGoal}g fat.

Suggest 6 simple, realistic meals/snacks (mix of breakfast, lunch, dinner, snack) that fit sensibly within these daily targets when combined (a full day should roughly add up to the goals, not each meal individually). Use everyday ingredients available in South African supermarkets. Keep descriptions practical, no fancy techniques.

Respond ONLY with a JSON array, no markdown fences, no preamble, in this exact shape:
[{"mealType": "Breakfast", "name": "short name", "description": "one short sentence, plain language", "cal": 000, "protein": 00, "carb": 00, "fat": 00}]`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed)) {
        setMealSuggestions(parsed);
      } else {
        setMealsError("Couldn't read the suggestions — try again.");
      }
    } catch (e) {
      setMealsError("Couldn't generate meal ideas right now — check your connection and try again.");
    }
    setMealsLoading(false);
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
        <div className="nyf-wordmark">NEW YOU FITNESS · YOU vs YOU</div>
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

function LearnTab({ openArticle, setOpenArticle }) {
  return (
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
  );
}

function MealsTab({ profile, suggestions, loading, error, getMealSuggestions, setTab }) {
  const hasGoals = profile.calorieGoal > 0;
  return (
    <>
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
          {suggestions.map((m, i) => (
            <div className="nyf-log-item" key={i} style={{ alignItems: "flex-start" }}>
              <div>
                <div className="nyf-stat-label" style={{ marginBottom: 2 }}>{m.mealType}</div>
                <div className="nyf-log-name">{m.name}</div>
                <div className="nyf-log-macro">{m.description}</div>
                <div className="nyf-log-macro" style={{ marginTop: 3 }}>P{m.protein} · C{m.carb} · F{m.fat}</div>
              </div>
              <span style={{ whiteSpace: "nowrap", marginLeft: 10 }}>{m.cal} kcal</span>
            </div>
          ))}
        </div>
      )}
    </>
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
  return (
    <div className="nyf-card">
      <div className="nyf-section-title">Your goals</div>
      <label className="nyf-field-label">Name</label>
      <input className="nyf-input" value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} placeholder="Your name" />
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
  );
}

function FoodModal({ onAdd, onClose }) {
  const [mode, setMode] = useState("manual");
  const [form, setForm] = useState({ name: "", qty: "100", unit: "g", cal: "", protein: "", carb: "", fat: "" });
  const [barcode, setBarcode] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [product, setProduct] = useState(null); // per-100 macros from Open Food Facts
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const cameraSupported = typeof window !== "undefined" && "BarcodeDetector" in window && !!navigator.mediaDevices;
  const valid = form.name && form.cal;

  useEffect(() => {
    return () => stopScan();
  }, []);

  async function startScan() {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      const detector = new window.BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
      });
      const tick = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) {
            const value = codes[0].rawValue;
            stopScan();
            setBarcode(value);
            lookupBarcode(value);
            return;
          }
        } catch (err) {
          // detector hiccup, keep trying
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      setCameraError("Couldn't access the camera — check your browser's camera permission, or type the barcode number below instead.");
      setScanning(false);
    }
  }

  function stopScan() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }

  async function lookupBarcode(codeOverride) {
    const code = (codeOverride ?? barcode).trim();
    if (!code) return;
    setLookupLoading(true);
    setLookupError("");
    setProduct(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`);
      const data = await res.json();
      if (data.status !== 1 || !data.product) {
        setLookupError("No product found for that barcode. You can enter it manually below.");
      } else {
        const p = data.product;
        const n = p.nutriments || {};
        const per100 = {
          cal: Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
          protein: Math.round(n["proteins_100g"] ?? 0),
          carb: Math.round(n["carbohydrates_100g"] ?? 0),
          fat: Math.round(n["fat_100g"] ?? 0),
        };
        setProduct({ name: p.product_name || "Unnamed product", per100 });
        const qty = 100;
        setForm({
          name: p.product_name || "Unnamed product",
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
            {cameraSupported ? (
              <>
                {!scanning ? (
                  <button className="nyf-btn full" onClick={startScan} style={{ marginBottom: 12 }}>
                    <Camera size={15} /> Scan with camera
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
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "0 0 10px" }}>or type the number instead</div>
              </>
            ) : (
              <p style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "0 0 10px" }}>
                Camera scanning isn't supported in this browser — type the digits under the barcode instead.
              </p>
            )}
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

export default function App() {
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
          <div className="mark">NEW YOU FITNESS · YOU vs YOU</div>
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
          <div className="mark">NEW YOU FITNESS</div>
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
        <div className="nyf-wordmark">NEW YOU FITNESS · STAFF</div>
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
