export interface DriveHistoryItem {
  driveId: string;
  date: string;
  startTime: string;
  endTime: string;
  summaryScore: number;
}

// 주행 상세 화면에 필요한 타입 정의
export interface DrivingScoreItem {
  name: string;
  value: number;
  color: string;
}

export interface DrivingDetailData {
  date: string;
  time: string;
  totalScore: number;
  scores: DrivingScoreItem[];
  message: string;
}

// 네비게이션 타입
export type DrivingStackParamList = {
  DrivingHistory: undefined;
  Driving: undefined;
  DrivingDetail: { drivingId: string };
  SafetyReport: undefined;
  CarbonEmissionReport: undefined;
  AccidentPreventionReport: undefined;
  AttentionScoreReport: undefined;
};