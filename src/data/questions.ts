import { QuizQuestion } from '../types';

// CO₂ emission values are annual per-capita approximations.
// Sources: IPCC AR6 (2022), Our World in Data, EPA household estimates.
export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "How do you usually commute?",
    answers: [
      { text: "Walk or cycle", kgPerYear: 0 },
      // Source: IPCC AR6 — average public transit ~800 kg CO₂/yr per regular commuter
      { text: "Public transport", kgPerYear: 800 },
      // Source: EPA — avg car emits ~4.6 metric tons/yr; commute portion ~2400 kg
      { text: "Car (petrol/diesel)", kgPerYear: 2400 },
      // Source: ICCT — weekly short-haul flights ~9200 kg CO₂/yr
      { text: "Flight weekly", kgPerYear: 9200 },
    ],
  },
  {
    id: 2,
    question: "What's your diet like?",
    answers: [
      // Source: Our World in Data — plant-based diet ~1000 kg CO₂/yr food emissions
      { text: "Mostly plant-based", kgPerYear: 1000 },
      // Source: Our World in Data — average mixed diet ~1700 kg CO₂/yr
      { text: "Mixed, some meat", kgPerYear: 1700 },
      // Source: Our World in Data — high beef/lamb diet ~3300 kg CO₂/yr
      { text: "Heavy on beef & lamb", kgPerYear: 3300 },
      // Source: EPA estimates — fast food daily including packaging/transport ~2500 kg/yr
      { text: "Fast food daily", kgPerYear: 2500 },
    ],
  },
  {
    id: 3,
    question: "How often do you fly?",
    answers: [
      { text: "Never", kgPerYear: 0 },
      // Source: ICCT — 1-2 round trips/year economy class ~700 kg CO₂
      { text: "1–2 times a year", kgPerYear: 700 },
      // Source: ICCT — monthly flights ~4200 kg CO₂/yr
      { text: "Monthly", kgPerYear: 4200 },
      // Source: ICCT — weekly flights ~16800 kg CO₂/yr
      { text: "Weekly", kgPerYear: 16800 },
    ],
  },
  {
    id: 4,
    question: "Your home energy:",
    answers: [
      // Source: EPA — renewable/solar home ~200 kg residual CO₂/yr
      { text: "Renewable / solar", kgPerYear: 200 },
      // Source: EPA — standard grid efficient use ~1200 kg CO₂/yr
      { text: "Standard grid, efficient", kgPerYear: 1200 },
      // Source: EPA — standard grid wasteful use ~2800 kg CO₂/yr
      { text: "Standard grid, wasteful", kgPerYear: 2800 },
      // Source: EPA — heavy AC usage ~4200 kg CO₂/yr
      { text: "AC running 24/7", kgPerYear: 4200 },
    ],
  },
  {
    id: 5,
    question: "Shopping habits:",
    answers: [
      // Source: WRAP/Project Drawdown — minimal consumption ~300 kg CO₂/yr
      { text: "Only what I need", kgPerYear: 300 },
      // Source: WRAP — occasional impulse buying ~600 kg CO₂/yr
      { text: "Occasional impulse buys", kgPerYear: 600 },
      // Source: WRAP — weekly online shopping ~1200 kg CO₂/yr
      { text: "Online shopping weekly", kgPerYear: 1200 },
      // Source: WRAP/Quantis — fast fashion regularly ~1800 kg CO₂/yr
      { text: "Fast fashion regularly", kgPerYear: 1800 },
    ],
  },
  {
    id: 6,
    question: "Food waste:",
    answers: [
      // Source: EPA — minimal food waste ~100 kg CO₂-eq/yr
      { text: "Almost none", kgPerYear: 100 },
      // Source: EPA — some food waste ~400 kg CO₂-eq/yr
      { text: "Some waste", kgPerYear: 400 },
      // Source: EPA — ~half food wasted ~800 kg CO₂-eq/yr
      { text: "About half gets wasted", kgPerYear: 800 },
      // Source: EPA — most food wasted ~1200 kg CO₂-eq/yr
      { text: "Most goes to the bin", kgPerYear: 1200 },
    ],
  },
  {
    id: 7,
    question: "Do you actively offset or reduce?",
    answers: [
      // Source: Gold Standard/Project Drawdown — active offsetting reduces ~800 kg/yr
      { text: "Yes, regularly", kgPerYear: -800 },
      // Source: Approximate — occasional efforts ~-300 kg/yr
      { text: "Sometimes", kgPerYear: -300 },
      { text: "Rarely", kgPerYear: 0 },
      // Source: Approximate — no awareness adds ~200 kg/yr from wasteful defaults
      { text: "Never thought about it", kgPerYear: 200 },
    ],
  },
];
