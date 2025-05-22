import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AccidentPreventionReportScreen from '../../screens/Driving/AccidentPreventionReportScreen';
import { ACCIDENT_COLORS } from '../../theme/colors';

// 탭 옵션
const TABS = ['반응속도', '차선이탈', '안전거리유지'];

/**
 * 사고 예방 리포트 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const AccidentPreventionReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  
  // API로부터 데이터를 가져오는 효과
  useEffect(() => {
    // 실제 앱에서는 API 호출
    const fetchData = async () => {
      try {
        setLoading(true);
        // 실제 구현에서는 API 호출: const response = await api.getAccidentPreventionData();
        
        // 모의 API 호출 (타이머로 지연 효과)
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // API 데이터 -> 사용자에게 보여주는 데이터로 변환
  // 실제 API 데이터는 이곳에서 처리
  
  // 모의 데이터 (실제 앱에서는 API 응답을 처리)
  const accidentData = {
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
  
  // 시간 형식 포맷팅 함수
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 이벤트 데이터 가공
  const reactionEvents = accidentData.reaction.graph.map((item, index) => ({
    id: `reaction-${index}`,
    time: item.startTime,
    formattedTime: formatTime(item.startTime),
    endTime: item.endTime,
    formattedEndTime: formatTime(item.endTime),
    duration: 2, // 2초 (API 명세서에 따르면 모두 2초)
  }));

  const laneDepartureEvents = accidentData.laneDeparture.graph.map((time, index) => ({
    id: `lane-${index}`,
    time,
    formattedTime: formatTime(time),
  }));

  const followingDistanceEvents = accidentData.followingDistance.graph.map((item, index) => ({
    id: `follow-${index}`,
    time: item.startTime,
    formattedTime: formatTime(item.startTime),
    endTime: item.endTime,
    formattedEndTime: formatTime(item.endTime),
    duration: 2, // 2초 (API 명세서에 따르면 모두 2초)
  }));
  
  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setSelected(tab);
  };

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // 현재 선택된 탭에 따른 피드백 가져오기
  const currentFeedback = selected === '반응속도'
    ? accidentData.reaction.feedback
    : selected === '차선이탈'
      ? accidentData.laneDeparture.feedback
      : accidentData.followingDistance.feedback;

  return (
    <AccidentPreventionReportScreen 
      score={accidentData.score}
      selected={selected}
      tabs={TABS}
      loading={loading}
      reactionEvents={reactionEvents}
      laneDepartureEvents={laneDepartureEvents}
      followingDistanceEvents={followingDistanceEvents}
      reactionScore={accidentData.reaction.score}
      laneDepartureScore={accidentData.laneDeparture.score}
      followingDistanceScore={accidentData.followingDistance.score}
      currentFeedback={currentFeedback}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
    />
  );
};

export default AccidentPreventionReportContainer;