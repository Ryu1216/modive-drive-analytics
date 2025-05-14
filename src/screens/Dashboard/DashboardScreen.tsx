import React, {useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PieChart from 'react-native-pie-chart';

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
type DashboardStackParamList = {
  Dashboard: undefined;
  Feedback: undefined;
};

export default function DashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();
  const [userInfo, setUserInfo] = useState({
    reward: 0,
    nickname: '신예빈',
    name: '신예빈',
    email: null,
    birthdate: null,
    licenseDate: null,
    alarm: false,
    gender: null,
    phone: null,
  });
  const [dashboard, setDashboard] = useState({
    user: {
      notificationsEnabled: true,
    },
    summaryScore: 87,
    lastDriveDate: '2025-04-24',
    totalDriveCount: 58,
    carbonAndEfficiency: {
      idlingScore: 74,
      cruiseRatioScore: 81,
      totalScore: 78,
    },
    safeDriving: {
      accelerationBrakingScore: 69,
      corneringScore: 77,
      speedingScore: 65,
      totalScore: 70,
    },
    accidentPrevention: {
      reactionTimeScore: 84,
      laneDepartureScore: 88,
      safeDistanceScore: 79,
      totalScore: 84,
    },
    attention: {
      driveTimeScore: 76,
      noInputTimeScore: 71,
      totalScore: 74,
    },
  });

  const [isEnabled, setIsEnabled] = useState(
    dashboard.user.notificationsEnabled,
  );
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const driveInfoItems = [
    {
      icon: <MaterialCommunityIcons name="calendar-month" size={15} />,
      label: '최근 운전일',
      value: dashboard.lastDriveDate,
    },
    {
      icon: (
        <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={15} />
      ),
      label: '누적 운전 횟수',
      value: `${dashboard.totalDriveCount}회`,
    },
  ];

  const drivingReportData = [
    {
      title: '탄소 배출 및 연비 점수',
      color: '#D3E9FF',
      textColor: '#379BFF',
      score: dashboard.carbonAndEfficiency.totalScore,
      data: [
        {
          value: dashboard.carbonAndEfficiency.idlingScore,
          color: '#007FFF',
          label: {text: '공회전'},
        },
        {
          value: dashboard.carbonAndEfficiency.cruiseRatioScore,
          color: '#5CAEFF',
          label: {text: '정속주행 비율'},
        },
      ],
    },
    {
      title: '안전 운전 점수',
      color: '#D8F4E2',
      textColor: '#4ECD7B',
      score: dashboard.safeDriving.totalScore,
      data: [
        {
          value: dashboard.safeDriving.accelerationBrakingScore,
          color: '#4ECD7B',
          label: {text: '급가/감속'},
        },
        {
          value: dashboard.safeDriving.corneringScore,
          color: '#5AF290',
          label: {text: '급회전'},
        },
        {
          value: dashboard.safeDriving.speedingScore,
          color: '#CCFFA8',
          label: {text: '과속'},
        },
      ],
    },
    {
      title: '사고 예방 점수',
      color: '#F0D0FF',
      textColor: '#BB27FF',
      score: dashboard.accidentPrevention.totalScore,
      data: [
        {
          value: dashboard.accidentPrevention.reactionTimeScore,
          color: '#BB27FF',
          label: {text: '반응 속도'},
        },
        {
          value: dashboard.accidentPrevention.laneDepartureScore,
          color: '#E500FF',
          label: {text: '차선이탈'},
        },
        {
          value: dashboard.accidentPrevention.safeDistanceScore,
          color: '#FF5EFC',
          label: {text: '안전거리 유지'},
        },
      ],
    },
    {
      title: '주의력 점수',
      color: '#FFF4C0',
      textColor: '#FFD927',
      score: dashboard.attention.totalScore,
      data: [
        {
          value: dashboard.attention.driveTimeScore,
          color: '#FFD927',
          label: {text: '운전시간'},
        },
        {
          value: dashboard.attention.noInputTimeScore,
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
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          {/* 상단 프로필 */}
          <View style={styles.profileHeader}>
            <Text style={styles.username}>
              <Text style={styles.highlight}>{userInfo.nickname}</Text>님의 운전
              프로필
            </Text>
            <View style={styles.toggleArea}>
              <Feather name="volume-2" size={22} color="#4945FF" />
              <Switch
                trackColor={{false: '#767577', true: '#4945FF'}}
                thumbColor={isEnabled ? '#fff' : '#fff'}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>

          {/* Mobti + 점수 */}
          <View style={styles.mobtiBox}>
            <Image
              source={require('../../assets/Mobti_AIUE.png')}
              style={styles.mobtiImg}
            />
            <View style={styles.mobtiTextBox}>
              <Text style={styles.mobtiLabel}>Mobti</Text>
              <Text style={styles.mobtiTitle}>
                <Text style={styles.mobtiType}>AIUE</Text> - 자유로운 드라이버
              </Text>
              <Text style={styles.scoreText}>
                종합점수{' '}
                <Text style={styles.scoreValue}>{dashboard.summaryScore}</Text>
                <Text style={{color: '#EC008C'}}>점</Text>
              </Text>
              <View style={styles.scoreBar}>
                <View style={{borderRadius: 15, overflow: 'hidden'}}>
                  <LinearGradient
                    colors={['#CCCCFF', '#4945FF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[
                      styles.scoreProgress,
                      {width: `${dashboard.summaryScore}%`},
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 주행 기록 */}
          <View style={styles.driveInfoBox}>
            {driveInfoItems.map((item, index) => (
              <View style={styles.driveRecordBox} key={index}>
                <View style={styles.driveRecordLabel}>
                  {item.icon}
                  <Text>{item.label}</Text>
                </View>
                <Text style={styles.mainColorText}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* 타이틀 */}
          <View style={styles.reportBox}>
            <Text style={styles.username}>운전 점수 리포트</Text>
          </View>
        </>
      }
      renderItem={({item}) => (
        <View style={[styles.gridItem, {borderColor: item.color}]}>
          <Text style={[styles.cardTitle, {backgroundColor: item.color}]}>
            {item.title}
          </Text>
          <View style={styles.cardContent}>
            <View style={styles.scoreCard}>
              <PieChart
                widthAndHeight={100}
                series={item.data.map(d => ({value: d.value, color: d.color}))}
                cover={0.7}
              />
              <View style={styles.chartCenterText}>
                <Text style={[styles.centerScoreText, {color: item.textColor}]}>
                  {item.score.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.legendBox}>
              {item.data.map((d, idx) => (
                <View key={idx} style={styles.legendRow}>
                  <View
                    style={[styles.legendDot, {backgroundColor: d.color}]}
                  />
                  <Text style={styles.legendLabel}>
                    {d.label.text}: {d.value}점
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
      ListFooterComponent={
        <TouchableOpacity
          style={styles.weeklyButton}
          onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.weeklyButtonText}>주간 주행 리포트 보기</Text>
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  profileHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  username: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  highlight: {
    fontSize: 20,
    color: '#4945FF',
    fontWeight: 'bold',
  },
  toggleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Mobti + 점수
  mobtiBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5FD', // #F1F5FD, #EFF3FC, #EEF7FE
    borderRadius: 15,
    marginTop: 10,
    padding: 15,
    alignItems: 'center',
  },
  mobtiImg: {
    borderRadius: 15,
    width: 122,
    height: 122,
    marginRight: 15,
  },
  mobtiTextBox: {
    flex: 1,
  },
  mobtiLabel: {
    fontSize: 15,
    color: '#222',
  },
  mobtiTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    color: '#4945FF',
  },
  mobtiType: {
    fontSize: 22,
    color: '#4945FF',
    fontWeight: 'bold',
  },
  scoreText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4945FF',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EC008C',
  },
  scoreBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'visible',
    marginTop: 8,
    position: 'relative',
    backgroundColor: '#c4c4c4',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 5,
  },
  driveInfoBox: {
    backgroundColor: '#F1F5FD',
    borderRadius: 15,
    marginTop: 10,
    padding: 15,
    gap: 8,
  },
  driveRecordBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driveRecordLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  labelText: {
    color: '#000',
  },
  mainColorText: {
    color: '#4945FF',
    fontWeight: '500',
  },
  // 운전 점수 리포트
  reportBox: {
    marginTop: 40,
    marginBottom: 10,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  scoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  legendBox: {
    marginTop: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#444',
  },
  chartCenterText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // LLM 피드백
  weeklyButton: {
    backgroundColor: '#F5F5FF', // 연한 보라톤 배경
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,

    // 그림자 (iOS + Android)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,

    alignItems: 'center',
    marginTop: 20,
  },
  weeklyButtonText: {
    color: '#4945FF',
    fontSize: 16,
    fontWeight: '600',
  },
});
