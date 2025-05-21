export type AnalysisDataItem = {
  label: string;
  value: number;
  color: string;
};

export type DrivingAnalysis = {
  title: string;
  summary: string;
  data: AnalysisDataItem[];
};

export type DrivingTip = {
  text: string;
};

export type DrivingRecommendations = {
  summary: string;
  tips: DrivingTip[];
};

