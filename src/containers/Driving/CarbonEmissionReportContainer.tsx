import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import CarbonEmissionReportScreen from '../../screens/Driving/CarbonEmissionReportScreen';
import { CarbonEmissionData, ProcessedCarbonReport, IdlingEvent, SpeedMaintainItem } from '../../types/report';

// 탭 옵션
const TABS = ['공회전', '정속주행비율'];

/**
 * 탄소 배출 보고서 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const CarbonEmissionReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ProcessedCarbonReport | null>(null);

  // API 호출 및 데이터 처리 (실제로는 API에서 가져옴)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 실제 앱에서는 API 호출: const response = await api.getCarbonEmissionData();
        // 모의 API 호출
        setTimeout(() => {
          const data = getMockData();
          const processedData = processReportData(data);
          setReportData(processedData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    navigation.goBack();
  };

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 모의 데이터 가져오기
  const getMockData = (): CarbonEmissionData => {
    return {
      score: 82.5,
      idling: {
        score: 100.0,
        feedback: "공회전 시간이 적어 연료 소비와 탄소 배출이 최소화되었습니다. 이대로 유지하세요!",
        graph: [
          {
            startTime: "2025-04-25T08:10:00Z", 
            endTime: "2025-04-25T08:12:00Z"
          },
          {
            startTime: "2025-04-25T08:20:00Z",
            endTime: "2025-04-25T08:22:00Z"
          },
          {
            startTime: "2025-04-25T08:30:00Z",
            endTime: "2025-04-25T08:32:00Z"
          },
          {
            startTime: "2025-04-25T08:40:00Z",
            endTime: "2025-04-25T08:42:00Z"
          },
          {
            startTime: "2025-04-25T08:50:00Z",
            endTime: "2025-04-25T08:52:00Z"
          }
        ]
      },
      speedMaintain: {
        score: 65.0,
        feedback: "일정한 속도 유지 비율이 양호합니다. 급가속과 급감속을 줄이면 연비 효율이 더 좋아집니다.",
        graph: [
          {
            tag: "high",
            ratio: 10
          },
          {
            tag: "middle",
            ratio: 65
          },
          {
            tag: "low",
            ratio: 25
          }
        ]
      }
    };
  };

  // 공회전 시간대 계산
  const calculateIdlingDuration = (data: CarbonEmissionData): IdlingEvent[] => {
    return data.idling.graph.map((item, index) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      
      return {
        id: index.toString(),
        label: `구간 ${index + 1}`,
        startTime: formatTime(item.startTime),
        endTime: formatTime(item.endTime),
        duration: durationMinutes,
        value: durationMinutes, // 차트에서 바 길이로 사용
      };
    });
  };

  // 정속 주행 비율 파이 차트 데이터
  const prepareSpeedMaintainData = (data: CarbonEmissionData): SpeedMaintainItem[] => {
    const tagMapping: Record<string, string> = {
      'high': '고속',
      'middle': '중속',
      'low': '저속',
    };

    const colorMapping: Record<string, string> = {
      'high': '#E53E3E', // 빨간색
      'middle': '#68D392', // 초록색
      'low': '#F8E6B6', // 노란색
    };

    return data.speedMaintain.graph.map(item => ({
      value: item.ratio,
      label: tagMapping[item.tag] || item.tag,
      color: colorMapping[item.tag] || '#007AFF', // 기본 파란색
    }));
  };

  // 데이터 가공
  const processReportData = (data: CarbonEmissionData): ProcessedCarbonReport => {
    // 공회전 이벤트 데이터 준비
    const idlingEvents = calculateIdlingDuration(data);
    // 정속 주행 데이터 준비  
    const speedMaintainData = prepareSpeedMaintainData(data);
    // 총 공회전 시간 계산
    const totalIdlingMinutes = idlingEvents.reduce((sum, item) => sum + item.duration, 0);

    return {
      score: data.score,
      idlingScore: data.idling.score,
      speedMaintainScore: data.speedMaintain.score,
      idlingFeedback: data.idling.feedback,
      speedMaintainFeedback: data.speedMaintain.feedback,
      idlingEvents,
      speedMaintainData,
      totalIdlingMinutes
    };
  };

  // 로딩 중이거나 데이터가 없으면 널 반환
  if (loading || !reportData) {
    return null; // 로딩 컴포넌트로 대체 가능
  }

  // 스크린 컴포넌트에 데이터와 핸들러 전달
  return (
    <CarbonEmissionReportScreen
      score={reportData.score}
      selectedTab={selectedTab}
      tabs={TABS}
      loading={loading}
      idlingEvents={reportData.idlingEvents}
      speedMaintainData={reportData.speedMaintainData}
      idlingScore={reportData.idlingScore}
      speedMaintainScore={reportData.speedMaintainScore}
      idlingFeedback={reportData.idlingFeedback}
      speedMaintainFeedback={reportData.speedMaintainFeedback}
      totalIdlingMinutes={reportData.totalIdlingMinutes}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
    />
  );
};

export default CarbonEmissionReportContainer;