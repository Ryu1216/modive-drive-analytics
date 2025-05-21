import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import DetailHeader from '../../components/Driving/DetailHeader';
import ScoreCard from '../../components/Driving/ScoreCard';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import { DrivingDetailData } from '../../types/driving';

interface DrivingDetailScreenProps {
  data: DrivingDetailData;
  cardBgColors: string[];
  handleClose: () => void;
  handleCardPress: (cardName: string) => void;
}

const DrivingDetailScreen: React.FC<DrivingDetailScreenProps> = ({
  data,
  cardBgColors,
  handleClose,
  handleCardPress,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <DetailHeader title="주행 상세" onClose={handleClose} />

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
            <ScoreCard
              key={idx}
              score={score}
              bgColor={cardBgColors[idx]}
              onPress={() => handleCardPress(score.name)}
            />
          ))}
        </View>

        {/* 피드백 메시지 */}
        <FeedbackMessage message={data.message} />
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
  circleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default DrivingDetailScreen;
