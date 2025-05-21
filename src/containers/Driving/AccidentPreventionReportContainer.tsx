import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AccidentPreventionReportScreen from '../../screens/Driving/AccidentPreventionReportScreen';
import { AccidentPreventionData, TimeEvent, TimeRangeEvent } from '../../types/driving';
import { ProcessedAccidentReport } from '../../types/report';

// 탭 옵션
const TABS = ['반응속도', '차선이탈', '안전거리유지'];

/**
 * 사고 예방 리포트 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const AccidentPreventionReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ProcessedAccidentReport | null>(null);

  // API 호출 및 데이터 처리 (실제로는 API에서 가져옴)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 실제 앱에서는 API 호출: const response = await api.getAccidentPreventionData();
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

  // 모의 데이터 가져오기
  const getMockData = (): AccidentPreventionData => {
    return {
      score: 34.666666666666664,
      reaction: {
        score: 0.0,
        feedback: "급정거나 위험 상황에서의 반응 속도가 느립니다. 전방 주시를 철저히 하고 안전거리를 확보하세요.",
        graph: [
          { startTime: "2025-04-25T08:17:00Z", endTime: "2025-04-25T08:17:02Z" },
          { startTime: "2025-04-25T08:34:00Z", endTime: "2025-04-25T08:34:02Z" },
          { startTime: "2025-04-25T08:51:00Z", endTime: "2025-04-25T08:51:02Z" },
          { startTime: "2025-04-25T09:08:00Z", endTime: "2025-04-25T09:08:02Z" },
          { startTime: "2025-04-25T09:25:00Z", endTime: "2025-04-25T09:25:02Z" }
        ]
      },
      laneDeparture: {
        score: 40.0,
        feedback: "차선 이탈이 빈번히 발생했습니다. 피로하거나 주의가 산만한 상태에서의 운전을 피하세요.",
        graph: [
          "2025-04-25T08:05:04Z",
          "2025-04-25T08:46:50Z",
          "2025-04-25T09:15:17Z",
          "2025-04-25T09:32:33Z",
          "2025-04-25T09:43:26Z",
          "2025-04-25T09:45:57Z"
        ]
      },
      followingDistance: {
        score: 64.0,
        feedback: "안전거리 유지가 필요합니다. 최소 2초 이상의 거리를 확보하여 주행하세요.",
        graph: [
          { startTime: "2025-04-25T08:17:00Z", endTime: "2025-04-25T08:17:02Z" },
          { startTime: "2025-04-25T08:34:00Z", endTime: "2025-04-25T08:34:02Z" },
          { startTime: "2025-04-25T08:51:00Z", endTime: "2025-04-25T08:51:02Z" },
          { startTime: "2025-04-25T09:08:00Z", endTime: "2025-04-25T09:08:02Z" },
          { startTime: "2025-04-25T09:25:00Z", endTime: "2025-04-25T09:25:02Z" },
          { startTime: "2025-04-25T09:42:00Z", endTime: "2025-04-25T09:42:02Z" }
        ]
      }
    };
  };

  // 데이터 가공
  const processReportData = (data: AccidentPreventionData): ProcessedAccidentReport => {
    // 포맷팅 함수
    const formatTime = (timeString: string): string => {
      const date = new Date(timeString);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 반응속도 이벤트
    const reactionEvents: TimeRangeEvent[] = data.reaction.graph.map((item, index) => ({
      id: `reaction-${index}`,
      time: item.startTime,
      formattedTime: formatTime(item.startTime),
      endTime: item.endTime,
      formattedEndTime: formatTime(item.endTime),
      duration: 2, // 2초 (API 명세서에 따르면 모두 2초)
    }));

    // 차선이탈 이벤트
    const laneDepartureEvents: TimeEvent[] = data.laneDeparture.graph.map((time, index) => ({
      id: `lane-${index}`,
      time,
      formattedTime: formatTime(time)
    }));

    // 안전거리유지 이벤트
    const followingDistanceEvents: TimeRangeEvent[] = data.followingDistance.graph.map((item, index) => ({
      id: `follow-${index}`,
      time: item.startTime,
      formattedTime: formatTime(item.startTime),
      endTime: item.endTime,
      formattedEndTime: formatTime(item.endTime),
      duration: 2, // 2초 (API 명세서에 따르면 모두 2초)
    }));

    return {
      score: data.score,
      reactionScore: data.reaction.score,
      laneDepartureScore: data.laneDeparture.score,
      followingDistanceScore: data.followingDistance.score,
      reactionFeedback: data.reaction.feedback,
      laneDepartureFeedback: data.laneDeparture.feedback,
      followingDistanceFeedback: data.followingDistance.feedback,
      reactionEvents,
      laneDepartureEvents,
      followingDistanceEvents
    };
  };

  // 로딩 중이거나 데이터가 없으면 널 반환
  if (loading || !reportData) {
    return null; // 로딩 컴포넌트로 대체 가능
  }

  // 스크린 컴포넌트에 데이터와 핸들러 전달
  return (
    <AccidentPreventionReportScreen
      score={reportData.score}
      selectedTab={selectedTab}
      tabs={TABS}
      loading={loading}
      reactionEvents={reportData.reactionEvents}
      laneDepartureEvents={reportData.laneDepartureEvents}
      followingDistanceEvents={reportData.followingDistanceEvents}
      reactionScore={reportData.reactionScore}
      laneDepartureScore={reportData.laneDepartureScore}
      followingDistanceScore={reportData.followingDistanceScore}
      reactionFeedback={reportData.reactionFeedback}
      laneDepartureFeedback={reportData.laneDepartureFeedback}
      followingDistanceFeedback={reportData.followingDistanceFeedback}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
    />
  );
};

export default AccidentPreventionReportContainer;