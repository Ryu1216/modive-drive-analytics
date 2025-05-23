import { calculateSafetyScore } from '../../packages/core/src/scoring/safetyScoring';
import { DriveData } from '../../packages/core/src/types';

describe('Safety Scoring', () => {
  const mockDriveData: DriveData = {
    driveId: 'test-drive-1',
    startTime: '2025-05-23T08:00:00Z',
    endTime: '2025-05-23T09:00:00Z',
    distance: 50,
    averageSpeed: 50,
    maxSpeed: 80,
    speedData: [],
    suddenAccelerations: [],
    suddenBrakes: [],
    idlingPeriods: [],
  };

  test('should return maximum score for perfect driving', () => {
    expect(calculateSafetyScore(mockDriveData)).toBe(100);
  });

  test('should penalize for sudden accelerations', () => {
    const dataWithAccelerations = {
      ...mockDriveData,
      suddenAccelerations: ['2025-05-23T08:10:00Z', '2025-05-23T08:20:00Z']
    };
    
    expect(calculateSafetyScore(dataWithAccelerations)).toBe(94); // 100 - (2*3)
  });

  test('should penalize for sudden brakes', () => {
    const dataWithBrakes = {
      ...mockDriveData,
      suddenBrakes: ['2025-05-23T08:15:00Z']
    };
    
    expect(calculateSafetyScore(dataWithBrakes)).toBe(95); // 100 - (1*5)
  });

  test('should penalize for high speeds', () => {
    const dataWithHighSpeed = {
      ...mockDriveData,
      maxSpeed: 115
    };
    
    expect(calculateSafetyScore(dataWithHighSpeed)).toBe(80); // 100 - 20
  });
});