import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

// 원형 차트를 그리는 함수
const CircleChart = ({ 
  percentage, 
  radius, 
  strokeWidth, 
  color 
}: { 
  percentage: number; 
  radius: number; 
  strokeWidth: number; 
  color: string;
}) => {
  // 원의 중심점
  const center = radius + strokeWidth;
  // 원의 둘레
  const circumference = 2 * Math.PI * radius;
  // 시작 각도 (270도 = -90도)
  const startAngle = -90;
  // 종료 각도 (완전한 원이 아닌 270도만 사용)
  const endAngle = 360 * (percentage / 100) - 90;
  
  // 원의 좌표 계산
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };
  
  // 두 점을 연결하는 호를 그리는 SVG Path 문자열 생성
  const createArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };
  
  // 완전한 원형 경로 생성 (360도)
  const createFullCirclePath = (x: number, y: number, radius: number) => {
    return `M ${x}, ${y - radius} a ${radius},${radius} 0 1,0 0,${2 * radius} a ${radius},${radius} 0 1,0 0,${-2 * radius}`;
  };
  
  // 배경 원호 경로 (360도 완전한 원)
  const backgroundPath = createFullCirclePath(center, center, radius);
  // 진행도 원호 경로 (percentage에 따라 달라짐, 270도까지만)
  const progressPath = createArc(center, center, radius, startAngle, endAngle);
  
  return (
    <View style={{ width: center * 2, height: center * 2, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={center * 2} height={center * 2}>
        {/* 배경 원 (360도) */}
        <Path
          d={backgroundPath}
          stroke={`${color}20`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* 진행도 표시 원 (270도) */}
        <Path
          d={progressPath}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ 
        position: 'absolute', 
        fontSize: radius * 0.5, 
        fontWeight: 'bold',
        color: color
      }}>
        {percentage.toFixed(2)}
      </Text>
    </View>
  );
};

const DrivingDetailScreen = () => {
  const navigation = useNavigation();
  const [cardWidth, setCardWidth] = useState<number>(0);
  
  // 테스트 데이터 - 값을 다양하게 설정하여 차이 표현
  const data = {
    date: '2025년 4월 17일',
    time: '16:30~17:28까지 주행기록',
    totalScore: 87.12,
    scores: [
      { name: '탄소 배출 및 연비 점수', value: 68.00, color: '#007AFF' },
      { name: '안전 운전 점수', value: 82.45, color: '#4ECD7B' },
      { name: '사고 예방 점수', value: 74.68, color: '#BB27FF' },
      { name: '주의력 점수', value: 68.00, color: '#FFD927' },
    ],
    message: '전체적으로 안정적인 운전 습관이에요\n특히 급제동과 급가속을 잘 컨트롤했네요!'
  };
  
  // 카드 레이아웃이 렌더링된 후 너비 계산
  const onCardLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    // 차트 공간을 고려하여 카드 너비의 약 30%를 차트 크기로 설정
    setCardWidth(layoutWidth * 0.3);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>주행 상세</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="x" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {/* 날짜 및 시간 정보 */}
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={18} color="#4945FF" style={styles.icon} />
          <Text style={styles.dateText}>{data.date}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Icon name="clock" size={18} color="#666" style={styles.icon} />
          <Text style={styles.timeText}>{data.time}</Text>
        </View>
        
        {/* 종합 점수 섹션 */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreLabel}>
            <Icon name="bar-chart-2" size={18} color="#666" style={styles.icon} />
            <Text style={styles.scoreLabelText}>종합점수</Text>
          </View>
          <View style={styles.totalScoreContainer}>
            <Text style={styles.totalScore}>{data.totalScore.toFixed(2)} 점</Text>
            
            {/* 점수 프로그레스바 */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${data.totalScore}%` }]} />
              </View>
            </View>
          </View>
        </View>
        
        {/* 운전 점수 리포트 섹션 */}
        <Text style={styles.reportTitle}>운전 점수 리포트</Text>
        
        {/* 점수 카드 목록 형식 - 반응형 차트 크기 */}
        {data.scores.map((score, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.scoreCard, { backgroundColor: `${score.color}10` }]}
            onLayout={index === 0 ? onCardLayout : undefined}
          >
            <View style={styles.scoreCardContent}>
              <Text style={styles.scoreCardTitle}>{score.name}</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </View>
            
            <View style={styles.chartContainer}>
              {cardWidth > 0 && (
                <CircleChart
                  percentage={score.value}
                  radius={cardWidth / 2.5}
                  strokeWidth={cardWidth / 12}
                  color={score.color}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        {/* 피드백 메시지 - 로봇 이미지 사용 */}
        <View style={styles.feedbackContainer}>
          <Image 
            source={require('../../assets/modive_robot1.png')}
            style={styles.robotImage}
            resizeMode="contain"
          />
          <Text style={styles.feedbackText}>{data.message}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4945FF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4945FF',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  scoreSection: {
    marginTop: 20,
  },
  scoreLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalScoreContainer: {
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#F5F5FF',
    borderRadius: 15,
    padding: 15,
  },
  totalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4945FF',
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0FF',
    borderRadius: 4,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4945FF',
    borderRadius: 4,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 15,
  },
  scoreCard: {
    width: '100%',
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#F5FAFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scoreCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 20,
  },
  robotImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default DrivingDetailScreen;