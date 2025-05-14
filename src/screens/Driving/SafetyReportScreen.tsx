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
import Svg, {Path, Circle, G, Text as SvgText} from 'react-native-svg';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import HeaderDropdown from '../../components/common/HeaderDropdown';

// 색상 시스템 정의
const COLORS = {
  primary: '#4ECD7B', // 메인 컬러 - 탭 활성화 색상과 동일하게 유지
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
  success: '#68D392', // 메인 컬러와 동일
  chart: {
    green: '#68D392', // 메인 컬러와 동일하게 변경
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#805AD5',
    blue: '#4299E1',
    yellow: '#ECC94B',
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
  },
  gradient: {
    greenStart: 'rgba(104, 211, 146, 0.6)', // 메인 컬러 기반 그라데이션
    greenEnd: 'rgba(104, 211, 146, 0.1)', // 메인 컬러 기반 그라데이션
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
  // 라인 차트 가로 폭을 패딩을 고려해서 조정
  lineChartWidth: screenWidth - 100 > 0 ? screenWidth - 100 : 300,
  // 충분한 높이 확보
  lineChartHeight: Math.max(screenHeight * 0.28, 200),
};

// Fixed Korean text
const options = ['급가감속', '급회전', '과속'];

interface GaugeChartProps {
  percentage: number;
  color: string;
  size?: number;
}

// Chart component definitions for reuse
const AccelerationDataPoint = ({value}: {value: number}) => (
  <Text style={styles.accelerationDataPoint}>{value}</Text>
);

const SpeedingDataPoint = () => <View style={styles.speedingDataPoint} />;

// Pie Chart center label component for reuse
const PieCenterLabel = () => (
  <View style={styles.pieCenterLabelContainer}>
    <Text style={styles.pieCenterLabel}>회전 비율</Text>
  </View>
);

const SpeedLimitLabel = ({limit}: {limit: number}) => (
  <Text style={styles.speedLimitText}>제한속도: {limit}km/h</Text>
);

// 차트의 제한속도 라인 위치를 계산하는 함수
const calculateSpeedLimitPosition = (
  speedLimit: number,
  maxValue: number,
  chartHeight: number,
): number => {
  // 속도 값과 차트 높이의 비례식으로 위치 계산
  // Y축은 0부터 150까지 고정된 범위로 표시 (noOfSections이 6이고, 각 구간이 25km/h)
  const fixedMaxValue = 150; // 고정된 Y축 최대값

  // 정확한 위치 계산: 차트 높이에 대한 스피드 제한의 상대적 위치
  // 차트의 위쪽이 0, 아래쪽이 150이므로 반전시키기 위해 (fixedMaxValue - speedLimit)
  const percentage = (fixedMaxValue - speedLimit) / fixedMaxValue;

  // 계산된 비율에 차트 높이를 곱하여 정확한 픽셀 위치 계산
  // 차트 내부의 패딩을 고려한 추가 조정 없이 정확한 위치 반환
  return chartHeight * percentage;
};

const GaugeChart = ({percentage, color, size = 180}: GaugeChartProps) => {
  const center = size / 2;
  const gaugeRadius = (size / 2) * 0.8;
  const strokeWidth = 20; // 두께 증가

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
          stroke="#baeecc"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* 전경 호 - 그라데이션 효과 */}
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

const SafetyReportScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(options[0]);
  // Loading state used for API calls and async operations
  const [loading, setLoading] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars

  // API 명세서에 맞게 데이터 모델 설정
  const safetyData = {
    score: 51.67, // 전체 안전 점수
    acceleration: {
      score: 40.0,
      ratio: 60.0,
      feedback: '임시 피드백입니다',
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
      // sharpTurn에 매핑
      score: 60.0,
      ratio: 40.0,
      safeRatio: 60.0,
      dangerousRatio: 40.0,
      feedback: '임시 피드백입니다',
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
      // overSpeed에 매핑
      score: 55.0,
      violations: 3,
      feedback: '임시 피드백입니다',
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

  // 차트 데이터 포맷팅 함수
  // 급가속/감속 바 차트 데이터 준비
  const prepareAccelerationChartData = () => {
    // Create value labels for data points
    const valueLabels: Record<number, JSX.Element> = {};
    safetyData.acceleration.chartData.forEach(
      (item: {value: number; label: string; flag: boolean; time: string}) => {
        valueLabels[item.value] = <AccelerationDataPoint value={item.value} />;
      },
    );

    // Format bar chart data
    return safetyData.acceleration.chartData.map(item => ({
      value: item.value,
      label: item.label,
      frontColor: item.flag ? COLORS.chart.red : COLORS.primary, // 위험(flag=true)인 경우 빨간색, 그렇지 않으면 메인 컬러
      topLabelComponent: () => valueLabels[item.value],
    }));
  };

  // 회전 스타일 분석을 위한 파이 차트 데이터 준비 함수
  const prepareTurningChartData = () => {
    return [
      // 위험 회전 데이터
      {
        value: safetyData.turning.dangerousRatio,
        color: COLORS.chart.orange,
        text: `${safetyData.turning.dangerousRatio}%`,
        textColor: 'white',
        name: '위험 회전',
        focused: false,
        strokeWidth: 0,
      },
      // 안전 회전 데이터
      {
        value: safetyData.turning.safeRatio,
        color: COLORS.chart.green,
        text: `${safetyData.turning.safeRatio}%`,
        textColor: 'white',
        name: '안전 회전',
        focused: false,
        strokeWidth: 0,
      },
    ];
  };

  // 과속 차트 데이터 준비 함수
  const prepareSpeedingChartData = () => {
    return safetyData.speeding.chartData.map(
      (item: {speed: number; time: string; period: number}, index: number) => {
        const isOverLimit = item.speed > safetyData.speeding.speedLimit;

        return {
          value: item.speed,
          // 제한속도 초과 시에만 데이터 포인트에 속도값 표시
          dataPointText: isOverLimit ? item.speed.toString() : '',
          // 데이터 포인트가 8개 이상일 경우 짝수 인덱스에만 레이블 표시
          label:
            safetyData.speeding.chartData.length > 8 && index % 2 !== 0
              ? ''
              : `${item.period}`,
          // 속도 제한 초과 시 강조 표시를 위한 커스텀 데이터 포인트
          customDataPoint: isOverLimit
            ? () => <SpeedingDataPoint />
            : undefined,
          showStrip: isOverLimit,
          stripHeight: 4,
          stripColor: COLORS.chart.red,
          color: isOverLimit ? COLORS.chart.red : COLORS.chart.green,
        };
      },
    );
  };

  // 각 차트 데이터 준비
  const formattedBarData = prepareAccelerationChartData();
  const pieData = prepareTurningChartData();
  const formattedLineData = prepareSpeedingChartData();

  // 선택된 탭에 따라 적절한 컨텐츠 렌더링하는 함수
  const renderContent = () => {
    switch (selected) {
      case '급가감속':
        return renderAccelerationContent();
      case '급회전':
        return renderTurningContent();
      case '과속':
        return renderSpeedingContent();
      default:
        return renderAccelerationContent();
    }
  };

  // 급가속/감속 탭 렌더링 함수
  const renderAccelerationContent = () => {
    const scoreColor =
      safetyData.acceleration.score < 50
        ? COLORS.chart.red
        : COLORS.chart.green;
    const scoreText = safetyData.acceleration.score.toFixed(1);

    // 바 차트 설정
    const barChartConfig = {
      barWidth: chartConfig.barWidth,
      spacing: chartConfig.barSpacing,
      barBorderRadius: 10,
      yAxisThickness: 0,
      xAxisThickness: 1,
      xAxisColor: COLORS.chart.grid,
      height: chartConfig.lineChartHeight,
      noOfSections: 4,
      maxValue: 100,
      showLine: true,
      isAnimated: true,
      animationDuration: 800,
      barStyle: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
      },
      lineConfig: {
        color: COLORS.chart.purple,
        thickness: 3,
        curved: true,
        hideDataPoints: false,
        dataPointsShape: 'circular',
        dataPointsWidth: 10,
        dataPointsHeight: 10,
        dataPointsColor: COLORS.chart.purple,
        startIndex: 0,
        endIndex: formattedBarData.length - 1,
      },
    };

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>급가감속 점수 {scoreText}점</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{safetyData.acceleration.title}</Text>
          <View style={styles.chartInnerContainer}>
            <View style={styles.chartContent}>
              <BarChart data={formattedBarData} {...barChartConfig} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 급회전 탭 렌더링 함수
  const renderTurningContent = () => {
    const scoreColor =
      safetyData.turning.score < 50 ? COLORS.chart.red : COLORS.chart.green;
    const scoreText = safetyData.turning.score.toFixed(1);
    const safeRatioText = safetyData.turning.safeRatio;

    // 파이차트 설정 객체
    const pieChartConfig = {
      donut: true,
      showText: true,
      textSize: 16,
      textColor: 'white',
      textBackgroundColor: 'rgba(0,0,0,0.4)',
      showTextBackground: true,
      textBackgroundRadius: 16,
      radius: chartConfig.pieRadius,
      innerRadius: chartConfig.pieInnerRadius,
      centerLabelComponent: PieCenterLabel,
      focusOnPress: true,
      toggleFocusOnPress: true,
      isAnimated: true,
      animationDuration: 800,
    };

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>안전 회전 비율 {safeRatioText}%</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{safetyData.turning.title}</Text>
          <View style={styles.chartInnerContainer}>
            <PieChart data={pieData} {...pieChartConfig} />

            <View style={styles.legendContainer}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, {backgroundColor: item.color}]}
                  />
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 과속 탭 렌더링 함수
  const renderSpeedingContent = () => {
    const scoreColor =
      safetyData.speeding.score < 50 ? COLORS.chart.red : COLORS.chart.green;
    const scoreText = safetyData.speeding.score.toFixed(1);

    // 라인 차트 설정
    const lineChartConfig = {
      width: chartConfig.lineChartWidth,
      height: chartConfig.lineChartHeight,
      hideDataPoints: false,
      spacing: formattedLineData.length > 8 ? 25 : 32,
      color: COLORS.primary,
      thickness: 3,
      startFillColor: 'rgba(104, 211, 146, 0.6)',
      endFillColor: 'rgba(104, 211, 146, 0.1)',
      initialSpacing: 16,
      yAxisColor: COLORS.chart.grid,
      yAxisThickness: 1,
      rulesColor: COLORS.chart.grid,
      yAxisTextStyle: styles.chartAxisText,
      xAxisColor: COLORS.chart.grid,
      xAxisThickness: 1,
      showVerticalLines: true,
      verticalLinesColor: COLORS.chart.lightGrid,
      yAxisLabelTexts: ['0', '25', '50', '75', '100', '125', '150'],
      yAxisLabelWidth: 45,
      xAxisLabelTextStyle: styles.chartAxisText,
      xAxisLabelsHeight: 24,
      xAxisLabelsVerticalShift: 5,
      curved: true,
      isAnimated: true,
      animationDuration: 800,
      noOfSections: 6, // 25km/h 간격으로 6개의 섹션
      showYAxisIndices: true,
      yAxisIndicesHeight: 4,
      rulesType: 'solid',
      rulesThickness: 1,
      hideRules: false,
      maxValue: 150, // 고정된 최대값 사용
      hideOrigin: true,
      focusedDataPointRadius: 6,
      showFractionalValues: true,
      scrollToEnd: safetyData.speeding.chartData.length > 10,
      scrollAnimation: true,
      adjustToWidth: safetyData.speeding.chartData.length <= 8,
      pointerConfig: {
        pointerStripHeight: 160,
        pointerStripColor: 'rgba(100, 100, 100, 0.2)',
        pointerStripWidth: 3,
        pointerColor: COLORS.chart.green,
        radius: 8,
        pointerLabelWidth: 110,
        pointerLabelHeight: 40,
        pointerVanishDelay: 2000,
        activatePointersOnLongPress: true,
        autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: Array<{value?: number}>) => {
          const item = items[0];
          const isOverLimit =
            (item?.value || 0) > safetyData.speeding.speedLimit;
          return (
            <View
              style={[
                styles.pointerLabelContainer,
                {borderColor: isOverLimit ? COLORS.chart.red : COLORS.primary},
              ]}>
              <Text
                style={[
                  styles.pointerLabelText,
                  {color: isOverLimit ? COLORS.chart.red : COLORS.primary},
                ]}>
                {item?.value} km/h
              </Text>
            </View>
          );
        },
      },
    };

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          법정 속도 위반 횟수 {safetyData.speeding.violations}회
        </Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{safetyData.speeding.title}</Text>
          <View
            style={[
              styles.chartInnerContainer,
              {minHeight: chartConfig.lineChartHeight + 40},
            ]}>
            <View style={styles.chartContent}>
              <LineChart data={formattedLineData} {...lineChartConfig} />

              {/* 제한속도 표시 라인 */}
              <View
                style={{
                  position: 'absolute',
                  width: '110%',
                  left: '-5%',
                  borderWidth: 1.5,
                  borderColor: COLORS.chart.red,
                  borderStyle: 'dashed' as 'dashed',
                  zIndex: 5,
                  shadowColor: COLORS.chart.red,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 3,
                  top: calculateSpeedLimitPosition(
                    safetyData.speeding.speedLimit,
                    150,
                    chartConfig.lineChartHeight,
                  ),
                }}>
                <SpeedLimitLabel limit={safetyData.speeding.speedLimit} />
              </View>
            </View>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {backgroundColor: COLORS.chart.green},
                ]}
              />
              <Text style={styles.legendText}>평균 속도</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.limitLine, {backgroundColor: COLORS.chart.red}]}
              />
              <Text style={styles.legendText}>제한 속도</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendText}>※ 가로축: 시간 구간</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {/* Header with back button and dropdown */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <HeaderDropdown 
          currentScreen="safety" 
          primaryColor={COLORS.primary} 
          textColor={COLORS.text.primary}
        />
        <View style={styles.placeholderRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 카드 */}
        <View style={styles.reportHeader}>
          <View style={styles.gaugeContainer}>
            {/* GaugeChart 색상 관리 */}
            <GaugeChart
              percentage={safetyData.score}
              color={
                safetyData.score < 50 ? COLORS.chart.red : COLORS.chart.green
              }
              size={chartConfig.gaugeSize}
            />
          </View>
        </View>

        {/* Option Tabs */}
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
              activeOpacity={0.7} // 터치 피드백 추가
            >
              <Text
                style={
                  selected === opt ? styles.tabTextActive : styles.tabText
                }>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected content */}
        <View style={styles.contentContainer}>{renderContent()}</View>

        {/* Robot feedback */}
        <View style={styles.feedbackContainer}>
          <View style={styles.robotContainer}>
            <Image
              source={require('../../assets/modive_robot1.png')}
              style={styles.robotImage}
              accessibilityLabel="모디브 로봇 아이콘" // 대체 텍스트 추가
            />
          </View>
          <View style={styles.feedbackTextContainer}>
            <Text style={styles.feedbackTitle}>운전 피드백</Text>
            <Text style={styles.feedbackText}>
              {selected === '급가감속'
                ? safetyData.acceleration.feedback
                : selected === '급회전'
                ? safetyData.turning.feedback
                : safetyData.speeding.feedback}
            </Text>
          </View>
        </View>

        {/* 로딩 상태 UI 추가 */}
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
    borderColor: 'rgba(104, 211, 146, 0.3)',
    borderRadius: 16,
    backgroundColor: '#F4FCF7', // 이 부분을 '#F4FCF7'로 변경
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    marginRight: 4,
    textAlign: 'center',
  },
  headerScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#68D392',
  },
  headerScoreUnit: {
    fontSize: 18,
    color: '#68D392',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 0,
    marginTop: 8,
    // borderBottomWidth: 1,  // 회색 선 제거
    // borderBottomColor: '#E5E5E5',  // 회색 선 제거
  },
  tabItem: {
    paddingVertical: 16,
    minHeight: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 3, // 초록색 선 유지
    borderBottomColor: '#68D392', // 초록색 선 유지
  },
  contentContainer: {
    padding: 16, // 내부 패딩 추가
    marginTop: 0, // 상단 마진 제거
    borderRadius: 16, // 둥근 모서리 추가
    marginHorizontal: 0,
    marginBottom: 16,
    marginTop: 16,
    borderWidth: 4, // 테두리 두께 추가
    borderColor: '#D8F7E3', // 테두리 색상을 연한 민트색으로 설정
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
    // 그림자 제거
    // shadowColor: COLORS.shadow,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
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
  limitLine: {
    width: 12,
    height: 2,
    backgroundColor: COLORS.chart.red,
    marginRight: 6,
  },
  speedLimitText: {
    position: 'absolute',
    right: 5,
    top: -24,
    color: COLORS.chart.red,
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.chart.red,
    overflow: 'hidden',
    // 가시성을 위한 그림자 추가
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  speedLimitLine: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.chart.red,
    borderStyle: 'dashed',
    zIndex: 5,
    shadowColor: COLORS.chart.red,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
    left: -16,
    right: -16,
    width: 'auto',
  },
  accelerationDataPoint: {
    color: COLORS.text.light,
    fontSize: 12,
    marginBottom: 4,
  },
  speedingDataPoint: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.chart.red,
    borderRadius: 5,
  },
  turningCenterLabel: {
    fontSize: 20,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    backgroundColor: 'rgba(104, 211, 146, 0.15)',
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
  gaugeChartContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginBottom: 0,
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
  chartContent: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  chartAxisText: {
    color: COLORS.text.secondary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  pieCenterLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
    padding: 8,
  },
  pieCenterEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  pieCenterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  pointerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 50,
    padding: 8,
    // 그림자 및 elevation 제거
    // elevation: 4,
    // shadowColor: COLORS.shadow,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
  },
  pointerLabelText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default SafetyReportScreen;
