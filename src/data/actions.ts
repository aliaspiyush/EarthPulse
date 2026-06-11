import { ActionItem } from '../types';

// CO₂ savings are annual estimates.
// Sources cited per item from Project Drawdown and EPA household carbon calculator (2022-2024).
export const actions: ActionItem[] = [
  {
    id: 1,
    emoji: "🚶",
    title: "Walk/cycle trips under 3km",
    description: "Replace short car trips with walking or cycling for daily errands.",
    kgSavedPerYear: 350,
    // Source: Project Drawdown — walkable cities solution, per-person estimate
    source: "Project Drawdown, walkable cities",
  },
  {
    id: 2,
    emoji: "🌱",
    title: "Meat-free 3 days/week",
    description: "Swap meat meals for plant-based options three days each week.",
    kgSavedPerYear: 480,
    // Source: Our World in Data / Project Drawdown — plant-rich diets
    source: "Project Drawdown, plant-rich diets",
  },
  {
    id: 3,
    emoji: "✈️",
    title: "Skip one flight this year",
    description: "Choose trains or video calls instead of one round-trip flight.",
    kgSavedPerYear: 900,
    // Source: ICCT — average economy round-trip ~900 kg CO₂
    source: "ICCT, average economy round-trip",
  },
  {
    id: 4,
    emoji: "🛁",
    title: "Cold or shorter showers",
    description: "Reduce shower temperature or cut time to under 5 minutes.",
    kgSavedPerYear: 140,
    // Source: EPA Water Sense — reduced hot water usage savings
    source: "EPA Water Sense estimates",
  },
  {
    id: 5,
    emoji: "🛍️",
    title: "No new clothes for 3 months",
    description: "Pause clothing purchases and wear what you already own.",
    kgSavedPerYear: 200,
    // Source: WRAP — clothing carbon footprint reduction
    source: "WRAP, clothing footprint study",
  },
  {
    id: 6,
    emoji: "💡",
    title: "LED + kill standby power",
    description: "Switch all bulbs to LED and unplug devices when not in use.",
    kgSavedPerYear: 180,
    // Source: EPA ENERGY STAR — LED and standby power savings
    source: "EPA ENERGY STAR estimates",
  },
  {
    id: 7,
    emoji: "🍱",
    title: "Zero food waste for a month",
    description: "Plan meals, use leftovers, and compost scraps to eliminate waste.",
    kgSavedPerYear: 120,
    // Source: EPA — food waste reduction per household
    source: "EPA food waste reduction estimates",
  },
  {
    id: 8,
    emoji: "🚌",
    title: "Public transport 4x/week",
    description: "Take the bus or train instead of driving four days a week.",
    kgSavedPerYear: 620,
    // Source: APTA / EPA — public transit vs. single-occupancy vehicle
    source: "APTA/EPA, transit vs. car",
  },
  {
    id: 9,
    emoji: "♻️",
    title: "Compost kitchen waste",
    description: "Divert food scraps from landfill by composting at home.",
    kgSavedPerYear: 90,
    // Source: EPA — composting methane avoidance
    source: "EPA composting methane avoidance",
  },
  {
    id: 10,
    emoji: "🌳",
    title: "Plant 5 trees",
    description: "Each tree absorbs ~20 kg CO₂/yr over its first 10 years.",
    kgSavedPerYear: 100,
    // Source: EPA — urban tree CO₂ sequestration, ~20 kg/tree/yr young tree average
    source: "EPA urban tree sequestration",
  },
  {
    id: 11,
    emoji: "🛒",
    title: "Buy local produce for a month",
    description: "Reduce food transport emissions by choosing local farmers.",
    kgSavedPerYear: 150,
    // Source: Our World in Data — food miles and transport emissions
    source: "Our World in Data, food miles",
  },
  {
    id: 12,
    emoji: "📱",
    title: "Extend phone lifespan by 1 year",
    description: "Keep your current phone longer to avoid manufacturing emissions.",
    kgSavedPerYear: 70,
    // Source: Deloitte / European Environment Bureau — smartphone lifecycle
    source: "EEB, smartphone lifecycle study",
  },
];
