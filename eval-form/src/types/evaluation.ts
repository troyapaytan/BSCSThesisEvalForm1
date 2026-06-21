export interface Sentence {
  row_number: number;
  Original: string;
  Modern: string;
  Period: 'pre-tagalog' | 'tagalog' | 'pilipino' | 'filipino';
}

export interface EvaluationScores {
  linguisticAccuracy: number;
  culturalAuthenticity: number;
  comprehensibility: number;
  completeness: number;
}

export interface ErrorAnalysisData {
  linguisticError: boolean;
  culturalMisrepresentation: boolean;
  comprehensibilityIssue: boolean;
  temporalMisalignment: boolean;
  notes: string;
}

export interface SentenceEvaluation {
  sentence: Sentence;
  scores: EvaluationScores;
  averageScore: number;
  errorAnalysis?: ErrorAnalysisData;
  timestamp: string;
}

export interface EvaluatorInfo {
  name: string;
  affiliation: string;
}

export const LIKERT_LABELS: Record<number, string> = {
  1: 'Napakahina',
  2: 'Mababa',
  3: 'Katanggap-tanggap',
  4: 'Mabuti',
  5: 'Napakahusay',
};

export const PERIOD_LABELS: Record<Sentence['Period'], string> = {
  'pre-tagalog': 'Pre-Tagalog',
  'tagalog': 'Tagalog (Bago ang 1959)',
  'pilipino': 'Pilipino (1959–1986)',
  'filipino': 'Filipino (1987–Kasalukuyan)',
};

export const PERIOD_COLORS: Record<Sentence['Period'], string> = {
  'pre-tagalog': '#d97706',
  'tagalog': '#059669',
  'pilipino': '#2563eb',
  'filipino': '#7c3aed',
};

export const CRITERIA = [
  {
    key: 'linguisticAccuracy' as const,
    label: 'Wastong Lingguwistika',
    description: 'Tama ba ang bokabularyo at gramatika ng makabagong interpretasyon?',
  },
  {
    key: 'culturalAuthenticity' as const,
    label: 'Kultural na Awtentisidad',
    description: 'Napangalagaan ba ang mga kultural na detalye at kontekstong pangkasaysayan?',
  },
  {
    key: 'comprehensibility' as const,
    label: 'Kakayahang Maunawaan',
    description: 'Malinaw at madaling maunawaan ba ang interpretasyon para sa isang modernong mambabasang Filipino?',
  },
  {
    key: 'completeness' as const,
    label: 'Kabuuan',
    description: 'Sapat bang nasaklaw ang lahat ng mahahalagang aspeto at kahulugan ng orihinal na teksto?',
  },
];

export const ERROR_CATEGORIES = [
  {
    key: 'linguisticError' as const,
    label: 'Maling Lingguwistika',
    description: 'Maling kahulugan ng bokabularyo o maling interpretasyon sa gramatika',
  },
  {
    key: 'culturalMisrepresentation' as const,
    label: 'Maling Kultural na Paglalarawan',
    description: 'Hindi angkop na konteksto o mga kamalian sa pangkasaysayang kahulugan',
  },
  {
    key: 'comprehensibilityIssue' as const,
    label: 'Suliranin sa Pag-unawa',
    description: 'Masyado pa ring kumplikado o hindi malinaw ang modernong teksto',
  },
  {
    key: 'temporalMisalignment' as const,
    label: 'Maling Ugnayang Panahon',
    description: 'Maling interpretasyon na angkop lamang sa ibang panahon o paggamit ng makabagong salita na hindi akma sa panahon (anachronistic)',
  },
];
