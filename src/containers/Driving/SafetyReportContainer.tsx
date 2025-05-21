import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SafetyReportScreen from '../../screens/Driving/SafetyReportScreen';
import { SafetyReportData } from '../../types/report';
import { Text, View, StyleSheet } from 'react-native'; // StyleSheet import 추가

// 탭 메뉴 옵션
const OPTIONS = ['급가감속', '급회전', '과속'];

// 안전 보고서 컨테이너 컴포넌트
const SafetyReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [safetyData, setSafetyData] = useState<SafetyReportData | null>(null);
  const [formattedBarData, setFormattedBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [formattedLineData, setFormattedLineData] = useState<any[]>([]);

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 실제 구현 시 API 호출로 대체
        // const response = await safetyApi.getReportData();
        
        // 임시 데이터 사용
        setTimeout(() => {
          const mockData = getMockSafetyData();
          setSafetyData(mockData);
          
          // 차트 데이터 포맷팅
          setFormattedBarData(prepareAccelerationChartData(mockData));
          setPieData(prepareTurningChartData(mockData));
          setFormattedLineData(prepareSpeedingChartData(mockData));
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 탭 선택 핸들러
  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
  };

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    navigation.goBack();
  };

  // 모의 데이터 가져오기
  const getMockSafetyData = (): SafetyReportData => {
    return {
      score: 51.67,
      acceleration: {
        score: 40.0,
        ratio: 60.0,
        feedback: '급가속과 급감속이 다소 많이 발생했습니다. 부드러운 가속과 감속을 통해 안전 운전을 연습해보세요. 특히 08:20과 08:40 시간대에 급가감속이 집중적으로 발생했습니다.',
        title: '주행 시간별 급가감속 발생',
        chartData: [
          {value: 30, label: '08:10', flag: false, time: '2025-04-25T08:10:00Z'},
          {value: 70, label: '08:20', flag: true, time: '2025-04-25T08:20:00Z'},
          {value: 40, label: '08:30', flag: false, time: '2025-04-25T08:30:00Z'},
          {value: 60, label: '08:40', flag: true, time: '2025-04-25T08:40:00Z'},
          {value: 35, label: '08:50', flag: false, time: '2025-04-25T08:50:00Z'},
        ],
      },
      turning: {
        score: 60.0,
        ratio: 40.0,
        safeRatio: 60.0,
        dangerousRatio: 40.0,
        feedback: '회전 시 안전 비율이 60%로 양호한 편입니다. 하지만 40%의 위험 회전 비율을 개선하면 더욱 안전한 운전이 가능합니다. 회전 시 속도를 줄이고 방향지시등을 미리 켜는 습관을 들이세요.',
        title: '내 회전 스타일 분석',
        chartData: [
          {
            value: 40.0,
            color: '#FF8A65',
            text: '40.0%',
            label: '위험 회전',
            flag: true,
            time: '2025-04-25T08:10:00Z',
          },
          {
            value: 60.0,
            color: '#68D392',
            text: '60.0%',
            label: '안전 회전',
            flag: false,
            time: '2025-04-25T08:20:00Z',
          },
        ],
      },
      speeding: {
        score: 55.0,
        violations: 3,
        feedback: '100km/h 제한속도를 3회 초과했습니다. 특히 기간 1, 3, 6에서 속도 위반이 발생했습니다. 제한속도 준수는 안전 운전의 기본입니다. 긴 직선 도로에서도 속도계를 주시하며 운전하세요.',
        title: '시간대별 속도 그래프',
        speedLimit: 100,
        chartData: [
          {speed: 110, time: '기간 1', period: 1},
          {speed: 64, time: '기간 2', period: 2},
          {speed: 113, time: '기간 3', period: 3},
          {speed: 34, time: '기간 4', period: 4},
          {speed: 39, time: '기간 5', period: 5},
          {speed: 118, time: '기간 6', period: 6},
          {speed: 58, time: '기간 7', period: 7},
          {speed: 89, time: '기간 8', period: 8},
          {speed: 40, time: '기간 9', period: 9},
          {speed: 32, time: '기간 10', period: 10},
          {speed: 82, time: '기간 11', period: 11},
          {speed: 56, time: '기간 12', period: 12},
        ],
      },
    };
  };

  // 급가속/감속 바 차트 데이터 준비
  const prepareAccelerationChartData = (data: SafetyReportData) => {
    return data.acceleration.chartData.map(item => ({
      value: item.value,
      label: item.label,
      frontColor: item.flag ? '#E53E3E' : '#68D392',
      topLabelComponent: () => (
        <Text style={{ fontSize: 10, color: 'gray', marginBottom: 2, textAlign: 'center' }}>{item.value}</Text>
      ),
    }));
  };

  // 회전 스타일 분석을 위한 파이 차트 데이터 준비 함수
  const prepareTurningChartData = (data: SafetyReportData) => {
    return [
      // 위험 회전 데이터
      {
        value: data.turning.dangerousRatio,
        color: '#ED8936',
        text: `${data.turning.dangerousRatio}%`,
        textColor: 'white',
        name: '위험 회전',
        focused: false,
        strokeWidth: 0,
      },
      // 안전 회전 데이터
      {
        value: data.turning.safeRatio,
        color: '#68D392',
        text: `${data.turning.safeRatio}%`,
        textColor: 'white',
        name: '안전 회전',
        focused: false,
        strokeWidth: 0,
      },
    ];
  };

  // 과속 차트 데이터 준비 함수
  const prepareSpeedingChartData = (data: SafetyReportData) => {
    return data.speeding.chartData.map((item, index) => {
      const isOverLimit = item.speed > data.speeding.speedLimit;

      return {
        value: item.speed,
        dataPointText: isOverLimit ? item.speed.toString() : '',
        label:
          data.speeding.chartData.length > 8 && index % 2 !== 0
            ? ''
            : `${item.period}`,
        customDataPoint: isOverLimit ? () => (
          <View style={styles.speedingDataPointOuter}>
            <View style={styles.speedingDataPointInner} />
          </View>
        ) : undefined, // isOverLimit가 false이면 undefined 또는 null을 반환
        showStrip: isOverLimit,
        stripHeight: 4,
        stripColor: '#E53E3E', // Red color for speeding
        color: isOverLimit ? '#E53E3E' : '#68D392', // Green color for normal speed
      };
    });
  };
  
  if (loading || !safetyData) {
    return null; 
  }

  return (
    <SafetyReportScreen
      safetyData={safetyData}
      selectedTab={selectedTab}
      options={OPTIONS}
      loading={loading}
      formattedBarData={formattedBarData}
      pieData={pieData}
      formattedLineData={formattedLineData}
      onTabSelect={handleTabSelect}
      onBackPress={handleBackPress}
    />
  );
};

// 스타일 추가 (기존 스타일 객체에 추가하거나 새로 만드세요)
const styles = StyleSheet.create({
  speedingDataPointOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E53E3E', // Red color
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedingDataPointInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E53E3E', // Red color
  },
});

export default SafetyReportContainer;