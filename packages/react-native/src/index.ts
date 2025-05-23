import { NativeModules, NativeEventEmitter } from 'react-native';
import { DriveData, DriveAnalysisResult } from '@modive/core';

const { ModiveDriveModule } = NativeModules;
const driveEventEmitter = new NativeEventEmitter(ModiveDriveModule);

export function startDriveTracking(): Promise<void> {
  return ModiveDriveModule?.startTracking() || Promise.reject('Native module not found');
}

export function stopDriveTracking(): Promise<DriveData> {
  return ModiveDriveModule?.stopTracking() || Promise.reject('Native module not found');
}

export function analyzeDriveData(data: DriveData): Promise<DriveAnalysisResult> {
  return ModiveDriveModule?.analyzeData(data) || Promise.reject('Native module not found');
}

export function subscribeToDriveEvents(
  callback: (event: any) => void
): () => void {
  const subscription = driveEventEmitter.addListener('DriveEvent', callback);
  return () => subscription.remove();
}

// 코어 라이브러리의 함수들을 재내보내기
export * from '@modive/core';