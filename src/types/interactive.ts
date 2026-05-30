export type ComponentType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "flashcard"
  | "matching"
  | "sorting"
  | "categorize"
  | "concept_slider"
  | "timeline"
  | "hotspot"
  | "free_response"
  | "branching_scenario";

export type MultipleChoiceData = {
  type: "multiple_choice";
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type TrueFalseData = {
  type: "true_false";
  statement: string;
  answer: boolean;
  explanation?: string;
};

export type FillBlankData = {
  type: "fill_blank";
  text: string;
  answers: string[];
  acceptable?: string[][];
};

export type FlashcardData = {
  type: "flashcard";
  front: string;
  back: string;
};

export type MatchingData = {
  type: "matching";
  pairs: { left: string; right: string }[];
};

export type SortingData = {
  type: "sorting";
  items: string[];
  correctOrder: number[];
};

export type CategorizeData = {
  type: "categorize";
  items: string[];
  categories: string[];
  mapping: Record<string, number>;
};

export type ConceptSliderData = {
  type: "concept_slider";
  label: string;
  min: number;
  max: number;
  step?: number;
  initial: number;
  unit?: string;
  description?: string;
  correctValue?: number;
};

export type TimelineData = {
  type: "timeline";
  events: { label: string; year: string; description?: string }[];
  interactive?: boolean;
};

export type HotspotData = {
  type: "hotspot";
  question: string;
  diagramLabel: string;
  regions: { label: string; id: string; x: number; y: number; width: number; height: number }[];
  correctId: string;
  explanation?: string;
};

export type FreeResponseData = {
  type: "free_response";
  prompt: string;
  minWords?: number;
  placeholder?: string;
  rubric?: string[];
};

export type BranchingScenarioData = {
  type: "branching_scenario";
  title?: string;
  scenario: string;
  choices: { id: string; text: string; outcome: string }[];
};

export type InteractiveComponentData =
  | MultipleChoiceData
  | TrueFalseData
  | FillBlankData
  | FlashcardData
  | MatchingData
  | SortingData
  | CategorizeData
  | ConceptSliderData
  | TimelineData
  | HotspotData
  | FreeResponseData
  | BranchingScenarioData;
