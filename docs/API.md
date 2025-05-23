# Modive Drive Analytics API 문서

## 목차

- 개요
- 패키지 구조
- Core 라이브러리 API
- CLI 도구 API
- React Native 바인딩 API
- 인터페이스 및 타입 정의
- 예제 코드

## 개요

Modive Drive Analytics는 주행 데이터를 분석하여 안전 운전 점수와 개선 방안을 제공하는 라이브러리입니다. 이 API 문서는 Modive Drive Analytics의 주요 패키지와 함수, 데이터 타입을 설명합니다.

## 패키지 구조

Modive Drive Analytics는 다음 세 가지 주요 패키지로 구성되어 있습니다:

1. **@modive/core**: 주행 데이터 분석을 위한 핵심 알고리즘 라이브러리
2. **@modive/cli**: 명령줄에서 주행 데이터를 분석할 수 있는 도구
3. **@modive/react-native**: React Native 앱에서 사용할 수 있는 바인딩

## Core 라이브러리 API

### analyzeDriveData(driveData)

주행 데이터를 종합적으로 분석하여 안전 점수, 친환경 점수, 주의력 점수 등 다양한 지표를 계산합니다.

```typescript
import { analyzeDriveData } from '@modive/core';

function analyzeDriveData(driveData: DriveData): DriveAnalysisResult;
```

**매개변수:**
- `driveData`: DriveData - 분석할 주행 데이터 객체

**반환값:**
- `DriveAnalysisResult` - 분석 결과를 포함하는 객체

**예제:**
```typescript
const analysis = analyzeDriveData(driveData);
console.log(`안전 점수: ${analysis.safetyScore}/100`);
```

### calculateSafetyScore(driveData)

주행 데이터를 기반으로 안전 운전 점수만을 계산합니다.

```typescript
import { calculateSafetyScore } from '@modive/core';

function calculateSafetyScore(driveData: DriveData): number;
```

**매개변수:**
- `driveData`: DriveData - 안전 점수를 계산할 주행 데이터 객체

**반환값:**
- `number` - 0부터 100까지의 안전 운전 점수

**내부 동작:**
- 급가속, 급제동, 과속 등의 위험 요소를 감지하여 기본 점수(100점)에서 차감하는 방식으로 계산합니다.
- 급가속은 발생당 -3점, 급제동은 발생당 -5점 차감됩니다.
- 최대 속도에 따라 추가 페널티가 적용됩니다(130km/h 초과: -30점, 110km/h 초과: -20점, 90km/h 초과: -10점).

## CLI 도구 API

CLI 도구는 터미널에서 JSON 형식의 주행 데이터 파일을 분석하는 기능을 제공합니다.

### analyze 명령어

```bash
modive analyze <file> [options]
```

**매개변수:**
- `<file>`: 분석할 JSON 주행 데이터 파일 경로

**옵션:**
- `-o, --output <file>`: 분석 결과를 저장할 파일 경로

**예제:**
```bash
# 주행 데이터 분석 후 콘솔에 결과 출력
modive analyze drive-data.json

# 주행 데이터 분석 후 파일로 결과 저장
modive analyze drive-data.json --output analysis.json
```

## React Native 바인딩 API

### startDriveTracking()

주행 데이터 수집을 시작합니다.

```typescript
import { startDriveTracking } from '@modive/react-native';

function startDriveTracking(): Promise<void>;
```

**반환값:**
- `Promise<void>` - 추적 시작이 성공하면 해결되는 프로미스

### stopDriveTracking()

주행 데이터 수집을 중지하고 수집된 데이터를 반환합니다.

```typescript
import { stopDriveTracking } from '@modive/react-native';

function stopDriveTracking(): Promise<DriveData>;
```

**반환값:**
- `Promise<DriveData>` - 수집된 주행 데이터를 포함하는 프로미스

### analyzeDriveData(data)

네이티브 모듈을 통해 주행 데이터를 분석합니다.

```typescript
import { analyzeDriveData } from '@modive/react-native';

function analyzeDriveData(data: DriveData): Promise<DriveAnalysisResult>;
```

**매개변수:**
- `data`: DriveData - 분석할 주행 데이터 객체

**반환값:**
- `Promise<DriveAnalysisResult>` - 분석 결과를 포함하는 프로미스

### subscribeToDriveEvents(callback)

주행 중 실시간 이벤트를 구독합니다.

```typescript
import { subscribeToDriveEvents } from '@modive/react-native';

function subscribeToDriveEvents(callback: (event: any) => void): () => void;
```

**매개변수:**
- `callback`: (event: any) => void - 이벤트가 발생할 때 호출될 콜백 함수

**반환값:**
- `() => void` - 이벤트 구독을 해제하는 함수

## 인터페이스 및 타입 정의

### DriveData

주행 데이터를 나타내는 인터페이스입니다.

```typescript
interface DriveData {
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
```

### SpeedDataPoint

주행 중 속도 데이터를 나타내는 인터페이스입니다.

```typescript
interface SpeedDataPoint {
  timestamp: string;
  speed: number;
  latitude?: number;
  longitude?: number;
}
```

### IdlingPeriod

공회전 기간을 나타내는 인터페이스입니다.

```typescript
interface IdlingPeriod {
  startTime: string;
  endTime: string;
  duration: number; // 초 단위
}
```

### DriveAnalysisResult

주행 분석 결과를 나타내는 인터페이스입니다.

```typescript
interface DriveAnalysisResult {
  driveId: string;
  safetyScore: number; // 0-100
  ecoScore: number; // 0-100
  attentionScore: number; // 0-100
  totalScore: number; // 0-100
  statistics: DriveStatistics;
  insights: string[];
  recommendations: string[];
}
```

### DriveStatistics

주행 통계 정보를 나타내는 인터페이스입니다.

```typescript
interface DriveStatistics {
  totalDistance: number;
  drivingTime: number; // 분 단위
  idlingTime: number; // 분 단위
  fuelEfficiency?: number; // km/L
  carbonIntensity?: number; // g/km
}
```

## 예제 코드

### Node.js 환경에서 사용하기

```javascript
const { analyzeDriveData } = require('@modive/core');
const fs = require('fs');

// JSON 파일에서 주행 데이터 로드
const driveData = JSON.parse(fs.readFileSync('drive-data.json', 'utf8'));

// 데이터 분석
const analysis = analyzeDriveData(driveData);

// 결과 출력
console.log('==== 주행 분석 결과 ====');
console.log(`안전 점수: ${analysis.safetyScore}/100`);
console.log(`친환경 점수: ${analysis.ecoScore}/100`);
console.log(`주의력 점수: ${analysis.attentionScore}/100`);
console.log(`종합 점수: ${analysis.totalScore}/100`);

// 인사이트 및 추천사항 출력
console.log('\n==== 주행 인사이트 ====');
analysis.insights.forEach((insight, i) => console.log(`${i+1}. ${insight}`));

console.log('\n==== 개선 제안 ====');
analysis.recommendations.forEach((rec, i) => console.log(`${i+1}. ${rec}`));
```

### React Native 앱에서 사용하기

```jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { startDriveTracking, stopDriveTracking, analyzeDriveData } from '@modive/react-native';

function DrivingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleStartDriving = async () => {
    setIsTracking(true);
    await startDriveTracking();
  };

  const handleStopDriving = async () => {
    setIsTracking(false);
    const driveData = await stopDriveTracking();
    const result = await analyzeDriveData(driveData);
    setAnalysisResult(result);
  };

  return (
    <View>
      {isTracking ? (
        <Button title="주행 종료" onPress={handleStopDriving} />
      ) : (
        <Button title="주행 시작" onPress={handleStartDriving} />
      )}

      {analysisResult && (
        <View>
          <Text>안전 점수: {analysisResult.safetyScore}</Text>
          <Text>친환경 점수: {analysisResult.ecoScore}</Text>
          <Text>종합 점수: {analysisResult.totalScore}</Text>
        </View>
      )}
    </View>
  );
}
```

### 실시간 이벤트 구독 예제

```jsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { subscribeToDriveEvents } from '@modive/react-native';

function DriveEventMonitor() {
  useEffect(() => {
    // 이벤트 구독
    const unsubscribe = subscribeToDriveEvents((event) => {
      console.log('주행 이벤트 발생:', event);
      
      // 이벤트 유형에 따른 처리
      if (event.type === 'sudden_acceleration') {
        alert('급가속이 감지되었습니다!');
      } else if (event.type === 'sudden_brake') {
        alert('급제동이 감지되었습니다!');
      }
    });
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);
  
  return (
    <View>
      <Text>주행 이벤트 모니터링 중...</Text>
    </View>
  );
}
```
