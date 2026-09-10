import React, { useEffect, useMemo, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  Barcode, Camera, CameraOff, Check, ChevronDown, Plus, Search, Star, X, Pencil
} from "lucide-react";

const RESTAURANTS = ["KFC", "McDonald's", "Steers"];
const QUICK_SEARCHES = ["Chicken breast", "Eggs", "Biltong", "Yoghurt", "Milk", "Bread"];

const UI = `
.nyf-fast-search-shell { position: relative; margin-bottom: 12px; }
.nyf-fast-search {
  display: grid; grid-template-columns: 1fr 48px; gap: 8px; align-items: stretch;
}
.nyf-fast-search-input {
  width: 100%; min-height: 50px; border: 2px solid #C9D8E8; border-radius: 14px;
  padding: 0 14px 0 42px; background: #fff; color: var(--ink); font: inherit;
  font-size: 15px; outline: none;
}
.nyf-fast-search-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(226,174,61,.16); }
.nyf-fast-search-icon { position: absolute; left: 14px; top: 15px; color: var(--forest); pointer-events: none; }
.nyf-fast-scan {
  min-height: 50px; border: 0; border-radius: 14px; background: linear-gradient(135deg,#062A55,#0878C9);
  color: #fff; display: grid; place-items: center; cursor: pointer;
}
.nyf-fast-section { margin: 14px 0; }
.nyf-fast-label { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px; font-size:12px; font-weight:800; color:var(--ink-soft); }
.nyf-fast-chips { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
.nyf-fast-chips::-webkit-scrollbar { display:none; }
.nyf-fast-chip {
  flex:0 0 auto; border:1px solid #C9D8E8; border-radius:999px; background:#fff; color:var(--forest);
  padding:8px 11px; font-size:11.5px; font-weight:750; cursor:pointer;
}
.nyf-fast-chip.restaurant { border-color:#E2AE3D; background:#FFF8E7; color:#4A3410; }
.nyf-fast-results { display:grid; gap:7px; margin:10px 0 12px; }
.nyf-fast-result {
  width:100%; display:grid; grid-template-columns:1fr 44px; gap:10px; align-items:center;
  border:1px solid #D9E4EF; border-radius:13px; background:#fff; padding:10px 9px 10px 12px;
  text-align:left;
}
.nyf-fast-result-main { min-width:0; background:none; border:0; padding:0; text-align:left; cursor:pointer; color:inherit; }
.nyf-fast-result-name { display:flex; align-items:center; gap:6px; font-size:13.5px; font-weight:800; line-height:1.25; }
.nyf-fast-result-brand { margin-top:3px; font-size:10.5px; color:var(--ink-soft); }
.nyf-fast-result-macros { margin-top:4px; font-size:11px; color:var(--ink-soft); white-space:normal; }
.nyf-fast-plus {
  width:38px; height:38px; border:0; border-radius:12px; background:var(--gold); color:var(--forest-deep);
  display:grid; place-items:center; cursor:pointer; box-shadow:0 5px 12px rgba(226,174,61,.23);
}
.nyf-fast-badge {
  display:inline-flex; align-items:center; gap:3px; border-radius:999px; padding:3px 6px;
  background:#E8F6EE; color:#24704F; font-size:8.5px; font-weight:850; letter-spacing:.02em;
}
.nyf-fast-restaurant-badge { background:#FFF4D7; color:#7A5611; }
.nyf-fast-empty { padding:18px 12px; border:1px dashed #C9D8E8; border-radius:13px; text-align:center; color:var(--ink-soft); font-size:12px; line-height:1.5; }
.nyf-fast-spinner { padding:12px; text-align:center; color:var(--ink-soft); font-size:12px; }
.nyf-fast-scanner { position:relative; overflow:hidden; border-radius:16px; background:#000; margin:10px 0; }
.nyf-fast-scanner video { display:block; width:100%; min-height:240px; object-fit:cover; }
.nyf-fast-scan-box { position:absolute; left:12%; right:12%; top:34%; height:32%; border:2px solid #F3C34D; border-radius:12px; box-shadow:0 0 0 999px rgba(0,0,0,.25); pointer-events:none; }
.nyf-fast-editor { border:1px solid #D9E4EF; border-radius:14px; padding:13px; margin:12px 0; background:#F9FBFD; }
.nyf-fast-editor-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:10px; }
.nyf-fast-editor-head strong { font-size:14px; }
.nyf-fast-nutrition { padding:10px; border-radius:11px; background:#fff; border:1px solid #E0E8F0; margin-bottom:10px; font-size:12px; font-weight:750; }
.nyf-fast-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.nyf-fast-more { border-top:1px solid var(--line); margin-top:14px; padding-top:10px; }
.nyf-fast-more summary { cursor:pointer; list-style:none; display:flex; align-items:center; justify-content:space-between; font-size:12px; font-weight:800; color:var(--forest); padding:7px 1px; }
.nyf-fast-more summary::-webkit-details-marker { display:none; }
.nyf-fast-manual { margin-top:10px; }
.nyf-fast-status { margin:9px 0; padding:9px 10px; border-radius:10px; background:#EFF6FD; color:var(--forest); font-size:11px; line-height:1.4; }
.nyf-fast-error { margin:9px 0; padding:9px 10px; border-radius:10px; background:#FCEBE8; color:#9A342A; font-size:11px; line-height:1.4; }
.nyf-fast-recent {
  flex:0 0 160px; border:1px solid #D9E4EF; border-radius:12px; background:#fff; padding:9px;
  text-align:left; cursor:pointer;
}
.nyf-fast-recent strong { display:block; font-size:11.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.nyf-fast-recent span { display:block; margin-top:3px; color:var(--ink-soft); font-size:10px; }
`;

function defaultMealType() {
  const hour = new Date().getHours();
  return hour < 10 ? "Breakfast" : hour < 14 ? "Lunch" : hour < 18 ? "Snack" : "Dinner";
}

function round1(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}

function entryFromItem(item, mealType) {
  if (item.nutritionBasis === "serving" || item.restaurant) {
    return {
      mealType,
      name: `${item.brand ? `${item.brand} ` : ""}${item.name}`.trim(),
      qty: 1,
      unit: "serving",
      cal: Math.round(Number(item.cal) || 0),
      protein: round1(item.protein),
      carb: round1(item.carb),
      fat: round1(item.fat),
    };
  }
  const qty = Number(item.defaultQty) || 100;
  const factor = qty / 100;
  return {
    mealType,
    name: `${item.brand ? `${item.brand} ` : ""}${item.name}`.trim(),
    qty,
    unit: item.unit || "g",
    cal: Math.round((Number(item.cal) || 0) * factor),
    protein: round1((Number(item.protein) || 0) * factor),
    carb: round1((Number(item.carb) || 0) * factor),
    fat: round1((Number(item.fat) || 0) * factor),
  };
}

export default function UnifiedFoodModal({
  onAdd,
  onAddAndContinue,
  onClose,
  recentFoods = [],
  savedMeals = [],
  onSaveMeal,
}) {
  const [mealType, setMealType] = useState(defaultMealType());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [barcode, setBarcode] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [manual, setManual] = useState({ name: "", qty: "1", unit: "serving", cal: "", protein: "", carb: "", fat: "" });
  const [photoStatus, setPhotoStatus] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);
  const scannerReaderRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const quickFoods = useMemo(() => {
    const seen = new Set();
    return [...recentFoods].reverse().filter((item) => {
      const key = String(item.name || "").trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }, [recentFoods]);

  useEffect(() => () => stopScan(), []);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) {
      setResults([]);
      setSearchError("");
      return;
    }
    const timer = setTimeout(() => runSearch(value), 260);
    return () => clearTimeout(timer);
  }, [query]);

  async function runSearch(value = query) {
    const q = String(value || "").trim();
    if (q.length < 2) return;
    setLoading(true);
    setSearchError("");
    try {
      const [foodResponse, restaurantResponse] = await Promise.allSettled([
        fetch(`/api/foods?q=${encodeURIComponent(q)}`, { credentials: "same-origin" }),
        fetch(`/api/restaurant-foods?q=${encodeURIComponent(q)}`, { credentials: "same-origin" }),
      ]);

      let ordinary = [];
      let restaurants = [];

      if (foodResponse.status === "fulfilled" && foodResponse.value.ok) {
        const data = await foodResponse.value.json();
        ordinary = Array.isArray(data.results) ? data.results : [];
      }
      if (restaurantResponse.status === "fulfilled" && restaurantResponse.value.ok) {
        const data = await restaurantResponse.value.json();
        restaurants = Array.isArray(data.results) ? data.results : [];
      }

      const merged = [...restaurants, ...ordinary];
      const seen = new Set();
      setResults(merged.filter((item) => {
        const key = `${item.brand || ""}|${item.name || ""}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 24));

      if (!merged.length) setSearchError("No exact match yet. Try the brand, a shorter food name, scan the barcode, or add it manually.");
    } catch {
      setSearchError("Food search is temporarily unavailable. You can still scan a barcode or add the food manually.");
    } finally {
      setLoading(false);
    }
  }

  function selectItem(item) {
    const entry = entryFromItem(item, mealType);
    setSelected(item);
    setEditor({ ...entry, qty: String(entry.qty ?? 1) });
  }

  function quickAdd(item) {
    onAdd(entryFromItem(item, mealType));
  }

  function quickAddExisting(item) {
    onAdd({
      mealType,
      name: item.name,
      qty: item.qty ?? null,
      unit: item.unit || "serving",
      cal: Math.round(Number(item.cal) || 0),
      protein: round1(item.protein),
      carb: round1(item.carb),
      fat: round1(item.fat),
    });
  }

  function updateEditorQty(value) {
    if (!selected || !editor) return;
    if (selected.photoEstimate) {
      setEditor({ ...editor, qty: value });
      return;
    }
    if (selected.nutritionBasis === "serving" || selected.restaurant) {
      const multiplier = Number(value) || 0;
      setEditor({
        ...editor,
        qty: value,
        cal: Math.round((Number(selected.cal) || 0) * multiplier),
        protein: round1((Number(selected.protein) || 0) * multiplier),
        carb: round1((Number(selected.carb) || 0) * multiplier),
        fat: round1((Number(selected.fat) || 0) * multiplier),
      });
      return;
    }
    const qty = Number(value) || 0;
    const factor = qty / 100;
    setEditor({
      ...editor,
      qty: value,
      cal: Math.round((Number(selected.cal) || 0) * factor),
      protein: round1((Number(selected.protein) || 0) * factor),
      carb: round1((Number(selected.carb) || 0) * factor),
      fat: round1((Number(selected.fat) || 0) * factor),
    });
  }

  function editorEntry() {
    return {
      mealType,
      name: editor.name,
      qty: editor.qty || null,
      unit: editor.unit || "serving",
      cal: Math.round(Number(editor.cal) || 0),
      protein: round1(editor.protein),
      carb: round1(editor.carb),
      fat: round1(editor.fat),
    };
  }

  function stopScan() {
    try { scannerControlsRef.current?.stop?.(); } catch {}
    try { scannerReaderRef.current?.reset?.(); } catch {}
    const stream = videoRef.current?.srcObject;
    if (stream?.getTracks) stream.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    scannerControlsRef.current = null;
    scannerReaderRef.current = null;
    setScanning(false);
    setCameraStatus("");
  }

  async function startScan() {
    setCameraError("");
    setCameraStatus("Opening camera…");
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("");
      setCameraError("Live scanning needs camera access on HTTPS. You can type the barcode below instead.");
      return;
    }
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setScanning(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!videoRef.current) throw new Error("Camera preview did not start");
      videoRef.current.srcObject = stream;

      const reader = new BrowserMultiFormatReader(undefined, { delayBetweenScanAttempts: 120 });
      scannerReaderRef.current = reader;
      const controls = await reader.decodeFromStream(stream, videoRef.current, (result) => {
        if (!result) return;
        const code = result.getText();
        setBarcode(code);
        stopScan();
        lookupBarcode(code);
      });
      scannerControlsRef.current = controls;
      setCameraStatus("Point the barcode inside the box. It will detect automatically.");
    } catch (error) {
      if (stream?.getTracks) stream.getTracks().forEach((track) => track.stop());
      setScanning(false);
      setCameraStatus("");
      setCameraError(error?.name === "NotAllowedError"
        ? "Camera permission was blocked. Allow camera access for New You, or type the barcode number below."
        : "The camera could not start. Try again or type the barcode number below.");
    }
  }

  async function lookupBarcode(codeOverride) {
    const code = String(codeOverride ?? barcode).trim();
    if (!code) return;
    setLoading(true);
    setSearchError("");
    try {
      const response = await fetch(`/api/foods?barcode=${encodeURIComponent(code)}`, { credentials: "same-origin" });
      const data = await response.json();
      if (!response.ok || !data.product) throw new Error("Product not found");
      selectItem(data.product);
      setQuery(data.product.name || code);
      setResults([data.product]);
    } catch {
      setSearchError("That barcode is not in the database yet. Search the product name or use Add manually below.");
    } finally {
      setLoading(false);
    }
  }

  async function analyseFoodPhoto(file) {
    if (!file) return;
    setPhotoStatus("Reading your food photo…");
    setCameraError("");
    try {
      const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not open photo"));
        reader.onload = () => {
          const source = new Image();
          source.onerror = () => reject(new Error("Could not read photo"));
          source.onload = () => {
            const scale = Math.min(1, 1200 / Math.max(source.width, source.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(source.width * scale);
            canvas.height = Math.round(source.height * scale);
            canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.76);
            resolve({ dataUrl, mimeType: "image/jpeg", data: dataUrl.split(",")[1] });
          };
          source.src = reader.result;
        };
        reader.readAsDataURL(file);
      });

      setPhotoPreview(image.dataUrl);
      const prompt = `Identify the visible meal or food and estimate the total portion and nutrition. Use familiar South African food names where relevant. Return only JSON: {"name":"","qty":0,"unit":"g","cal":0,"protein":0,"carb":0,"fat":0,"confidence":"high|medium|low"}. Values must describe the whole visible portion, not per 100 g. If several foods are visible, name the combined meal. Do not claim an exact result from a photo.`;
      const response = await fetch("/api/ai", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          jsonMode: true,
          maxTokens: 500,
          images: [{ data: image.data, mimeType: image.mimeType }],
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not analyse photo");
      const estimate = JSON.parse(String(result.text || "{}").replace(/```json|```/g, "").trim());
      setSelected({ name: estimate.name || "Photo meal estimate", photoEstimate: true, nutritionBasis: "serving", cal: estimate.cal, protein: estimate.protein, carb: estimate.carb, fat: estimate.fat });
      setEditor({
        mealType,
        name: estimate.name || "Photo meal estimate",
        qty: String(estimate.qty || 1),
        unit: ["g", "ml", "serving"].includes(estimate.unit) ? estimate.unit : "serving",
        cal: Math.round(Number(estimate.cal) || 0),
        protein: round1(estimate.protein),
        carb: round1(estimate.carb),
        fat: round1(estimate.fat),
      });
      setPhotoStatus(`Photo estimate ready (${estimate.confidence || "low"} confidence). Check it before adding.`);
    } catch (error) {
      setPhotoStatus("");
      setCameraError(error.message || "Could not analyse the photo. Try a clearer image or add manually.");
    }
  }

  function manualEntry() {
    return {
      mealType,
      name: manual.name.trim(),
      qty: manual.qty || null,
      unit: manual.unit,
      cal: Math.round(Number(manual.cal) || 0),
      protein: round1(manual.protein),
      carb: round1(manual.carb),
      fat: round1(manual.fat),
    };
  }

  return (
    <div className="nyf-modal-backdrop" onClick={onClose}>
      <style>{UI}</style>
      <div className="nyf-modal" onClick={(event) => event.stopPropagation()}>
        <div className="nyf-modal-head">
          <div>
            <h3>Add Food</h3>
            <div style={{ fontSize: 10.5, color: "var(--ink-soft)", marginTop: 2 }}>Search, scan or tap a recent food</div>
          </div>
          <button className="nyf-close-btn" onClick={() => { stopScan(); onClose(); }}><X size={14} /></button>
        </div>

        <label className="nyf-field-label">Add to</label>
        <select className="nyf-select" value={mealType} onChange={(event) => setMealType(event.target.value)}>
          <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option>
        </select>

        <div className="nyf-fast-search-shell">
          <Search className="nyf-fast-search-icon" size={19} />
          <div className="nyf-fast-search">
            <input
              className="nyf-fast-search-input"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && runSearch()}
              placeholder="Search food, brand or restaurant"
            />
            <button className="nyf-fast-scan" onClick={scanning ? stopScan : startScan} aria-label="Scan barcode">
              {scanning ? <CameraOff size={22} /> : <Barcode size={23} />}
            </button>
          </div>
        </div>

        {scanning && (
          <div className="nyf-fast-scanner">
            <video ref={videoRef} muted playsInline autoPlay />
            <div className="nyf-fast-scan-box" />
          </div>
        )}
        {cameraStatus && <div className="nyf-fast-status">{cameraStatus}</div>}
        {cameraError && <div className="nyf-fast-error">{cameraError}</div>}

        {!query.trim() && !selected && (
          <>
            {quickFoods.length > 0 && (
              <div className="nyf-fast-section">
                <div className="nyf-fast-label"><span>Recent foods</span><span>1 tap to add</span></div>
                <div className="nyf-fast-chips">
                  {quickFoods.map((item, index) => (
                    <button className="nyf-fast-recent" key={`${item.id || item.name}-${index}`} onClick={() => quickAddExisting(item)}>
                      <strong>{item.name}</strong>
                      <span>{Math.round(Number(item.cal) || 0)} kcal · P{round1(item.protein)}g</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {savedMeals.length > 0 && (
              <div className="nyf-fast-section">
                <div className="nyf-fast-label"><span>Saved meals</span><span>1 tap to add</span></div>
                <div className="nyf-fast-chips">
                  {savedMeals.slice(0, 10).map((item) => (
                    <button className="nyf-fast-recent" key={item.id || item.name} onClick={() => quickAddExisting(item)}>
                      <strong><Star size={10} style={{ verticalAlign: "middle" }} /> {item.name}</strong>
                      <span>{Math.round(Number(item.cal) || 0)} kcal · P{round1(item.protein)}g</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="nyf-fast-section">
              <div className="nyf-fast-label"><span>Restaurants</span><span>Search the SA menu</span></div>
              <div className="nyf-fast-chips">
                {RESTAURANTS.map((name) => (
                  <button className="nyf-fast-chip restaurant" key={name} onClick={() => setQuery(name)}>{name}</button>
                ))}
              </div>
            </div>

            <div className="nyf-fast-section">
              <div className="nyf-fast-label"><span>Quick search</span></div>
              <div className="nyf-fast-chips">
                {QUICK_SEARCHES.map((name) => (
                  <button className="nyf-fast-chip" key={name} onClick={() => setQuery(name)}>{name}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {loading && <div className="nyf-fast-spinner">Finding the best matches…</div>}
        {searchError && <div className="nyf-fast-error">{searchError}</div>}

        {results.length > 0 && !selected && (
          <div className="nyf-fast-results">
            {results.map((item) => {
              const preview = entryFromItem(item, mealType);
              return (
                <div className="nyf-fast-result" key={`${item.restaurant ? "restaurant" : "food"}-${item.id}`}>
                  <button className="nyf-fast-result-main" onClick={() => selectItem(item)}>
                    <div className="nyf-fast-result-name">
                      <span>{item.name}</span>
                      {item.restaurant && <span className="nyf-fast-badge nyf-fast-restaurant-badge">Restaurant</span>}
                      {item.verified && <span className="nyf-fast-badge"><Check size={9} /> Verified</span>}
                    </div>
                    <div className="nyf-fast-result-brand">
                      {item.brand || "New You food"}{item.category ? ` · ${item.category}` : ""}
                    </div>
                    <div className="nyf-fast-result-macros">
                      {item.servingLabel || `${preview.qty}${preview.unit}`} · {preview.cal} kcal · P{preview.protein}g · C{preview.carb}g · F{preview.fat}g
                    </div>
                  </button>
                  <button className="nyf-fast-plus" onClick={() => quickAdd(item)} aria-label={`Add ${item.name}`}>
                    <Plus size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && query.trim().length >= 2 && results.length === 0 && !searchError && (
          <div className="nyf-fast-empty">No matches yet. Try a shorter name or scan the barcode.</div>
        )}

        {selected && editor && (
          <div className="nyf-fast-editor">
            <div className="nyf-fast-editor-head">
              <div>
                <strong>{editor.name}</strong>
                <div style={{ fontSize: 10.5, color: "var(--ink-soft)", marginTop: 3 }}>
                  {selected.restaurant ? `${selected.brand} · ${selected.servingLabel || "per serving"}` : selected.photoEstimate ? "Estimated from photo" : "Adjust portion if needed"}
                </div>
              </div>
              <button className="nyf-close-btn" onClick={() => { setSelected(null); setEditor(null); }}><X size={13} /></button>
            </div>

            <label className="nyf-field-label">{selected.restaurant ? "Number of servings/items" : "Amount"}</label>
            <div className="nyf-grid2">
              <input className="nyf-input" type="number" min="0" step={selected.restaurant ? "0.5" : "1"} value={editor.qty} onChange={(event) => updateEditorQty(event.target.value)} />
              <input className="nyf-input" value={editor.unit} readOnly />
            </div>

            <div className="nyf-fast-nutrition">
              {Math.round(Number(editor.cal) || 0)} kcal · P{round1(editor.protein)}g · C{round1(editor.carb)}g · F{round1(editor.fat)}g
            </div>

            {selected.photoEstimate && (
              <>
                <div className="nyf-grid2">
                  <div><label className="nyf-field-label">Calories</label><input className="nyf-input" type="number" value={editor.cal} onChange={(e) => setEditor({ ...editor, cal: e.target.value })} /></div>
                  <div><label className="nyf-field-label">Protein</label><input className="nyf-input" type="number" value={editor.protein} onChange={(e) => setEditor({ ...editor, protein: e.target.value })} /></div>
                  <div><label className="nyf-field-label">Carbs</label><input className="nyf-input" type="number" value={editor.carb} onChange={(e) => setEditor({ ...editor, carb: e.target.value })} /></div>
                  <div><label className="nyf-field-label">Fat</label><input className="nyf-input" type="number" value={editor.fat} onChange={(e) => setEditor({ ...editor, fat: e.target.value })} /></div>
                </div>
              </>
            )}

            <div className="nyf-fast-actions">
              <button className="nyf-btn gold" onClick={() => onAdd(editorEntry())}><Plus size={15} /> Add</button>
              <button className="nyf-btn ghost" onClick={() => {
                onAddAndContinue(editorEntry());
                setSelected(null); setEditor(null); setQuery(""); setResults([]);
              }}>Add another</button>
            </div>
            {onSaveMeal && (
              <button className="nyf-link-btn" style={{ display: "block", margin: "10px auto 0" }} onClick={() => onSaveMeal(editorEntry())}>
                <Star size={12} style={{ verticalAlign: "middle" }} /> Save as usual meal
              </button>
            )}
          </div>
        )}

        <details className="nyf-fast-more">
          <summary>More ways to add <ChevronDown size={15} /></summary>

          <div style={{ marginTop: 8 }}>
            <label className="nyf-field-label">Barcode number (fallback)</label>
            <div className="nyf-lookup-row">
              <input className="nyf-input" inputMode="numeric" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Type digits under barcode" />
              <button className="nyf-btn" onClick={() => lookupBarcode()} disabled={!barcode.trim()}><Search size={15} /></button>
            </div>
          </div>

          <div className="nyf-grid2" style={{ marginTop: 8 }}>
            <button className="nyf-btn ghost" onClick={() => cameraInputRef.current?.click()}><Camera size={15} /> Food photo</button>
            <button className="nyf-btn ghost" onClick={() => galleryInputRef.current?.click()}><Camera size={15} /> From gallery</button>
          </div>
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { analyseFoodPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          <input ref={galleryInputRef} type="file" accept="image/*" hidden onChange={(e) => { analyseFoodPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          {photoPreview && <img src={photoPreview} alt="Food preview" style={{ width: "100%", maxHeight: 190, objectFit: "cover", borderRadius: 12, marginTop: 9 }} />}
          {photoStatus && <div className="nyf-fast-status">{photoStatus}</div>}

          <button className="nyf-btn ghost full" style={{ marginTop: 10 }} onClick={() => setManualOpen((value) => !value)}>
            <Pencil size={14} /> Add manually
          </button>

          {manualOpen && (
            <div className="nyf-fast-manual">
              <label className="nyf-field-label">Food name</label>
              <input className="nyf-input" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} placeholder="Food or meal name" />
              <div className="nyf-grid2">
                <div><label className="nyf-field-label">Amount</label><input className="nyf-input" type="number" value={manual.qty} onChange={(e) => setManual({ ...manual, qty: e.target.value })} /></div>
                <div><label className="nyf-field-label">Unit</label><select className="nyf-select" value={manual.unit} onChange={(e) => setManual({ ...manual, unit: e.target.value })}><option value="serving">serving</option><option value="g">g</option><option value="ml">ml</option></select></div>
              </div>
              <div className="nyf-grid2">
                <div><label className="nyf-field-label">Calories</label><input className="nyf-input" type="number" value={manual.cal} onChange={(e) => setManual({ ...manual, cal: e.target.value })} /></div>
                <div><label className="nyf-field-label">Protein</label><input className="nyf-input" type="number" value={manual.protein} onChange={(e) => setManual({ ...manual, protein: e.target.value })} /></div>
                <div><label className="nyf-field-label">Carbs</label><input className="nyf-input" type="number" value={manual.carb} onChange={(e) => setManual({ ...manual, carb: e.target.value })} /></div>
                <div><label className="nyf-field-label">Fat</label><input className="nyf-input" type="number" value={manual.fat} onChange={(e) => setManual({ ...manual, fat: e.target.value })} /></div>
              </div>
              <button className="nyf-btn gold full" disabled={!manual.name.trim() || !manual.cal} onClick={() => onAdd(manualEntry())}><Plus size={15} /> Add to {mealType}</button>
            </div>
          )}
        </details>
      </div>
    </div>
  );
}
