import React, { useState, useEffect, useMemo, useRef } from "react";
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
