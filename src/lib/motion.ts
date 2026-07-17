export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  medium: 0.6,
  slow: 0.8,
  reveal: 1,
  entrance: 1.2,
} as const;

export const STAGGER = {
  fast: 0.03,
  normal: 0.06,
  cards: 0.08,
  rows: 0.1,
} as const;

export const EASE = {
  default: "power3.out",
  smooth: "power2.out",
  bounce: "back.out(1.4)",
  spring: "elastic.out(1, 0.4)",
  smoothIn: "power2.inOut",
} as const;

export const DISTANCE = {
  micro: 8,
  small: 15,
  medium: 25,
  large: 40,
  xl: 60,
} as const;
