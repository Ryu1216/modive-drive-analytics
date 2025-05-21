import React from 'react';
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
import Icon from 'react-native-vector-icons/Feather';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import ReportHeaderSection from '../../components/Driving/ReportHeaderSection';
import { SafetyReportScreenProps } from '../../types/report';

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
  lineChartWidth: screenWidth - 100 > 0 ? screenWidth - 100 : 300,
  lineChartHeight: Math.max(screenHeight * 0.28, 200),
};

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
  // Y축이 0부터 150까지인 차트에서 100km/h의 정확한 위치 계산
  const dataAreaHeight = chartHeight * 0.83; // 실제 데이터 영역
  const topPadding = chartHeight * 0.08; // 상단 여백
  
  // 정확한 위치 계산 (maxValue에서 speedLimit 위치의 비율)
  const percentage = (maxValue - speedLimit) / maxValue;
  
  // 패딩을 고려한 정확한 위치 반환
  return topPadding + (dataAreaHeight * percentage);
};

const SafetyReportScreen: React.FC<SafetyReportScreenProps> = ({
  safetyData,
  selectedTab,
  options,
  loading,
  formattedBarData,
  pieData,
  formattedLineData,
  onTabSelect,
  onBackPress
}) => {
  // 선택된 탭에 따라 적절한 컨텐츠 렌더링하는 함수
  const renderContent = () => {
    switch (selectedTab) {
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
      textSize: 14,
      textColor: 'white',
      textBackgroundColor: 'transparent',
      showTextBackground: false,
      radius: chartConfig.pieRadius,
      innerRadius: chartConfig.pieInnerRadius,
      centerLabelComponent: () => <PieCenterLabel />,
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
            <PieChart 
              data={pieData} 
              {...pieChartConfig} 
              showGradient={false}
              gradientCenterColor={'transparent'}
            />

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
      noOfSections: 6,
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
                  borderStyle: 'dashed',
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
      
      {/* 헤더 섹션 (ReportHeaderSection 사용) */}
      <ReportHeaderSection 
        score={safetyData.score} 
        onBackPress={onBackPress} 
        screenType="safety" 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 탭 섹션 */}
        <View style={styles.tabContainer}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => onTabSelect(opt)}
              style={
                selectedTab === opt
                  ? [styles.tabItem, styles.tabItemActive]
                  : styles.tabItem
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  selectedTab === opt ? styles.tabTextActive : styles.tabText
                }>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 선택된 탭의 컨텐츠 표시 */}
        <View style={styles.contentContainer}>{renderContent()}</View>

        {/* 피드백 메시지 */}
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
              {selectedTab === '급가감속'
                ? safetyData.acceleration.feedback
                : selectedTab === '급회전'
                ? safetyData.turning.feedback
                : safetyData.speeding.feedback}
            </Text>
          </View>
        </View>

        {/* 로딩 상태 표시 */}
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
    borderBottomColor: '#68D392',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  contentContainer: {
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#D8F7E3',
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
