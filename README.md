# Modive Drive Analytics (모디브 드라이브 애널리틱스)

![Modive Logo](src/assets/modive_logo.svg)

[![npm version](https://img.shields.io/npm/v/@modive/core.svg)](https://www.npmjs.com/package/@modive/core)


## 프로젝트 소개

모디브 드라이브 애널리틱스는 운전 데이터를 분석하여 안전 운전 점수와 맞춤형 피드백을 제공하는 라이브러리 및 CLI 도구입니다. 기존 React Native 앱의 핵심 기능을 재사용 가능한 독립 패키지로 추출하여, 다양한 환경에서 활용할 수 있도록 개선했습니다.

> "운전의 패턴을 읽고, 데이터로 말하다."

## 해결하는 문제

모디브 드라이브 애널리틱스는 다음과 같은 문제를 해결합니다:

1. **안전 운전 분석**: 가속, 제동, 코너링 데이터를 분석하여 운전자의 안전 점수를 계산합니다
2. **친환경 운전 평가**: 연료 효율과 탄소 배출량을 분석하여 환경 영향을 평가합니다
3. **사고 위험 예측**: 위험 운전 패턴을 감지하여 사고 가능성을 예측합니다
4. **주행 데이터 시각화**: 분석 결과를 이해하기 쉬운 시각적 자료로 제공합니다
5. **운전 습관 개선 가이드**: 개인화된 피드백과 개선 방안을 제시합니다

## 프로젝트 구조

이 프로젝트는 모노레포 구조로 설계되어 다음 패키지들로 구성되어 있습니다:

```
modive-drive-analytics/
├── packages/
│   ├── core/           # 핵심 분석 알고리즘 라이브러리
│   ├── cli/            # 명령줄 인터페이스 도구
│   └── react-native/   # React Native 바인딩
├── examples/           # 예제 코드
├── tests/              # 테스트 코드
└── docs/               # 문서
```

### 핵심 패키지 설명

#### 1. Core (@modive/core)
- 주행 데이터 분석을 위한 핵심 알고리즘 제공
- 안전 점수, 친환경 점수, 주의력 점수 계산
- TypeScript로 작성되어 타입 안전성 보장
- Node.js 및 브라우저 환경에서 사용 가능

#### 2. CLI (@modive/cli)
- 명령줄에서 주행 데이터 분석 가능
- JSON 형식의 주행 데이터 입력 처리
- 분석 결과를 다양한 형식으로 출력
- 직관적인 명령어 인터페이스 제공

#### 3. React Native (@modive/react-native)
- React Native 앱에서 주행 데이터 분석 기능을 쉽게 통합
- 네이티브 모듈 브릿징으로 효율적인 성능 제공
- 실시간 주행 데이터 처리 지원

## 핵심 기능

### 안전 운전 점수 계산 시스템

안전 운전 점수는 모디브의 가장 중요한 핵심 기능입니다. 본 시스템은 주행 중 다음과 같은 요소를 분석하여 정밀한 점수를 산출합니다:

- **급가속 감지**: 초당 속도 변화율을 모니터링하여 과도한 가속 패턴을 식별합니다. 특히 신호 출발 시 급가속은 연료 낭비와 안전 위험을 동시에 증가시킵니다.

- **급제동 분석**: 갑작스러운 제동을 감지하고 그 심각도를 정량화합니다. 이는 전방 주시 태만이나 안전거리 미확보의 지표가 됩니다.

- **과속 모니터링**: GPS 데이터와 지도 정보를 결합하여 도로 제한 속도 대비 운전자의 속도 패턴을 분석합니다.

- **코너링 분석**: 회전 시 원심력과 조향각을 고려하여 과도한 코너링을 탐지합니다.

이러한 요소들을 가중치 모델에 적용하여 100점 만점의 객관적인 안전 점수를 산출합니다:

```typescript
import { calculateSafetyScore } from '@modive/core';

const safetyScore = calculateSafetyScore(drivingData);
console.log(`안전 운전 점수: ${safetyScore}/100`);
```

### 종합적 주행 데이터 분석 프레임워크

단일 지표가 아닌 다차원적 분석을 통해 운전 패턴을 종합적으로 평가합니다:

- **시간별 패턴 분석**: 주간/야간 운전, 출퇴근 시간대, 주말 운전 등 시간대별 특성을 고려하여 맥락화된 분석을 제공합니다.

- **주행 환경 컨텍스트**: 도심, 고속도로, 산간 도로 등 주행 환경에 따라 다른 평가 기준을 적용합니다.

- **통계적 이상치 감지**: 개인별 운전 패턴을 학습하여 평소와 다른 위험 패턴 발생 시 이를 감지합니다.

- **운전자 피로도 추정**: 장시간 운전, 조작 패턴 변화 등을 통해 운전자 피로도를 간접적으로 추정합니다.

```typescript
import { analyzeDriveData } from '@modive/core';

const analysisResult = analyzeDriveData(drivingData);
console.log(`종합 점수: ${analysisResult.totalScore}/100`);
console.log(`주행 거리: ${analysisResult.statistics.totalDistance}km`);
```

### 적응형 운전 습관 개선 시스템

분석된 데이터를 기반으로 개인별 맞춤형 개선 방안을 제시합니다:

- **우선순위 기반 제안**: 가장 개선이 필요한 운전 습관에 집중하여 제안합니다.

- **점진적 개선 목표**: 현실적으로 달성 가능한 단계별 개선 목표를 설정합니다.

- **비교 분석**: 유사한 조건의 다른 운전자 데이터와 비교하여 상대적인 위치를 파악할 수 있도록 합니다.

- **실행 가능한 구체적 조언**: 막연한 권고가 아닌, 실제로 실행할 수 있는 구체적인 운전 습관 개선 방법을 제시합니다.

```typescript
const recommendations = analysisResult.recommendations;
recommendations.forEach((tip, index) => {
  console.log(`${index + 1}. ${tip}`);
});
```

## 설치 방법

### 코어 라이브러리 설치
```bash
npm install @modive/core
# 또는
yarn add @modive/core
```

### CLI 도구 전역 설치
```bash
npm install -g @modive/cli
# 또는
yarn global add @modive/cli
```

### React Native 바인딩 설치
```bash
npm install @modive/react-native
# 또는
yarn add @modive/react-native
```

## 사용 예제

### 1. Node.js 환경에서 사용하기

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

// 인사이트 출력
console.log('\n==== 주행 인사이트 ====');
analysis.insights.forEach((insight, i) => console.log(`${i+1}. ${insight}`));

// 추천사항 출력
console.log('\n==== 개선 제안 ====');
analysis.recommendations.forEach((rec, i) => console.log(`${i+1}. ${rec}`));
```

### 2. CLI 도구 사용하기

```bash
# 주행 데이터 분석
modive analyze drive-data.json

# 분석 결과 파일로 저장
modive analyze drive-data.json --output analysis.json
```

### 3. React Native 앱에서 사용하기

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

## 개발 환경 설정

### 저장소 클론
```bash
git clone https://github.com/yourusername/modive-drive-analytics.git
cd modive-drive-analytics
```

### 의존성 설치
```bash
npm install
```

### 모든 패키지 빌드
```bash
npm run build
```

### 테스트 실행
```bash
npm test
```

## 테스트 및 품질 관리

이 프로젝트는 다양한 테스트와 품질 관리 도구를 활용하여 코드 신뢰성을 보장합니다:

- **단위 테스트**: Jest를 활용한 개별 함수 및 컴포넌트 테스트
- **통합 테스트**: 전체 패키지 기능 테스트
- **린트 검사**: ESLint와 TypeScript를 통한 코드 품질 관리
- **CI/CD**: GitHub Actions를 통한 자동 테스트 및 배포

## API 문서

자세한 API 문서는 docs/API.md 파일에서 확인할 수 있습니다.
