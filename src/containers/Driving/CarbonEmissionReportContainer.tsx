import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import CarbonEmissionReportScreen from '../../screens/Driving/CarbonEmissionReportScreen';
import { CARBON_COLORS } from '../../theme/colors';

// 탭 옵션
const TABS = ['공회전', '정속주행비율'];

/**
 * 탄소 배출 보고서 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const CarbonEmissionReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  
  // 상태값들
  const [score, setScore] = useState(0);
  const [idlingScore, setIdlingScore] = useState(0);
  const [speedMaintainScore, setSpeedMaintainScore] = useState(0);
  const [idlingEvents, setIdlingEvents] = useState([]);
  const [speedMaintainData, setSpeedMaintainData] = useState([]);
  const [totalIdlingMinutes, setTotalIdlingMinutes] = useState(0);
  const [idlingFeedback, setIdlingFeedback] = useState('');
  const [speedMaintainFeedback, setSpeedMaintainFeedback] = useState('');

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 실제 앱에서는 API 호출하지만 여기서는 모의 데이터 사용
        setTimeout(() => {
          // 모의 데이터
          const mockData = {
            score: 82.5,
            idling: {
              score: 100.0,
              feedback: "공회전 시간이 적어 연료 소비와 탄소 배출이 최소화되었습니다. 이대로 유지하세요!",
              graph: [
                { startTime: "2025-04-25T08:10:00Z", endTime: "2025-04-25T08:12:00Z" },
                { startTime: "2025-04-25T08:20:00Z", endTime: "2025-04-25T08:22:00Z" },
                { startTime: "2025-04-25T08:30:00Z", endTime: "2025-04-25T08:32:00Z" },
                { startTime: "2025-04-25T08:40:00Z", endTime: "2025-04-25T08:42:00Z" },
                { startTime: "2025-04-25T08:50:00Z", endTime: "2025-04-25T08:52:00Z" }
              ]
            },
            speedMaintain: {
              score: 65.0,
              feedback: "일정한 속도 유지 비율이 양호합니다. 급가속과 급감속을 줄이면 연비 효율이 더 좋아집니다.",
              graph: [
                { tag: "high", ratio: 10 },
                { tag: "middle", ratio: 65 },
                { tag: "low", ratio: 25 }
              ]
            }
          };

          // 데이터 처리
          setScore(mockData.score);
          setIdlingScore(mockData.idling.score);
          setSpeedMaintainScore(mockData.speedMaintain.score);
          
          // 공회전 이벤트 처리
          const processedIdlingEvents = mockData.idling.graph.map((item, index) => {
            const start = new Date(item.startTime);
            const end = new Date(item.endTime);
            const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
            
            return {
              id: index.toString(),
              label: `구간 ${index + 1}`,
              startTime: formatTime(item.startTime),
              endTime: formatTime(item.endTime),
              duration: durationMinutes,
              value: durationMinutes,
            };
          });
          
          setIdlingEvents(processedIdlingEvents);
          setTotalIdlingMinutes(processedIdlingEvents.reduce((sum, item) => sum + item.duration, 0));
          
          // 정속 주행 데이터 처리
          const tagMapping = { 'high': '고속', 'middle': '중속', 'low': '저속' };
          const colorMapping = {
            'high': CARBON_COLORS.chart.highSpeed,
            'middle': CARBON_COLORS.chart.midSpeed,
            'low': CARBON_COLORS.chart.lowSpeed
          };
          
          const processedSpeedData = mockData.speedMaintain.graph.map(item => ({
            value: item.ratio,
            label: tagMapping[item.tag] || item.tag,
            color: colorMapping[item.tag] || CARBON_COLORS.primary,
          }));
          
          setSpeedMaintainData(processedSpeedData);
          setIdlingFeedback(mockData.idling.feedback);
          setSpeedMaintainFeedback(mockData.speedMaintain.feedback);
          
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 탭 선택 핸들러
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // 뒤로가기 핸들러 
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <CarbonEmissionReportScreen
      score={score}
      selectedTab={selectedTab}
      tabs={TABS}
      loading={loading}
      idlingEvents={idlingEvents}
      speedMaintainData={speedMaintainData}
      idlingScore={idlingScore}
      speedMaintainScore={speedMaintainScore}
      idlingFeedback={idlingFeedback}
      speedMaintainFeedback={speedMaintainFeedback}
      totalIdlingMinutes={totalIdlingMinutes}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
    />
  );
};

export default CarbonEmissionReportContainer;