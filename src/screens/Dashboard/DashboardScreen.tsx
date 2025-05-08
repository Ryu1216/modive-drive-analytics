import React, {useState} from 'react';
import {View, Text, Button, Switch, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

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

  return (
    <View style={styles.container}>
      {/* 상단 프로필 */}
      <View style={styles.profileHeader}>
        <Text style={styles.username}>
          <Text style={styles.highlight}>{userInfo.name}</Text>님의 운전 프로필
        </Text>
        <View style={styles.toggleArea}>
          <Feather name="mic" size={20} color="#4945FF" />
          <Switch
            trackColor={{false: '#767577', true: '#4945FF'}}
            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
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
            <Text style={styles.scoreValue}>{dashboard.summaryScore}</Text> 점
          </Text>

          <View style={styles.scoreBar}>
            <View style={{borderRadius: 15, overflow: 'hidden', marginTop: 8}}>
              <LinearGradient
                colors={['#CCCCFF', '#4945FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{height: 10}}
              />
            </View>
            <Image
              source={require('../../assets/car.png')} // 차 아이콘 추가 시
              style={styles.carIcon}
            />
          </View>

          {/* <View style={styles.scoreBar}>
            <View
              style={[
                styles.scoreProgress,
                {width: `${dashboard.summaryScore}%`},
              ]}
            />
            <Image
              source={require('../../assets/car.png')} // 차 아이콘 추가 시
              style={styles.carIcon}
            />
          </View> */}
        </View>
      </View>

      {/* 주행 기록 영역 */}
      <Button
        title="주간 주행 리포트 보기"
        onPress={() => navigation.navigate('Feedback')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 4,
  },
  mobtiBox: {
    flexDirection: 'row',
    backgroundColor: '#F2F2FF',
    borderRadius: 16,
    marginTop: 15,
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
    fontWeight: 'bold',
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
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#EC008C',
    borderRadius: 5,
  },
  carIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    resizeMode: 'contain',
    top: -10, // 너무 위로 올라간 것
    left: '87.12%', // 종합점수 위치 기준
    marginLeft: -15, // 아이콘 가운데 정렬
  },
});
