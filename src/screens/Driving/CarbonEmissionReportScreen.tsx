import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, {Path, Circle, G, Text as SvgText} from 'react-native-svg';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import HeaderDropdown from '../../components/common/HeaderDropdown';

// 색상 시스템 정의
const COLORS = {
  primary: '#007AFF', // 메인 컬러 - 파란색
  danger: '#FF5252',
  background: '#FFFFFF',
  cardBackground: '#FCFCFC',
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    light: '#718096',
  },
  border: '#E5E5E5',
  shadow: '#000000',
  success: '#007AFF', // 메인 컬러와 동일
  chart: {
    green: '#68D392',
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#805AD5',
    blue: '#007AFF', // 메인 컬러와 동일
    yellow: '#ECC94B',
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
    highSpeed: '#E53E3E',  // 고속 주행 - 빨간색
    midSpeed: '#68D392',   // 중속 주행 - 파란색
    lowSpeed: '#F8E6B6',   // 저속 주행 - 초록색
  },
  gradient: {
    blueStart: 'rgba(0, 122, 255, 0.6)', // 메인 컬러 기반 그라데이션
    blueEnd: 'rgba(0, 122, 255, 0.1)', // 메인 컬러 기반 그라데이션
  },
};

// 화면 크기 가져오기
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// 반응형 차트 크기 계산
const chartConfig = {
  pieRadius: screenWidth * 0.35,
  pieInnerRadius: screenWidth * 0.18,
  gaugeSize: screenWidth * 0.6 > 240 ? 240 : screenWidth * 0.6,
  barWidth: screenWidth * 0.08 > 30 ? 30 : screenWidth * 0.08,
  barSpacing: screenWidth * 0.05 > 24 ? 24 : screenWidth * 0.05,
  lineChartWidth: screenWidth - 100 > 0 ? screenWidth - 100 : 300,
  lineChartHeight: Math.max(screenHeight * 0.28, 200),
};

// 탄소 배출 및 연비 화면의 탭 - 변경됨
const options = ['공회전', '정속주행비율'];

interface GaugeChartProps {
  percentage: number;
  color: string;
  size?: number;
}

// 게이지 차트
const GaugeChart = ({percentage, color, size = 180}: GaugeChartProps) => {
  const center = size / 2;
  const gaugeRadius = (size / 2) * 0.8;
  const strokeWidth = 20;

  // 게이지 각도 계산 - 반원형 차트 (180도)
  const gaugeStartAngle = -180;
  const gaugeEndAngle = gaugeStartAngle + (percentage / 100) * 180;

  // 극좌표를 데카르트 좌표로 변환
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleDegrees: number,
  ) => {
    const angleRad = (angleDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad),
    };
  };

  // 호 경로 생성
  const createArc = (
    x: number,
    y: number,
    r: number,
    startAng: number,
    endAng: number,
  ) => {
    const start = polarToCartesian(x, y, r, endAng);
    const end = polarToCartesian(x, y, r, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      r,
      r,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  const foregroundArc = createArc(
    center,
    center,
    gaugeRadius,
    gaugeStartAngle,
    gaugeEndAngle,
  );
  const backgroundArc = createArc(
    center,
    center,
    gaugeRadius,
    gaugeStartAngle,
    gaugeStartAngle + 180,
  );

  const displayValue = percentage.toFixed(1);
  const ratingText =
    percentage >= 70 ? 'Good' : percentage >= 40 ? 'So-so' : 'Poor';

  // 반응형 폰트 크기 계산
  const scoreFontSize = size * 0.18 > 36 ? 36 : size * 0.18;
  const ratingFontSize = size * 0.12 > 24 ? 24 : size * 0.12;

  return (
    <View style={[styles.gaugeChartContainer, {height: size * 0.6}]}>
      <Svg width={size} height={size * 0.6}>
        {/* 배경 호 */}
        <Path
          d={backgroundArc}
          stroke="#cce4ff" // 파란색 계열 배경
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* 전경 호 */}
        <Path
          d={foregroundArc}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* 게이지 끝 부분의 원 */}
        <Circle
          cx={polarToCartesian(center, center, gaugeRadius, gaugeEndAngle).x}
          cy={polarToCartesian(center, center, gaugeRadius, gaugeEndAngle).y}
          r={strokeWidth / 2}
          fill="#FFFFFF"
          stroke={color}
          strokeWidth={2}
        />

        {/* 점수 텍스트 */}
        <G x={center} y={center - 10}>
          <SvgText
            textAnchor="middle"
            fontSize={scoreFontSize}
            fontWeight="bold"
            fill={color}>
            {displayValue}
          </SvgText>
          <SvgText
            textAnchor="middle"
            fontSize={ratingFontSize}
            fontWeight="bold"
            fill={color}
            y={30}>
            {ratingText}
          </SvgText>
        </G>

        {/* 0과 100 표시 */}
        <SvgText x={10} y={center + 15} fontSize={12} fill={COLORS.text.light}>
          {'0'}
        </SvgText>
        <SvgText
          x={size - 22}
          y={center + 15}
          fontSize={12}
          fill={COLORS.text.light}>
          {'100'}
        </SvgText>
      </Svg>
    </View>
  );
};

const CarbonEmissionReportScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(options[0]);
  const [loading, setLoading] = useState(false);

  // API 명세서에 맞게 변경된 데이터
  const carbonData = {
    score: 82.5,
    idling: {
      score: 100.0,
      feedback: "공회전 시간이 적어 연료 소비와 탄소 배출이 최소화되었습니다. 이대로 유지하세요!",
      graph: [
        {
          startTime: "2025-04-25T08:10:00Z", 
          endTime: "2025-04-25T08:12:00Z"
        },
        {
          startTime: "2025-04-25T08:20:00Z",
          endTime: "2025-04-25T08:22:00Z"
        },
        {
          startTime: "2025-04-25T08:30:00Z",
          endTime: "2025-04-25T08:32:00Z"
        },
        {
          startTime: "2025-04-25T08:40:00Z",
          endTime: "2025-04-25T08:42:00Z"
        },
        {
          startTime: "2025-04-25T08:50:00Z",
          endTime: "2025-04-25T08:52:00Z"
        }
      ]
    },
    speedMaintain: {
      score: 65.0,
      feedback: "일정한 속도 유지 비율이 양호합니다. 급가속과 급감속을 줄이면 연비 효율이 더 좋아집니다.",
      graph: [
        {
          tag: "high",
          ratio: 10
        },
        {
          tag: "middle",
          ratio: 65
        },
        {
          tag: "low",
          ratio: 25
        }
      ]
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 공회전 시간대 계산 (시작 시간 기준으로 정렬)
  const calculateIdlingDuration = () => {
    return carbonData.idling.graph.map((item, index) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      
      return {
        id: index.toString(),
        label: `구간 ${index + 1}`,
        startTime: formatTime(item.startTime),
        endTime: formatTime(item.endTime),
        duration: durationMinutes,
        value: durationMinutes, // 차트에서 바 길이로 사용
      };
    });
  };

  // 정속 주행 비율 파이 차트 데이터
  const prepareSpeedMaintainData = () => {
    const tagMapping: Record<string, string> = {
      'high': '고속',
      'middle': '중속',
      'low': '저속',
    };

    const colorMapping: Record<string, string> = {
      'high': COLORS.chart.highSpeed,
      'middle': COLORS.chart.midSpeed,
      'low': COLORS.chart.lowSpeed,
    };

    return carbonData.speedMaintain.graph.map(item => ({
      value: item.ratio,
      label: tagMapping[item.tag] || item.tag,
      color: colorMapping[item.tag] || COLORS.chart.blue,
    }));
  };

  // 차트 데이터 준비
  const idlingData = calculateIdlingDuration();
  const speedMaintainData = prepareSpeedMaintainData();

  // 탭 컨텐츠 렌더링
  const renderContent = () => {
    switch (selected) {
      case '공회전':
        return renderIdlingContent();
      case '정속주행비율':
        return renderSpeedMaintainContent();
      default:
        return renderIdlingContent();
    }
  };

  // 공회전 탭 렌더링
  const renderIdlingContent = () => {
    const scoreColor =
      carbonData.idling.score < 50 ? COLORS.chart.red : COLORS.chart.blue;
    const scoreText = carbonData.idling.score.toFixed(1);
    
    // 총 공회전 시간 계산
    const totalIdlingMinutes = idlingData.reduce((sum, item) => sum + item.duration, 0);
    
    // 공회전 타임라인 차트 설정
    const idlingBarConfig = {
      horizontal: true,
      xAxisThickness: 1,
      xAxisColor: COLORS.chart.grid,
      yAxisThickness: 0,
      yAxisTextStyle: styles.chartAxisText,
      hideYAxisText: false,
      noOfSections: 3,
      barWidth: 20,
      barBorderRadius: 4,
      frontColor: COLORS.chart.blue,
      spacing: 20,
      hideRules: false,
      rulesColor: COLORS.chart.lightGrid,
      rulesType: 'solid',
      showFractionalValues: true,
      roundToDigits: 1,
      showGradient: true,
      gradientColor: COLORS.gradient.blueEnd,
      disablePress: true,
    };

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          총 공회전 시간: {totalIdlingMinutes} 분
        </Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>공회전 시간대 분석</Text>
          <View style={[styles.chartInnerContainer, {minHeight: idlingData.length * 50 + 30}]}>
            <View style={styles.chartContent}>
              <BarChart 
                data={idlingData.map(item => ({
                  value: item.duration,
                  label: item.label,
                  barWidth: 20,
                  labelComponent: () => (
                    <Text style={styles.idlingLabel}>{item.label}</Text>
                  ),
                  frontColor: COLORS.chart.blue,
                  topLabelComponent: () => (
                    <Text style={styles.idlingTimeLabel}>{item.duration.toFixed(1)}분</Text>
                  ),
                }))}
                {...idlingBarConfig}
                maxValue={Math.max(...idlingData.map(item => item.duration)) * 1.2}
                yAxisLabelWidth={60}
                height={idlingData.length * 50}
              />
            </View>

            <View style={styles.idlingTimelineInfo}>
              {idlingData.map((item, index) => (
                <View key={index} style={styles.idlingTimeItem}>
                  <Text style={styles.idlingTimeItemLabel}>{item.label}:</Text>
                  <Text style={styles.idlingTimeItemValue}>
                    {item.startTime} ~ {item.endTime}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 정속주행비율 탭 렌더링
  const renderSpeedMaintainContent = () => {
    const scoreColor =
      carbonData.speedMaintain.score < 50 ? COLORS.chart.red : COLORS.chart.blue;
    const scoreText = carbonData.speedMaintain.score.toFixed(1);

    // 파이 차트 설정
    const pieChartConfig = {
      donut: true,
      showText: true,
      textSize: 14,
      textColor: 'white',
      radius: chartConfig.pieRadius,
      innerRadius: chartConfig.pieInnerRadius,
      centerLabelComponent: () => (
        <View style={styles.chartCenterLabelContainer}>
          <Text style={styles.chartCenterLabel}>주행 비율</Text>
        </View>
      ),
      focusOnPress: false,
      isAnimated: true,
      animationDuration: 800,
    };

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          정속 주행 비율: {carbonData.speedMaintain.graph.find(item => item.tag === 'middle')?.ratio || 0}%
        </Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>속도 유지 비율 분석</Text>
          <View style={styles.chartInnerContainer}>
            <PieChart data={speedMaintainData} {...pieChartConfig} />

            <View style={styles.speedInfoContainer}>
              <Text style={styles.speedInfoTitle}>주행 속도 분포</Text>
              {speedMaintainData.map((item, index) => (
                <View key={index} style={styles.speedInfoItem}>
                  <View style={[styles.speedInfoColor, {backgroundColor: item.color}]} />
                  <Text style={styles.speedInfoLabel}>{item.label}</Text>
                  <Text style={styles.speedInfoValue}>{item.value}%</Text>
                </View>
              ))}
            </View>


          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <HeaderDropdown 
          currentScreen="carbon" 
          primaryColor={COLORS.primary} 
          textColor={COLORS.text.primary}
        />
        <View style={styles.placeholderRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 카드 */}
        <View style={styles.reportHeader}>
          <View style={styles.gaugeContainer}>
            <GaugeChart
              percentage={carbonData.score}
              color={carbonData.score < 50 ? COLORS.chart.red : COLORS.primary}
              size={chartConfig.gaugeSize}
            />
          </View>
        </View>

        {/* 탭 메뉴 */}
        <View style={styles.tabContainer}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => setSelected(opt)}
              style={
                selected === opt
                  ? [styles.tabItem, styles.tabItemActive]
                  : styles.tabItem
              }
              activeOpacity={0.7}>
              <Text
                style={
                  selected === opt ? styles.tabTextActive : styles.tabText
                }>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 선택된 탭 컨텐츠 */}
        <View style={styles.contentContainer}>{renderContent()}</View>

        {/* 로봇 피드백 */}
        <View style={styles.feedbackContainer}>
          <View style={styles.robotContainer}>
            <Image
              source={require('../../assets/modive_robot1.png')}
              style={styles.robotImage}
              accessibilityLabel="모디브 로봇 아이콘"
            />
          </View>
          <View style={styles.feedbackTextContainer}>
            <Text style={styles.feedbackTitle}>운전 피드백</Text>
            <Text style={styles.feedbackText}>
              {selected === '공회전'
                ? carbonData.idling.feedback
                : carbonData.speedMaintain.feedback}
            </Text>
          </View>
        </View>

        {/* 로딩 상태 */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              데이터를 불러오는 중입니다...
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
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
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  headerDropdown: {
    marginLeft: 5,
  },
  placeholderRight: {
    width: 24,
  },
  reportHeader: {
    marginHorizontal: 0,
    marginVertical: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    borderRadius: 16,
    backgroundColor: '#E6F2FF', // 파란색 계열 배경
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 0,
    marginTop: 8,
  },
  tabItem: {
    paddingVertical: 16,
    minHeight: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  contentContainer: {
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#CCE4FF', // 파란색 계열 테두리
  },
  contentBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  contentScore: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 16,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  contentDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.secondary,
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingHorizontal: 16,
  },
  gaugeContainer: {
    marginVertical: 0,
    marginBottom: 8,
    alignItems: 'center',
  },
  chartContainer: {
    marginTop: 24,
    marginBottom: 8,
    width: '100%',
    padding: 24,
    backgroundColor: COLORS.chart.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    color: COLORS.text.primary,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  chartInnerContainer: {
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    minHeight: 250,
    overflow: 'visible',
  },
  chartContent: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 24,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  dataPoint: {
    color: COLORS.text.light,
    fontSize: 12,
    marginBottom: 4,
  },
  chartAxisText: {
    color: COLORS.text.secondary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  chartCenterLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
    padding: 8,
  },
  chartCenterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  gaugeChartContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginBottom: 0,
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  robotContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // 공회전 관련 스타일
  idlingLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginLeft: -50,
    width: 50,
    textAlign: 'right',
  },
  idlingTimeLabel: {
    fontSize: 12,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginLeft: 5,
  },
  idlingTimelineInfo: {
    marginTop: 20,
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  idlingTimeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 224, 0.3)',
  },
  idlingTimeItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    width: '30%',
  },
  idlingTimeItemValue: {
    fontSize: 14,
    color: COLORS.text.primary,
    width: '70%',
    textAlign: 'right',
  },
  // 정속주행 관련 스타일
  speedInfoContainer: {
    marginTop: 24,
    width: '80%',
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  speedInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  speedInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  speedInfoColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  speedInfoLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    flex: 1,
    marginLeft: 8,
  },
  speedInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});

export default CarbonEmissionReportScreen;
