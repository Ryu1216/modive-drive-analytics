import { DriveData } from '../types';

/**
 * 안전 운전 점수를 계산합니다 (0-100)
 * @param driveData 주행 데이터
 * @returns 안전 점수 (0-100)
 */
export function calculateSafetyScore(driveData: DriveData): number {
  // 기본 점수 100점에서 시작
  let score = 100;
  
  // 급가속 페널티 (각 발생당 -3점)
  const accelerationPenalty = driveData.suddenAccelerations.length * 3;
  
  // 급제동 페널티 (각 발생당 -5점)
  const brakingPenalty = driveData.suddenBrakes.length * 5;
  
  // 과속 페널티 계산
  const speedingPenalty = calculateSpeedingPenalty(driveData);
  
  // 총 페널티 적용 (최대 100점까지만 감점)
  score = Math.max(0, score - accelerationPenalty - brakingPenalty - speedingPenalty);
  
  return score;
}

/**
 * 과속 페널티를 계산합니다
 */
function calculateSpeedingPenalty(driveData: DriveData): number {
  if (driveData.maxSpeed > 130) return 30;
  if (driveData.maxSpeed > 110) return 20;
  if (driveData.maxSpeed > 90) return 10;
  
  return 0;
}