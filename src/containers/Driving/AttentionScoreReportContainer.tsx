import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AttentionScoreReportScreen from '../../screens/Driving/AttentionScoreReportScreen';
import { 
  AttentionScoreData, 
  ProcessedAttentionReport, 
  DrivingSession,
  InactivityEvent 
} from '../../types/report';

// 탭 옵션
const TABS = ['운전 시간', '미조작 시간'];

/**
 * 주의력 점수 리포트 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const AttentionScoreReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ProcessedAttentionReport | null>(null);

  // API 호출 및 데이터 처리 (실제로는 API에서 가져옴)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 실제 앱에서는 API 호출: const response = await api.getAttentionScoreData();
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

  // 시간 계산 함수 (분 단위)
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  };

  // 모의 데이터 가져오기
  const getMockData = (): AttentionScoreData => {
    return {
      score: 70.0,
      drivingTime: {
        score: 100.0,
        feedback: "안전한 운전 시간 내에서 운전했습니다. 장거리 운전 시에는 2시간마다 휴식을 취하는 습관을 들이세요.",
        graph: [
          {
            startTime: "2025-04-25T08:00:00Z",
            endTime: "2025-04-25T10:00:00Z"
          }
        ]
      },
      inactivity: {
        score: 40.0,
        feedback: "운전 중 차량 미조작 상태가 여러 번 감지되었습니다. 주행 중에는 항상 핸들을 잡고 있어야 합니다.",
        graph: [
          "2025-04-25T08:03:11Z",
          "2025-04-25T08:05:07Z",
          "2025-04-25T08:18:33Z",
          "2025-04-25T08:54:38Z",
          "2025-04-25T09:38:28Z",
          "2025-04-25T09:40:16Z"
        ]
      }
    };
  };

  // 데이터 가공
  const processReportData = (data: AttentionScoreData): ProcessedAttentionReport => {
    // 운전 시간 데이터 준비
    const drivingTimeSessions: DrivingSession[] = data.drivingTime.graph.map((session, index) => {
      const durationMinutes = calculateDuration(session.startTime, session.endTime);
      const durationHours = durationMinutes / 60;
      
      return {
        id: index,
        startTime: session.startTime,
        endTime: session.endTime,
        formattedStartTime: formatTime(session.startTime),
        formattedEndTime: formatTime(session.endTime),
        durationMinutes,
        durationHours,
        // 4시간 기준으로 진행률 계산 (권장 최대 연속 운전 시간)
        progress: Math.min(durationHours / 4, 1)
      };
    });
    
    // 미조작 시간 이벤트 데이터 준비
    const inactivityEvents: InactivityEvent[] = data.inactivity.graph.map((time, index) => {
      return {
        id: index,
        time,
        formattedTime: formatTime(time)
      };
    });

    return {
      score: data.score,
      drivingTimeScore: data.drivingTime.score,
      inactivityScore: data.inactivity.score,
      drivingTimeFeedback: data.drivingTime.feedback,
      inactivityFeedback: data.inactivity.feedback,
      drivingTimeSessions,
      inactivityEvents
    };
  };

  // 로딩 중이거나 데이터가 없으면 널 반환
  if (loading || !reportData) {
    return null; // 로딩 컴포넌트로 대체 가능
  }

  // 스크린 컴포넌트에 데이터와 핸들러 전달
  return (
    <AttentionScoreReportScreen
      score={reportData.score}
      selectedTab={selectedTab}
      tabs={TABS}
      loading={loading}
      drivingTimeSessions={reportData.drivingTimeSessions}
      inactivityEvents={reportData.inactivityEvents}
      drivingTimeScore={reportData.drivingTimeScore}
      inactivityScore={reportData.inactivityScore}
      drivingTimeFeedback={reportData.drivingTimeFeedback}
      inactivityFeedback={reportData.inactivityFeedback}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
    />
  );
};

export default AttentionScoreReportContainer;