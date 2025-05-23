import { DriveData, DriveAnalysisResult, DriveStatistics } from './types';
import { calculateSafetyScore } from './scoring/safetyScoring';
import { calculateEcoScore } from './scoring/ecoScoring';

/**
 * 주행 데이터를 종합적으로 분석합니다
 * @param driveData 주행 데이터
 * @returns 분석 결과
 */
export function analyzeDriveData(driveData: DriveData): DriveAnalysisResult {
  // 각 부분 점수 계산
  const safetyScore = calculateSafetyScore(driveData);
  const ecoScore = 85; // 예시 값, 실제로는 calculateEcoScore 구현 필요
  const attentionScore = 80; // 예시 값, 실제로는 calculateAttentionScore 구현 필요
  
  // 총점 계산 (각 점수의 가중 평균)
  const totalScore = Math.round(
    0.4 * safetyScore + 0.3 * ecoScore + 0.3 * attentionScore
  );
  
  // 통계 정보 계산
  const statistics = calculateDriveStatistics(driveData);
  
  // 인사이트 및 추천사항 생성
  const insights = ["급가속이 3회 발생했습니다."]; // 간단한 예시
  const recommendations = ["부드럽게 가속하여 연료 효율을 높이세요."]; // 간단한 예시
  
  return {
    driveId: driveData.driveId,
    safetyScore,
    ecoScore,
    attentionScore,
    totalScore,
    statistics,
    insights,
    recommendations
  };
}

/**
 * 주행 통계 정보를 계산합니다
 */
function calculateDriveStatistics(driveData: DriveData): DriveStatistics {
  // 주행 시간 계산 (분)
  const startTime = new Date(driveData.startTime).getTime();
  const endTime = new Date(driveData.endTime).getTime();
  const drivingTime = (endTime - startTime) / (1000 * 60);
  
  // 공회전 시간 계산 (분)
  const idlingTime = driveData.idlingPeriods.reduce(
    (total, period) => total + period.duration / 60, 
    0
  );
  
  return {
    totalDistance: driveData.distance,
    drivingTime,
    idlingTime,
    fuelEfficiency: driveData.fuelConsumption 
      ? driveData.distance / driveData.fuelConsumption 
      : undefined,
    carbonIntensity: (driveData.estimatedCO2 && driveData.distance)
      ? driveData.estimatedCO2 / driveData.distance
      : undefined
  };
}
