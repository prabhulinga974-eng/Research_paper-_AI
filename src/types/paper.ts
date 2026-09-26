export interface SamplePaper {
  id: string;
  title: string;
  authors: string;
  year: string;
  url: string;
  tag: string;
}

export interface ComponentBreakdown {
  component: string;
  role: string;
  inputsOutputs: string;
}

export interface RoadmapWeek {
  week: string;
  milestone: string;
  tasks: string;
}

export interface StudentOpportunity {
  id: string;
  title: string;
  exactExtension: string;
  targetedMetric: string;
  recommendedTechStack: string[];
  difficulty: "Beginner-Friendly" | "Intermediate" | "Challenging" | "Advanced";
  estimatedWeeks: number;
  whyGreatForResume: string;
  fourWeekRoadmap: RoadmapWeek[];
  resumeBulletSTAR: string;
  starterCodeSnippet: string;
}

export interface PaperDetails {
  title: string;
  authors: string;
  year: string;
  venueOrArxiv: string;
  url: string;
  oneLineTakeaway: string;
}

export interface CoreConcept {
  problemStatement: string;
  primaryMethodology: string;
  keyBreakthroughs: string[];
  accessibleSynthesis: string;
  wordCount: number;
}

export interface FlowchartData {
  mermaidCode: string;
  componentBreakdown: ComponentBreakdown[];
}

export interface TokenEfficiencyBadge {
  estimatedAnalysisTokens: number;
  maxTokenBudget: number;
  budgetAdherence: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface PaperAnalysis {
  id?: string;
  timestamp?: number;
  paperDetails: PaperDetails;
  coreConcept: CoreConcept;
  flowchart: FlowchartData;
  studentOpportunities: StudentOpportunity[];
  tokenEfficiencyBadge: TokenEfficiencyBadge;
  grounding?: {
    queries?: string[];
    sources?: GroundingSource[];
  };
  usage?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}
