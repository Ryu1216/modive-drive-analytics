import React, {useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DashboardResponse, HomeStackParamList} from '../../types/dashboard';
import WeeklyReportButton from '../../components/Dashboard/WeeklyReportButton';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import ScoreCard from '../../components/Dashboard/DrivingScoreCard';
import {UseResponse} from '../../types/user';
import {useNavigation} from '@react-navigation/native';

export default function DashboardContainer() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [userInfo, setUserInfo] = useState<UseResponse>({
    reward: 0,
    nickname: '신예빈',
    name: '신예빈',
    email: null,
    birthdate: null,
    licenseDate: null,
    alarm: true,
    gender: null,
    phone: null,
  });
  const [dashboard, setDashboard] = useState<DashboardResponse>({
    userId: '100033913147',
    lastDrive: '2025-04-25T10:00:00Z',
    driveCount: 3,
    scores: {
      idlingScore: 100.0,
      speedMaintainScore: 65.0,
      ecoScore: 82.5,
      accelerationScore: 40.0,
      sharpTurnScore: 60.0,
      overSpeedScore: 50.0,
      safetyScore: 50.0,
      reactionScore: 0.0,
      laneDepartureScore: 40.0,
      followingDistanceScore: 64.0,
      accidentPreventionScore: 34.666666666666664,
      drivingTimeScore: 100.0,
      inactivityScore: 40.0,
      attentionScore: 70.0,
      totalScore: 59.291666666666664,
    },
  });

  const [isEnabled, setIsEnabled] = useState(userInfo.alarm);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const drivingReportData = [
    {
      title: '탄소 배출 및 연비 점수',
      color: '#D3E9FF',
      textColor: '#379BFF',
      score: dashboard.scores.ecoScore,
      data: [
        {
          value: dashboard.scores.idlingScore,
          color: '#007FFF',
          label: {text: '공회전'},
        },
        {
          value: dashboard.scores.speedMaintainScore,
          color: '#5CAEFF',
          label: {text: '정속주행 비율'},
        },
      ],
    },
    {
      title: '안전 운전 점수',
      color: '#D8F4E2',
      textColor: '#4ECD7B',
      score: dashboard.scores.safetyScore,
      data: [
        {
          value: dashboard.scores.accelerationScore,
          color: '#4ECD7B',
          label: {text: '급가/감속'},
        },
        {
          value: dashboard.scores.sharpTurnScore,
          color: '#5AF290',
          label: {text: '급회전'},
        },
        {
          value: dashboard.scores.overSpeedScore,
          color: '#CCFFA8',
          label: {text: '과속'},
        },
      ],
    },
    {
      title: '사고 예방 점수',
      color: '#F0D0FF',
      textColor: '#BB27FF',
      score: dashboard.scores.accidentPreventionScore,
      data: [
        {
          value: dashboard.scores.reactionScore,
          color: '#BB27FF',
          label: {text: '반응 속도'},
        },
        {
          value: dashboard.scores.laneDepartureScore,
          color: '#E500FF',
          label: {text: '차선이탈'},
        },
        {
          value: dashboard.scores.followingDistanceScore,
          color: '#FF5EFC',
          label: {text: '안전거리 유지'},
        },
      ],
    },
    {
      title: '주의력 점수',
      color: '#FFF4C0',
      textColor: '#FFD927',
      score: dashboard.scores.attentionScore,
      data: [
        {
          value: dashboard.scores.drivingTimeScore,
          color: '#FFD927',
          label: {text: '운전시간'},
        },
        {
          value: dashboard.scores.inactivityScore,
          color: '#FFFF27',
          label: {text: '미조작 시간'},
        },
      ],
    },
  ];

  return (
    <FlatList
      data={drivingReportData}
      keyExtractor={(_, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
        <>
          <DashboardHeader
            userInfo={userInfo}
            isEnabled={isEnabled}
            toggleSwitch={toggleSwitch}
            dashboard={dashboard}
          />
        </>
      }
      renderItem={({item}) => <ScoreCard {...item} />}
      ListFooterComponent={<WeeklyReportButton navigation={navigation} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
