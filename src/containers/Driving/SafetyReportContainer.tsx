import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SafetyReportScreen from '../../screens/Driving/SafetyReportScreen';
import { processSafetyData } from '../../utils/chartDataProcessor';

const TAB_OPTIONS = ['급가감속', '급회전', '과속'];

/**
 * 안전 운전 리포트 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const SafetyReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(TAB_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [safetyData, setSafetyData] = useState(null);
  const [formattedBarData, setFormattedBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [formattedLineData, setFormattedLineData] = useState([]);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 실제 앱에서는 API 호출: const response = await api.getSafetyReportData();
        
        // 모의 데이터 (실제 앱에서는 API 응답 데이터 사용)
        const mockData = {
          score: 75.5,
          acceleration: {
            score: 65.3,
            title: '급가감속 분석',
            feedback: "급가속과 급감속 횟수가 다소 많습니다. 부드러운 가속 및 감속을 연습하세요.",
            chartData: [
              { value: 42, label: '08:00' },
              { value: 38, label: '08:30' },
              { value: 65, label: '09:00' },
              { value: 22, label: '09:30' },
              { value: 48, label: '10:00' },
            ]
          },
          turning: {
            score: 82.7,
            title: '급회전 분석',
            feedback: "코너링 시 안정적인 속도 제어를 유지하셨습니다. 계속해서 안전운전 하세요.",
            safeRatio: 85,
            chartData: {
              safe: 85,
              unsafe: 15
            }
          },
          speeding: {
            score: 78.6,
            title: '과속 분석',
            feedback: "일부 구간에서 제한속도를 초과했습니다. 속도 제한을 준수하는 것이 중요합니다.",
            violations: 3,
            speedLimit: 70,
            chartData: [
              { value: 65, label: '08:00' },
              { value: 72, label: '08:15' },
              { value: 68, label: '08:30' },
              { value: 78, label: '08:45' },
              { value: 65, label: '09:00' },
              { value: 58, label: '09:15' }
            ]
          }
        };

        // 데이터 처리
        const { 
          processedData,
          formattedBarData,
          pieData,
          formattedLineData 
        } = processSafetyData(mockData);

        setSafetyData(processedData);
        setFormattedBarData(formattedBarData);
        setPieData(pieData);
        setFormattedLineData(formattedLineData);
        setLoading(false);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 탭 선택 핸들러
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    navigation.goBack();
  };

  if (!safetyData) {
    return null; // 로딩 컴포넌트로 대체 가능
  }

  return (
    <SafetyReportScreen
      safetyData={safetyData}
      selectedTab={selectedTab}
      options={TAB_OPTIONS}
      loading={loading}
      formattedBarData={formattedBarData}
      pieData={pieData}
      formattedLineData={formattedLineData}
      onTabSelect={handleTabSelect}
      onBackPress={handleBackPress}
    />
  );
};

export default SafetyReportContainer;