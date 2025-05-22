import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import GaugeChart from './GaugeChart'; // GaugeChart import 확인
import HeaderDropdown from '../common/HeaderDropdown';

interface ReportHeaderSectionProps {
  score: number;
  onBackPress: () => void;
  screenType?: 'accident' | 'safety' | 'carbon' | 'attention';
}

const ReportHeaderSection: React.FC<ReportHeaderSectionProps> = ({
  score,
  onBackPress,
  screenType = 'accident', // 기본값을 'accident'로 설정하거나, 상황에 맞게 조정
}) => {
  // 스크린 타입에 따른 테마 색상 설정
  const getThemeColor = () => {
    switch(screenType) {
      case 'accident':
        return '#BB27FF'; // 보라색
      case 'safety':
        return '#68D392'; // 초록색
      case 'carbon':
        return '#4299E1'; // 파란색
      case 'attention':
        return '#FFD927'; // 노란색
      default:
        return '#BB27FF';
    }
  };
  
  // 테마 색상 가져오기
  const themeColor = getThemeColor();
  
  // 스크린 타입에 따른 배경 카드 색상 설정
  const getCardBackgroundColor = () => {
    switch(screenType) {
      case 'accident':
        return '#F5E9FF'; // 연한 보라색
      case 'safety':
        return 'rgba(104, 211, 146, 0.1)'; // 연한 초록색
      case 'carbon':
        return 'rgba(66, 153, 225, 0.1)'; // 연한 파란색
      case 'attention':
        return '#FFFAEB'; // 연한 노란색
      default:
        return '#F5E9FF';
    }
  };

  // 스크린 타입에 따른 테두리 색상 설정
  const getBorderColor = () => {
    switch(screenType) {
      case 'accident':
        return 'rgba(187, 39, 255, 0.5)'; // 보라색 (불투명도 증가)
      case 'safety':
        return 'rgba(104, 211, 146, 0.5)'; // 초록색 (불투명도 증가)
      case 'carbon':
        return 'rgba(66, 153, 225, 0.5)'; // 파란색 (불투명도 증가)
      case 'attention':
        return 'rgba(255, 217, 39, 0.5)'; // 노란색 (불투명도 증가)
      default:
        return 'rgba(187, 39, 255, 0.5)';
    }
  };

  // 스크린 타입에 따른 게이지 차트 배경색 설정
  const getGaugeBackgroundColor = () => {
    switch(screenType) {
      case 'accident':
        return '#f0d6ff'; // 연한 보라 (GaugeChart 기본 배경과 유사하게)
      case 'safety':
        return 'rgba(104, 211, 146, 0.2)'; // 연한 초록색 (수정됨)
      case 'carbon':
        return 'rgba(66, 153, 225, 0.2)'; // 연한 파란색 (수정됨)
      case 'attention':
        return 'rgba(255, 217, 39, 0.2)'; // 연한 노란색
      default:
        return '#f0d6ff';
    }
  };
  
  // 스타일 계산
  const reportHeaderCardStyle = {
    ...styles.reportHeader,
    borderColor: getBorderColor(),
    backgroundColor: getCardBackgroundColor(),
    borderWidth: 2.5, // 테두리 두께 증가
    shadowOpacity: 0.05, // 그림자 불투명도 감소
  };
  
  // 점수에 따른 게이지 색상 설정 (낮은 점수는 빨간색)
  const getGaugeColor = () => {
    if (score < 50) return '#E53E3E'; // 위험 점수 빨간색
    return themeColor; // 그 외에는 테마 색상
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          accessibilityLabel="뒤로 가기"
        >
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <HeaderDropdown 
          currentScreen={screenType} 
          primaryColor={themeColor} 
          textColor="#2D3748" // 필요시 동적으로 변경
        />
        <View style={styles.placeholderRight} />
      </View>

      <View style={reportHeaderCardStyle}>
        <View style={styles.gaugeContainer}>
          <GaugeChart
            percentage={score}
            color={getGaugeColor()} // 점수 및 테마에 따른 게이지 색상
            size={240} // 게이지 크기
            gaugeBackgroundColor={getGaugeBackgroundColor()} // 게이지 배경색 전달
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 12,
    marginLeft: -8,
  },
  placeholderRight: {
    width: 24, // 오른쪽 공간 확보
  },
  reportHeader: {
    marginHorizontal: 0,
    marginVertical: 16,
    padding: 20,
    borderWidth: 2,
    borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1}, // 그림자 오프셋 감소
    // shadowOpacity: 0.05, // 그림자 불투명도 감소
    // shadowRadius: 2, // 그림자 범위 감소
    // elevation: 2, // 안드로이드 그림자 높이 감소
    alignItems: 'center',
  },
  gaugeContainer: {
    marginVertical: 0,
    marginBottom: 8, // 게이지 하단 여백
    alignItems: 'center',
  },
});

export default ReportHeaderSection;