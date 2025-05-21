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
import { BarChart, PieChart } from 'react-native-gifted-charts';
import HeaderDropdown from '../../components/common/HeaderDropdown';
import TabSelector from '../../components/common/TabSelector';
import ReportHeaderSection from '../../components/Driving/ReportHeaderSection';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import { IdlingEvent, SpeedMaintainItem } from '../../types/report';

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

interface CarbonEmissionReportScreenProps {
  score: number;
  selectedTab: string;
  tabs: string[];
  loading: boolean;
  idlingEvents: IdlingEvent[];
  speedMaintainData: SpeedMaintainItem[];
  idlingScore: number;
  speedMaintainScore: number;
  idlingFeedback: string;
  speedMaintainFeedback: string;
  totalIdlingMinutes: number;
  onTabChange: (tab: string) => void;
  onBackPress: () => void;
}

const CarbonEmissionReportScreen: React.FC<CarbonEmissionReportScreenProps> = ({
  score,
  selectedTab,
  tabs,
  loading,
  idlingEvents,
  speedMaintainData,
  idlingScore,
  speedMaintainScore,
  idlingFeedback,
  speedMaintainFeedback,
  totalIdlingMinutes,
  onTabChange,
  onBackPress
}) => {
  // 현재 탭에 따른 점수 및 피드백
  const currentScore = selectedTab === '공회전'
    ? idlingScore
    : speedMaintainScore;

  const currentFeedback = selectedTab === '공회전'
    ? idlingFeedback
    : speedMaintainFeedback;
  
  // 점수에 따른 색상
  const scoreColor = currentScore < 50 ? COLORS.chart.red : COLORS.chart.blue;

  // 공회전 탭 렌더링
  const renderIdlingContent = () => {
    const scoreText = idlingScore.toFixed(1);
    
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
          <View style={[styles.chartInnerContainer, {minHeight: idlingEvents.length * 50 + 30}]}>
            <View style={styles.chartContent}>
              <BarChart 
                data={idlingEvents.map(item => ({
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
                maxValue={Math.max(...idlingEvents.map(item => item.duration)) * 1.2}
                yAxisLabelWidth={60}
                height={idlingEvents.length * 50}
              />
            </View>

            <View style={styles.idlingTimelineInfo}>
              {idlingEvents.map((item, index) => (
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
    const scoreText = speedMaintainScore.toFixed(1);
    const middleSpeedRatio = speedMaintainData.find(item => item.label === '중속')?.value ?? 0;

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
          정속 주행 비율: {middleSpeedRatio}%
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

  // 선택된 탭 컨텐츠 렌더링
  const renderContent = () => {
    switch (selectedTab) {
      case '공회전':
        return renderIdlingContent();
      case '정속주행비율':
        return renderSpeedMaintainContent();
      default:
        return renderIdlingContent();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* 헤더 및 게이지 차트 */}
      <ReportHeaderSection 
        score={score} 
        onBackPress={onBackPress} 
        screenType="carbon" 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 탭 선택기 */}
        <TabSelector
          options={tabs}
          selectedTab={selectedTab}
          onTabChange={onTabChange}
          primaryColor={COLORS.primary}
        />

        {/* 선택된 탭 컨텐츠 */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>

        {/* 피드백 메시지 */}
        <FeedbackMessage
          title={`${selectedTab} 피드백`}
          message={currentFeedback}
        />

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
  }
});

export default CarbonEmissionReportScreen;
