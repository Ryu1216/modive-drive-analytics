import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import ReportHeaderSection from '../../components/Driving/ReportHeaderSection';
import TabSelector from '../../components/common/TabSelector';
import TimelineChart from '../../components/Driving/TimelineChart';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import GaugeChart from '../../components/Driving/GaugeChart';
import { DrivingSession, InactivityEvent } from '../../types/report';
import Icon from 'react-native-vector-icons/Feather';

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
          <Text style={styles.progressBarText}>
            {Math.round(progress * 100)}%
          </Text>
        )}
      </View>
    </View>
  );
};

interface AttentionScoreReportScreenProps {
  score: number;
  selectedTab: string;
  tabs: string[];
  loading: boolean;
  drivingTimeSessions: DrivingSession[];
  inactivityEvents: InactivityEvent[];
  drivingTimeScore: number;
  inactivityScore: number;
  drivingTimeFeedback: string;
  inactivityFeedback: string;
  onTabChange: (tab: string) => void;
  onBackPress: () => void;
}

const AttentionScoreReportScreen: React.FC<AttentionScoreReportScreenProps> = ({
  score,
  selectedTab,
  tabs,
  loading,
  drivingTimeSessions,
  inactivityEvents,
  drivingTimeScore,
  inactivityScore,
  drivingTimeFeedback,
  inactivityFeedback,
  onTabChange,
  onBackPress,
}) => {
  // 현재 탭에 따른 점수 및 피드백
  const currentScore = selectedTab === '운전 시간'
    ? drivingTimeScore
    : inactivityScore;

  const currentFeedback = selectedTab === '운전 시간'
    ? drivingTimeFeedback
    : inactivityFeedback;

  // 점수에 따른 색상
  const scoreColor = currentScore < 50 ? COLORS.chart.red : COLORS.chart.yellow;

  // 운전 시간 탭 렌더링
  const renderDrivingTimeContent = () => {
    const scoreText = drivingTimeScore.toFixed(1);
    
    // 첫 번째 세션 정보 추출 (API 예시에는 하나의 세션만 있음)
    const session = drivingTimeSessions[0];
    const totalDrivingHours = session?.durationHours || 0;
    const sessionStartTime = session?.formattedStartTime || "";
    const sessionEndTime = session?.formattedEndTime || "";

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
                4시간 권장 운전 시간 대비 ({totalDrivingHours.toFixed(1)}/4시간)
              </Text>
              <HorizontalProgressBar
                progress={session?.progress || 0}
                width={300}
                height={30}
                color={
                  totalDrivingHours > 4 ? COLORS.chart.red : COLORS.chart.yellow
                }
                style={{marginVertical: 16}}
              />
              
              <View style={styles.progressInfoContainer}>
                <View style={styles.progressInfo}>
                  <Icon name="info" size={16} color={COLORS.chart.blue} />
                  <Text style={styles.progressInfoText}>
                    한 번에 4시간 이상 운전 시 휴식이 필요합니다.
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.safetyGuideContainer}>
              <Text style={styles.safetyGuideTitle}>안전 운전 시간 가이드</Text>
              <View style={styles.safetyGuideItem}>
                <Icon name="check-circle" size={16} color={COLORS.chart.green} />
                <Text style={styles.safetyGuideText}>
                  2시간 연속 운전 후에는 최소 10~15분 휴식
                </Text>
              </View>
              <View style={styles.safetyGuideItem}>
                <Icon name="check-circle" size={16} color={COLORS.chart.green} />
                <Text style={styles.safetyGuideText}>
                  4시간 이상 운전 시 30분 이상 충분한 휴식
                </Text>
              </View>
              <View style={styles.safetyGuideItem}>
                <Icon name="check-circle" size={16} color={COLORS.chart.green} />
                <Text style={styles.safetyGuideText}>
                  야간 운전은 더 많은 휴식이 필요합니다.
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
    const scoreText = inactivityScore.toFixed(1);
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
                    <Text style={styles.inactivityTime}>{event.formattedTime}</Text>
                    <Icon name="alert-triangle" size={16} color={COLORS.chart.red} />
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.inactivityInfoBox}>
              <Icon name="info" size={20} color={COLORS.primary} />
              <Text style={styles.inactivityInfoText}>
                차량 미조작은 핸들을 잡지 않거나 운전에 주의를 기울이지 않는 상태를 감지한 것입니다.
                주행 중에는 항상 핸들을 잡고 전방 주시를 유지하세요.
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 선택된 탭 컨텐츠 렌더링
  const renderContent = () => {
    switch (selectedTab) {
      case '운전 시간':
        return renderDrivingTimeContent();
      case '미조작 시간':
        return renderInactivityContent();
      default:
        return renderDrivingTimeContent();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* 헤더 및 게이지 차트 */}
      <ReportHeaderSection 
        score={score} 
        onBackPress={onBackPress} 
        screenType="attention" 
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
});

export default AttentionScoreReportScreen;
