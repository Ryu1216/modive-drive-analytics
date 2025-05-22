import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DrivingDetailScreen from '../../screens/Driving/DrivingDetailScreen';
import { DrivingStackParamList, DrivingDetailData } from '../../types/driving';

type DrivingDetailNavigationProp = NativeStackNavigationProp<
  DrivingStackParamList,
  'DrivingDetail'
>;

type DrivingDetailRouteProp = RouteProp<DrivingStackParamList, 'DrivingDetail'>;

const DrivingDetailContainer: React.FC = () => {
  const navigation = useNavigation<DrivingDetailNavigationProp>();
  const route = useRoute<DrivingDetailRouteProp>();
  const { drivingId } = route.params || { drivingId: '' };

  const [data, setData] = useState<DrivingDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // 테스트 데이터 - 실제 앱에서는 API에서 로드
  const mockData: DrivingDetailData = {
    date: '2025년 4월 17일',
    time: '16:30~17:28까지 주행기록',
    totalScore: 87.12,
    scores: [
      {name: '탄소 배출 및 연비 점수', value: 82.5, color: '#007AFF'},
      {name: '안전 운전 점수', value: 51.7, color: '#4ECD7B'},
      {name: '사고 예방 점수', value: 34.7, color: '#BB27FF'},
      {name: '주의력 점수', value: 70.0, color: '#FFD927'},
    ],
    message:
      '전체적으로 안정적인 운전 습관이에요\n특히 급제동과 급가속을 잘 컨트롤했네요!',
  };

  // 카드 배경색 배열
  const cardBgColors = ['#E1F5FE', '#E8F5E9', '#F3E5F5', '#FFF3E0'];

  // 데이터 로드 (실제 앱에서는 API 호출)
  useEffect(() => {
    const loadDrivingDetail = async () => {
      try {
        // 실제 앱에서는 API 호출: const response = await api.getDrivingDetail(drivingId);
        // console.log('Loading driving detail for ID:', drivingId);
        
        // API 호출 시뮬레이션
        setTimeout(() => {
          setData(mockData);
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error loading driving detail:', error);
        setLoading(false);
      }
    };

    loadDrivingDetail();
  }, [drivingId]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleCardPress = (cardName: string) => {
    switch (cardName) {
      case '안전 운전 점수':
        navigation.navigate('SafetyReport');
        break;
      case '탄소 배출 및 연비 점수':
        navigation.navigate('CarbonEmissionReport');
        break;
      case '사고 예방 점수':
        navigation.navigate('AccidentPreventionReport');
        break;
      case '주의력 점수':
        navigation.navigate('AttentionScoreReport');
        break;
    }
  };

  // 로딩 중일 때 표시할 내용 (실제 앱에서는 로딩 컴포넌트 사용)
  if (loading || !data) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <DrivingDetailScreen
      data={data}
      cardBgColors={cardBgColors}
      handleClose={handleClose}
      handleCardPress={handleCardPress}
    />
  );
};

export default DrivingDetailContainer;