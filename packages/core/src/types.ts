/**
 * 주행 데이터 인터페이스
 */
export interface DriveData {
  driveId: string;
  startTime: string;
  endTime: string;
  distance: number;
  averageSpeed: number;
  maxSpeed: number;
  speedData: SpeedDataPoint[];
  suddenAccelerations: string[];
  suddenBrakes: string[];
  idlingPeriods: IdlingPeriod[];
  fuelConsumption?: number;
  estimatedCO2?: number;
}

export interface SpeedDataPoint {
  timestamp: string;
  speed: number;
  latitude?: number;
  longitude?: number;
}

export interface IdlingPeriod {
  startTime: string;
  endTime: string;
  duration: number; // seconds
}

/**
 * 주행 분석 결과 인터페이스
 */
export interface DriveAnalysisResult {
  driveId: string;
  safetyScore: number; // 0-100
  ecoScore: number; // 0-100
  attentionScore: number; // 0-100
  totalScore: number; // 0-100
  statistics: DriveStatistics;
  insights: string[];
  recommendations: string[];
}

export interface DriveStatistics {
  totalDistance: number;
  drivingTime: number; // minutes
  idlingTime: number; // minutes
  fuelEfficiency?: number; // km/L
  carbonIntensity?: number; // g/km
}