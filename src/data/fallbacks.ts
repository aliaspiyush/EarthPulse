import { GeminiResponse, Tier } from '../types';

// Fallback analogies for when Gemini API is unavailable.
// These are conservative, factual comparisons.
export const FALLBACK_ANALOGIES: Record<NonNullable<Tier>, GeminiResponse> = {
  EcoGuardian: {
    analogies: [
      "That's lighter than a round-trip train ride across Europe.",
      "Imagine a small campfire burning for just two weeks — that's your year.",
      "You'd need a closet-sized room to hold that much gas.",
    ],
    oneChange: "Keep inspiring others — share one green habit with a friend this week.",
    hopeAnalogy: "If everyone lived like you, the sky would start clearing within a decade.",
  },
  "Aware Citizen": {
    analogies: [
      "That weighs as much as a small car sitting on the atmosphere.",
      "Picture filling your living room floor-to-ceiling with invisible gas — twice.",
      "It's like running a gas stove non-stop for five months straight.",
    ],
    oneChange: "Try one meat-free day each week — it cuts more than you'd expect.",
    hopeAnalogy: "You're already below the global average — small shifts from here ripple far.",
  },
  "Average Impact": {
    analogies: [
      "That's heavier than two adult elephants standing on a scale.",
      "Imagine a balloon the size of your entire house filled with exhaust.",
      "It would take 400 young trees a full year to absorb what you emit.",
    ],
    oneChange: "Switch your five shortest car trips each week to walking.",
    hopeAnalogy: "Cutting just 20% would drop you below the global average — that's one habit away.",
  },
  "Heavy Footprint": {
    analogies: [
      "That's like driving a truck around the Earth's equator — every year.",
      "You'd need a warehouse to store the invisible weight you're adding to the sky.",
      "It takes a small forest of 700 trees working all year to offset that.",
    ],
    oneChange: "Replace one weekly flight with a video call — it saves a ton, literally.",
    hopeAnalogy: "The heaviest footprints have the most room for dramatic, visible change.",
  },
};
