import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, {Path} from 'react-native-svg';

// 원형 차트를 그리는 컴포넌트
const CircleChart = ({
  percentage,
  radius,
  color,
}: {
  percentage: number;
  radius: number;
  color: string;
}) => {
  const center = radius + radius * 0.1;
  const startAngle = -90;
  const endAngle = 360 * (percentage / 100) - 90;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const createArc = (
    x: number,
    y: number,
    r: number,
    start: number,
    end: number,
  ) => {
    const s = polarToCartesian(x, y, r, end);
    const e = polarToCartesian(x, y, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${e.x} ${e.y}`;
  };

  const fullCirclePath = `M ${center},${
    center - radius
  } a ${radius},${radius} 0 1,0 0,${2 * radius} a ${radius},${radius} 0 1,0 0,${
    -2 * radius
  }`;
  const progressPath =
    percentage >= 100
      ? fullCirclePath
      : createArc(center, center, radius, startAngle, endAngle);

  return (
    <View style={styles.circleContainer}>
      <Svg width={center * 2} height={center * 2}>
        <Path
          d={fullCirclePath}
          stroke={`${color}20`}
          strokeWidth={radius * 0.1}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={progressPath}
          stroke={color}
          strokeWidth={radius * 0.1}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.circleText, {fontSize: radius * 0.5, color}]}>
        {Math.round(percentage)}%
      </Text>
    </View>
  );
};

// Driving stack navigation params
type DrivingStackParamList = {
  DrivingHistory: undefined;
  Driving: undefined;
  DrivingDetail: undefined;
  SafetyReport: undefined;
  CarbonEmissionReport: undefined;
  AccidentPreventionReport: undefined;
  AttentionScoreReport: undefined;
};

const DrivingDetailScreen = () => {
  const navigation = useNavigation<NavigationProp<DrivingStackParamList>>();

  // 테스트 데이터
  const data = {
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

  const cardBgColors = ['#E1F5FE', '#E8F5E9', '#F3E5F5', '#FFF3E0']; // 카드 배경색 배열

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.spacer24} />
        <Text style={styles.headerTitle}>주행 상세</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          accessibilityLabel="뒤로가기 버튼"
          activeOpacity={0.7}>
          <Icon name="x" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
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
            <Icon
              name="bar-chart-2"
              size={18}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.scoreLabelText}>종합점수</Text>
          </View>
          <View style={styles.totalScoreContainer}>
            <Text style={styles.totalScore}>
              {data.totalScore.toFixed(2)} 점
            </Text>
          </View>
        </View>

        {/* 운전 점수 리포트 섹션 */}
        <Text style={styles.reportTitle}>운전 점수 리포트</Text>
        {/* 원형 차트 그리드 */}
        <View style={styles.circleGrid}>
          {data.scores.map((score, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.circleCard, {backgroundColor: cardBgColors[idx]}]}
              activeOpacity={0.7}              onPress={() => {
                if (score.name === '안전 운전 점수') {
                  navigation.navigate('SafetyReport');
                } else if (score.name === '탄소 배출 및 연비 점수') {
                  navigation.navigate('CarbonEmissionReport');
                } else if (score.name === '사고 예방 점수') {
                  navigation.navigate('AccidentPreventionReport');
                } else if (score.name === '주의력 점수') {
                  navigation.navigate('AttentionScoreReport');
                }
              }}
              accessibilityLabel={`${score.name}: ${Math.round(score.value)}%`}>
              <CircleChart
                percentage={score.value}
                radius={36}
                color={score.color}
              />
              <Text style={styles.circleLabel} numberOfLines={2}>
                {score.name}
              </Text>
              {/* 우측 하단 화살표 추가 */}
              <View style={styles.arrowContainer}>
                <Icon name="chevron-right" size={16} color="#888" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 피드백 메시지 - 로봇 이미지 사용 */}
        <View
          style={styles.feedbackContainer}
          accessibilityLabel="피드백 메시지">
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
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
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
    fontSize: 32,
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
  reportTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 15,
  },
  // 원형 차트 카드 그리드
  circleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  circleCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
    position: 'relative', // 추가: 절대위치 기준점 설정
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 12,
    padding: 2,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    position: 'absolute',
    fontWeight: 'bold',
  },
  circleLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
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
  spacer24: {
    width: 24,
  },
});

export default DrivingDetailScreen;
