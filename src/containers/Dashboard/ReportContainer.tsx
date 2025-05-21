import React, {useState} from 'react';
import {DrivingAnalysis, DrivingRecommendations} from '../../types/report';
import ReportScreen from '../../screens/Dashboard/ReportScreen';

export default function ReportContainer() {
  const [analysis, setAnalysis] = useState<DrivingAnalysis>({
    title: '주행 분석 결과',
    summary:
      '홍길동님의 지난 1주일 주행 데이터를 분석한 결과, 급가속/급감속 비율이 15%로 나타났습니다. 이는 평균보다 5% 높은 수치로, 이 부분을 개선하면 연비 향상에 큰 도움이 될 것입니다. 또한, 정속 주행 비율이 40%로 목표치(60%)보다 낮습니다.',
    data: [
      {
        label: '급가속/급감속',
        value: 15,
        color: '#F47F6B',
      },
      {
        label: '정속 주행',
        value: 40,
        color: '#F6A43C',
      },
      {
        label: '공회전',
        value: 8,
        color: '#68C179',
      },
    ],
  });
  const [recommendations, setRecommendations] =
    useState<DrivingRecommendations>({
      summary:
        '부드럽게 가속하고 미리 감속하는 습관을 들이면 연비가 최대 7% 개선될 수 있습니다. 특히 출발 시 첫 5초 동안 천천히 가속하는 것이 중요합니다.',
      tips: [
        {
          text: '크루즈 컨트롤을 활용하여 정속 주행 비율을 높이세요. **월 주유비 약 8,000원 절감 효과**가 있습니다.',
        },
        {
          text: '신호등에 접근할 때 미리 엑셀에서 발을 떼고 감속하면 연료 소비를 줄일 수 있습니다. **도심 주행 시 연비 5% 향상** 효과가 있습니다.',
        },
        {
          text: '타이어 공기압을 적정 수준으로 유지하세요. 현재 주행 패턴을 고려했을 때 **2~3%의 추가 연비 개선이 가능**합니다.',
        },
      ],
    });
  return <ReportScreen analysis={analysis} recommendations={recommendations} />;
}
