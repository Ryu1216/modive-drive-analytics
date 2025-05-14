import React, {useState, JSX} from 'react';
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
import Svg, {Path, Circle, G, Text as SvgText, Line} from 'react-native-svg';
import {BarChart, LineChart, PieChart, ProgressChart} from 'react-native-gifted-charts';
import HeaderDropdown from '../../components/common/HeaderDropdown';

// 색상 시스템 정의 - 노란색 테마
const COLORS = {
  primary: '#FFD927', // 메인 컬러 - 노란색
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
  success: '#FFD927', // 메인 컬러와 동일
  chart: {
    green: '#68D392',
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#BB27FF',
    blue: '#4299E1',
    yellow: '#FFD927', // 메인 컬러와 동일
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
    inactivity: '#E53E3E', // 미조작 시간 표시 색상
  },
  gradient: {
    yellowStart: 'rgba(255, 217, 39, 0.6)', // 메인 컬러 기반 그라데이션
    yellowEnd: 'rgba(255, 217, 39, 0.1)', // 메인 컬러 기반 그라데이션
    orangeStart: 'rgba(237, 137, 54, 0.6)',
    orangeEnd: 'rgba(237, 137, 54, 0.1)',
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

// 주의력 점수 화면의 탭 - 변경됨
const options = ['운전 시간', '미조작 시간'];

interface GaugeChartProps {
  percentage: number;
  color: string;
  size?: number;
}

// 타임라인 차트의 마커 컴포넌트
const TimelineMarker = ({x, y, color, time}: {x: number; y: number; color: string; time: string}) => (
  <G>
    <Circle cx={x} cy={y} r={6} fill={color} />
    <SvgText x={x} y={y - 12} fontSize={9} fill={COLORS.text.secondary} textAnchor="middle">
      {time}
    </SvgText>
  </G>
);

// 게이지 차트 컴포넌트
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
          stroke="#FFF7CC" // 노란색 계열 배경
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

// 수평 진행 막대 컴포넌트
const HorizontalProgressBar = ({
  progress,
  width = 300,
  height = 30,
  color = COLORS.chart.yellow,
  backgroundColor = 'rgba(255, 217, 39, 0.2)',
  label,
  showPercentage = true,
  style,
}: {
  progress: number;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  style?: any;
}) => {
  return (
    <View style={[styles.progressBarContainer, style]}>
      {label && <Text style={styles.progressBarLabel}>{label}</Text>}
      <View
        style={[
          styles.progressBarBackground,
          {width, height, backgroundColor},
        ]}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress * 100}%`,
              height,
              backgroundColor: color,
            },
          ]}
        />
        {showPercentage && (
          <Text style={styles.progressBarText}>{`${(progress * 100).toFixed(0)}%`}</Text>
        )}
      </View>
    </View>
  );
};

// 타임라인 차트
const TimelineChart = ({
  events,
  title,
  height = 200,
  showMarkers = true,
}: {
  events: Array<{time: string; formattedTime: string}>;
  title: string;
  height?: number;
  showMarkers?: boolean;
}) => {
  const width = screenWidth - 80;
  
  // 시간을 분 단위로 변환
  const timeToMinutes = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes();
  };
  
  // 이벤트를 시간순으로 정렬
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );
  
  // 시작 시간과 종료 시간 찾기 (최소 1시간 범위)
  const firstEventTime = timeToMinutes(sortedEvents[0].time);
  const lastEventTime = timeToMinutes(sortedEvents[sortedEvents.length - 1].time);
  const startTime = Math.max(0, firstEventTime - 15);
  const endTime = lastEventTime + 15;
  
  // 타임라인 시간 범위 (최소 60분)
  const timeRange = Math.max(endTime - startTime, 60);
  
  return (
    <View style={[styles.timelineContainer, { height }]}>
      <Text style={styles.timelineTitle}>{title}</Text>
      
      <Svg width={width} height={height - 40}>
        {/* 타임라인 기본선 */}
        <Line 
          x1={0} 
          y1={height / 2} 
          x2={width} 
          y2={height / 2} 
          stroke={COLORS.chart.grid} 
          strokeWidth={2} 
        />
        
        {/* 시간 눈금 (30분 간격) */}
        {Array.from({ length: Math.ceil(timeRange / 30) + 1 }).map((_, i) => {
          const tickTime = startTime + i * 30;
          const tickX = ((tickTime - startTime) / timeRange) * width;
          const hours = Math.floor(tickTime / 60);
          const minutes = tickTime % 60;
          const timeLabel = `${hours}:${minutes.toString().padStart(2, '0')}`;
          
          return (
            <G key={`tick-${i}`}>
              <Line 
                x1={tickX} 
                y1={height / 2 - 5} 
                x2={tickX} 
                y2={height / 2 + 5} 
                stroke={COLORS.chart.grid} 
                strokeWidth={1} 
              />
              <SvgText 
                x={tickX} 
                y={height / 2 + 20} 
                fontSize={10} 
                fill={COLORS.text.secondary}
                textAnchor="middle"
              >
                {timeLabel}
              </SvgText>
            </G>
          );
        })}
        
        {/* 이벤트 마커 */}
        {showMarkers && sortedEvents.map((event, index) => {
          const eventTime = timeToMinutes(event.time);
          const eventX = ((eventTime - startTime) / timeRange) * width;
          
          return (
            <TimelineMarker 
              key={`marker-${index}`} 
              x={eventX} 
              y={height / 2} 
              color={COLORS.chart.inactivity}
              time={event.formattedTime}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const AttentionScoreReportScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(options[0]);
  const [loading, setLoading] = useState(false);

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 시간 계산 함수 (분 단위)
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  };

  // API 명세서에 맞게 변경된 데이터
  const attentionData = {
    score: 70.0,
    drivingTime: {
      score: 100.0,
      feedback: "안전한 운전 시간 내에서 운전했습니다. 장거리 운전 시에는 2시간마다 휴식을 취하는 습관을 들이세요.",
      graph: [
        {
          startTime: "2025-04-25T08:00:00Z",
          endTime: "2025-04-25T10:00:00Z"
        }
      ]
    },
    inactivity: {
      score: 40.0,
      feedback: "운전 중 차량 미조작 상태가 여러 번 감지되었습니다. 주행 중에는 항상 핸들을 잡고 있어야 합니다.",
      graph: [
        "2025-04-25T08:03:11Z",
        "2025-04-25T08:05:07Z",
        "2025-04-25T08:18:33Z",
        "2025-04-25T08:54:38Z",
        "2025-04-25T09:38:28Z",
        "2025-04-25T09:40:16Z"
      ]
    }
  };

  // 운전 시간 데이터 준비
  const prepareDrivingTimeData = () => {
    const drivingTimes = attentionData.drivingTime.graph.map((session, index) => {
      const durationMinutes = calculateDuration(session.startTime, session.endTime);
      const durationHours = durationMinutes / 60;
      
      return {
        id: index,
        startTime: session.startTime,
        endTime: session.endTime,
        formattedStartTime: formatTime(session.startTime),
        formattedEndTime: formatTime(session.endTime),
        durationMinutes,
        durationHours,
        // 4시간 기준으로 진행률 계산 (권장 최대 연속 운전 시간)
        progress: Math.min(durationHours / 4, 1)
      };
    });
    
    return drivingTimes;
  };

  // 미조작 시간 이벤트 데이터 준비
  const prepareInactivityData = () => {
    return attentionData.inactivity.graph.map((time, index) => {
      return {
        id: index,
        time,
        formattedTime: formatTime(time)
      };
    });
  };

  // 데이터 준비
  const drivingTimeSessions = prepareDrivingTimeData();
  const inactivityEvents = prepareInactivityData();

  // 탭 컨텐츠 렌더링
  const renderContent = () => {
    switch (selected) {
      case '운전 시간':
        return renderDrivingTimeContent();
      case '미조작 시간':
        return renderInactivityContent();
      default:
        return renderDrivingTimeContent();
    }
  };

  // 운전 시간 탭 렌더링
  const renderDrivingTimeContent = () => {
    const scoreColor =
      attentionData.drivingTime.score < 50 ? COLORS.chart.red : COLORS.chart.yellow;
    const scoreText = attentionData.drivingTime.score.toFixed(1);
    
    // 첫 번째 세션 정보 추출 (API 예시에는 하나의 세션만 있음)
    const session = drivingTimeSessions[0];
    const totalDrivingHours = session.durationHours;
    const sessionStartTime = session.formattedStartTime;
    const sessionEndTime = session.formattedEndTime;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          총 운전 시간: {totalDrivingHours.toFixed(1)}시간
        </Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>운전 시간 분석</Text>
          <View style={styles.chartInnerContainer}>
            <View style={styles.drivingTimeInfo}>
              <View style={styles.drivingTimeRow}>
                <Icon name="clock" size={20} color={COLORS.chart.yellow} />
                <Text style={styles.drivingTimeText}>
                  {sessionStartTime} ~ {sessionEndTime}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressTitle}>
                4시간 권장 운전 시간 대비 진행률
              </Text>
              <HorizontalProgressBar
                progress={session.progress}
                width={screenWidth * 0.8}
                height={30}
                color={
                  totalDrivingHours > 4 ? COLORS.chart.red : COLORS.chart.yellow
                }
                style={{marginVertical: 16}}
              />
              <View style={styles.progressInfoContainer}>
                <View style={styles.progressInfo}>
                  <Icon name="alert-circle" size={16} color={COLORS.chart.yellow} />
                  <Text style={styles.progressInfoText}>
                    2시간 이상 운전 후 휴식 권장
                  </Text>
                </View>
                <View style={styles.progressInfo}>
                  <Icon name="alert-triangle" size={16} color={COLORS.chart.red} />
                  <Text style={styles.progressInfoText}>
                    4시간 이상 연속 운전 위험
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.safetyGuideContainer}>
              <Text style={styles.safetyGuideTitle}>안전 운전 가이드</Text>
              <View style={styles.safetyGuideItem}>
                <Icon name="check-circle" size={16} color={COLORS.chart.green} />
                <Text style={styles.safetyGuideText}>
                  2시간마다 최소 15분 휴식
                </Text>
              </View>
              <View style={styles.safetyGuideItem}>
                <Icon name="check-circle" size={16} color={COLORS.chart.green} />
                <Text style={styles.safetyGuideText}>
                  휴식 중 스트레칭 및 수분 섭취
                </Text>
              </View>
              <View style={styles.safetyGuideItem}>
                <Icon name="check-circle" size={16} color={COLORS.chart.green} />
                <Text style={styles.safetyGuideText}>
                  하루 8시간 이상 운전 지양
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 미조작 시간 탭 렌더링
  const renderInactivityContent = () => {
    const scoreColor =
      attentionData.inactivity.score < 50 ? COLORS.chart.red : COLORS.chart.yellow;
    const scoreText = attentionData.inactivity.score.toFixed(1);
    const inactivityCount = inactivityEvents.length;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          감지된 차량 미조작: {inactivityCount}회
        </Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>차량 미조작 감지 시점</Text>
          <View style={styles.chartInnerContainer}>
            <TimelineChart
              events={inactivityEvents}
              title="미조작 발생 시간"
              height={200}
            />
            
            <View style={styles.inactivityListContainer}>
              <Text style={styles.inactivityListTitle}>미조작 감지 시간</Text>
              <View style={styles.inactivityList}>
                {inactivityEvents.map((event, index) => (
                  <View key={index} style={styles.inactivityItem}>
                    <Text style={styles.inactivityIndex}>#{index + 1}</Text>
                    <Text style={styles.inactivityTime}>
                      {event.formattedTime}
                    </Text>
                    <Icon name="alert-circle" size={16} color={COLORS.chart.inactivity} />
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.inactivityInfoBox}>
              <Icon name="info" size={20} color={COLORS.primary} />
              <Text style={styles.inactivityInfoText}>
                차량 미조작 감지는 운전자가 핸들을 잡고 있지 않거나, 조작을 하지 않은 상태를 의미합니다.
                안전 운전을 위해 항상 핸들을 올바르게 잡고 운전하세요.
              </Text>
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
          currentScreen="attention" 
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
              percentage={attentionData.score}
              color={attentionData.score < 50 ? COLORS.chart.red : COLORS.primary}
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
              {selected === '운전 시간'
                ? attentionData.drivingTime.feedback
                : attentionData.inactivity.feedback}
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
    borderColor: 'rgba(255, 217, 39, 0.3)',
    borderRadius: 16,
    backgroundColor: '#FFFBEB', // 노란색 계열 배경
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
    borderColor: '#FFF8D6', // 노란색 계열 테두리
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
  progressBarContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  progressBarBackground: {
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarFill: {
    borderRadius: 15,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressBarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: 10,
  },
  drivingTimeInfo: {
    width: '90%',
    padding: 16,
    backgroundColor: 'rgba(255, 217, 39, 0.1)',
    borderRadius: 12,
    marginBottom: 20,
  },
  drivingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  drivingTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 12,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  progressInfoContainer: {
    width: '100%',
    marginTop: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  progressInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  safetyGuideContainer: {
    width: '90%',
    padding: 16,
    backgroundColor: 'rgba(104, 211, 146, 0.1)',
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.chart.green,
  },
  safetyGuideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  safetyGuideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  safetyGuideText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  timelineContainer: {
    width: '100%',
    marginVertical: 16,
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  inactivityListContainer: {
    width: '90%',
    padding: 16,
    backgroundColor: 'rgba(255, 217, 39, 0.1)',
    borderRadius: 12,
    marginTop: 20,
  },
  inactivityListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  inactivityList: {
    width: '100%',
  },
  inactivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 224, 0.3)',
  },
  inactivityIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    width: 40,
  },
  inactivityTime: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  inactivityInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'rgba(255, 217, 39, 0.1)',
    borderRadius: 12,
    marginTop: 20,
    width: '90%',
  },
  inactivityInfoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 12,
    lineHeight: 20,
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
    backgroundColor: 'rgba(255, 217, 39, 0.15)',
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
});

export default AttentionScoreReportScreen;
